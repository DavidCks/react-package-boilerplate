import { useEffect, useRef, useState } from "react";
import { SandaiClient, UrlBuilder, VoiceNames } from "sandai-core/index";

/**
 * Props for the `AI3DCharacter` component.
 *
 * @property {string} url - The base URL for the Sandai AI 3D character chat interface.
 * @property {(client: SandaiClient) => void} onLoad - Callback function triggered when the SandaiClient is loaded.
 * @property {string} [vrmUrl] - Optional URL for the VRM model to be loaded as the 3D character.
 * @property {VoiceNames} [voiceName] - Optional name of the voice to be used by the 3D character.
 * @property {boolean} [showControls] - Optional flag to determine if controls should be displayed in the interface.
 */
export type AI3DCharacterProps = {
  url: string;
  onLoad: (client: SandaiClient) => void;
  vrmUrl?: string;
  voiceName?: VoiceNames;
  showControls?: boolean;
};

/**
 * A React component that renders a 3D character using Sandai.
 *
 * This component dynamically constructs the URL based on the provided props and initializes
 * a `SandaiClient` instance to interact with the 3D character.
 *
 * @param {AI3DCharacterProps} props - The properties passed to the component.
 * @param {string} props.url - The base URL for the Sandai 3D character iframe.
 * @param {(client: SandaiClient) => void} props.onLoad - Callback function triggered when the SandaiClient is loaded.
 * @param {string} [props.vrmUrl] - Optional URL for the VRM model to be loaded in the 3D character.
 * @param {VoiceNames} [props.voiceName] - Optional name of the voice to be used by the 3D character.
 * @param {boolean} [props.showControls] - Optional flag to determine if controls should be displayed in the iframe.
 * @returns {JSX.Element} - Returns an iframe element that displays the 3D character.
 */
export const AI3DCharacter = (props: AI3DCharacterProps) => {
  const clientRef = useRef<SandaiClient | undefined>();

  // State for the iframe URL
  const [iframeSrc, setIframeSrc] = useState("");

  // useEffect to build the URL and set the iframe src when parameters change
  useEffect(() => {
    const builtUrl = new UrlBuilder<AI3DCharacterProps>(props.url)
      .setParam("vrmUrl", props.vrmUrl)
      .setParam("voiceName", props.voiceName)
      .setParam("showControls", props.showControls)
      .build();

    setIframeSrc(builtUrl);
  }, [props.vrmUrl, props.voiceName, props.showControls, props.url]);

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new SandaiClient("sandai-frame");
    }

    props.onLoad(clientRef.current);
    return () => {
      clientRef.current = undefined;
    };
  }, [props.url, props.onLoad]);

  return (
    <iframe
      id="sandai-frame"
      src={iframeSrc}
      width="100%"
      height="100%"
      allowFullScreen
    ></iframe>
  );
};
