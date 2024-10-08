import { AICharacterManager } from "ai-character"; // Import AICharacterManager from the package

type Listener = () => void;

export class ChatControlsController {
  private manager: AICharacterManager;
  private isSpeaking: boolean = false;
  private audio: HTMLAudioElement | null = null;

  private speakingStartListeners: Listener[] = [];
  private speakingStopListeners: Listener[] = [];

  constructor(manager: AICharacterManager) {
    this.manager = manager;

    // Listen for messages from the parent window (or iframe's parent)
    window.addEventListener("message", this.handlePostMessage.bind(this));
  }

  /**
   * Handle postMessage events from the parent window.
   * This listens for "sendSpeech" and "stopSpeech" commands.
   */
  private async handlePostMessage(event: MessageEvent) {
    // You can optionally verify the origin of the message here
    if (event.origin !== window.origin && event.data) {
      const { type, message } = event.data;

      // Handle different message types
      if (type === "sendSpeech") {
        if (typeof message === "string") {
          await this.speak(message);
          // Optionally notify the parent window that speech has started
          window.parent.postMessage({ type: "speechStarted" }, "*");
        }
      } else if (type === "stopSpeech") {
        this.stopSpeaking();
        // Optionally notify the parent window that speech has stopped
        window.parent.postMessage({ type: "speechStopped" }, "*");
      }
    }
  }

  /**
   * Send a message to the AI character and make it speak the response.
   * @param message The message the user sends.
   */
  async speak(message: string) {
    try {
      // Let the character respond and speak
      const { data, audio } = await this.manager.say(message);
      this.isSpeaking = true;
      this.notifyListeners("speakingStart"); // Notify that speaking has started

      this.audio = audio;
      this.audio.addEventListener("ended", () => {
        this.handleSpeechEnd();
      });
    } catch (error) {
      console.error("Error in speech synthesis:", error);
      this.handleSpeechEnd(); // Ensure we handle any errors
    }
  }

  /**
   * Handle when the speech ends, resetting the speaking state.
   */
  private handleSpeechEnd() {
    this.isSpeaking = false;
    this.notifyListeners("speakingStop"); // Notify listeners that speaking has stopped
    this.audio = null;
    this.manager.stop(); // Stop the AI character from speaking
    // Notify the parent window that the speech has ended
    window.parent.postMessage({ type: "speechStopped" }, "*");
  }

  /**
   * Stop the AI character from speaking (if possible).
   */
  stopSpeaking() {
    if (this.isSpeaking && this.audio) {
      this.audio.pause(); // Stop the audio
      this.audio.currentTime = 0; // Reset to the beginning
      this.handleSpeechEnd(); // Manually trigger the end of speech
    }
  }

  /**
   * Check if the AI character is currently speaking.
   * @returns {boolean} True if speaking, false otherwise.
   */
  isCurrentlySpeaking() {
    return this.isSpeaking;
  }

  /**
   * Add an event listener for speaking start and stop.
   * @param eventType - "speakingStart" or "speakingStop"
   * @param listener - The listener function to be called when the event occurs.
   */
  addEventListener(
    eventType: "speakingStart" | "speakingStop",
    listener: Listener
  ) {
    if (eventType === "speakingStart") {
      this.speakingStartListeners.push(listener);
    } else if (eventType === "speakingStop") {
      this.speakingStopListeners.push(listener);
    }
  }

  /**
   * Remove an event listener for speaking start and stop.
   * @param eventType - "speakingStart" or "speakingStop"
   * @param listener - The listener function to be removed.
   */
  removeEventListener(
    eventType: "speakingStart" | "speakingStop",
    listener: Listener
  ) {
    if (eventType === "speakingStart") {
      this.speakingStartListeners = this.speakingStartListeners.filter(
        (l) => l !== listener
      );
    } else if (eventType === "speakingStop") {
      this.speakingStopListeners = this.speakingStopListeners.filter(
        (l) => l !== listener
      );
    }
  }

  /**
   * Notify all listeners of a specific event.
   * @param eventType - "speakingStart" or "speakingStop"
   */
  private notifyListeners(eventType: "speakingStart" | "speakingStop") {
    const listeners =
      eventType === "speakingStart"
        ? this.speakingStartListeners
        : this.speakingStopListeners;
    listeners.forEach((listener) => listener());
  }
}
