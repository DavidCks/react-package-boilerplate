import { AICharacterManager } from "ai-character";
import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaStop } from "react-icons/fa";
import { ChatControlsController } from "./ChatControlsController"; // Import the controller

export type ChatControlsProps = {
  manager: AICharacterManager;
};

export const ChatControls: React.FC<ChatControlsProps> = ({ manager }) => {
  const [message, setMessage] = useState("");
  const [controller, setController] = useState<ChatControlsController | null>(
    null
  );
  const [isSpeaking, setIsSpeaking] = useState(false); // State to track whether the controller is speaking

  useEffect(() => {
    // Initialize the controller with the provided manager
    const newController = new ChatControlsController(manager);
    setController(newController);

    // Event listener for when speaking starts
    const handleSpeakingStart = () => {
      setIsSpeaking(true);
    };

    // Event listener for when speaking stops
    const handleSpeakingStop = () => {
      setIsSpeaking(false);
    };

    // Assuming the controller has event listeners
    if (newController) {
      newController.addEventListener("speakingStart", handleSpeakingStart);
      newController.addEventListener("speakingStop", handleSpeakingStop);
    }

    // Cleanup listeners on unmount
    return () => {
      if (newController) {
        newController.removeEventListener("speakingStart", handleSpeakingStart);
        newController.removeEventListener("speakingStop", handleSpeakingStop);
      }
    };
  }, [manager]);

  const handleSendMessage = () => {
    if (message.trim() && controller) {
      controller.speak(message); // Use controller to send the message
      setMessage(""); // Clear input after sending
    }
  };

  const handleStopSpeaking = () => {
    if (controller) {
      controller.stopSpeaking(); // Stop the speaking action
      setIsSpeaking(false); // Set speaking state to false
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column", // Change this to "column" to arrange elements vertically
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* Row of icons visible only when speaking */}
      {isSpeaking ||
        (true && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <button
              onClick={handleStopSpeaking}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0008",
                borderRadius: "16px",
                padding: "10px",
                border: "none",
                cursor: "pointer",
                color: "#ffffff", // White stop icon
              }}
            >
              <FaStop size={24} />
            </button>
          </div>
        ))}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "0px",
          padding: "10px",
          borderRadius: "22px",
          background: "#0008",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do you want me to say?"
          style={{
            flex: 1,
            padding: "10px",
            color: "#fff",
            border: "none",
            background: "transparent",
            borderRadius: "12px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#fff", // Icon color
          }}
        >
          <FaPaperPlane
            style={{
              paddingInlineEnd: "10px",
            }}
            size={24}
          />
        </button>
      </div>
    </div>
  );
};
