import { useEffect, useRef, useState } from "react";
import { SandaiClient, UrlBuilder } from "sandai-core/index";

export type AI3DCharacterProps = {
  url: string;
  onLoad: (client: SandaiClient) => void;
  vrmUrl?: string;
  voiceName?: string;
  showControls?: boolean;
};

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
