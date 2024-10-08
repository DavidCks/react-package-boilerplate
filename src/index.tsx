import React, { useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Grid, Html, OrbitControls } from "@react-three/drei";
import { AICharacter, AICharacterManager } from "ai-character/index";
import { BedroomEnvironment } from "./environments/bedroom";
import { SkyEnvironment } from "./environments/sky";
import { ChatControls } from "./ChatControls";

export const AICharacterCanvas = () => {
  const [manager, setManager] = useState<AICharacterManager | null>(null);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Canvas
        camera={{ near: 0.01, far: 1000, position: [0, 1, 5] }} // Set the camera position
        style={{ height: "800px", width: "100%" }} // Set the height to 800px and width to 100%
      >
        <SkyEnvironment />
        {/* <ambientLight intensity={0.5} /> */}
        {/* <directionalLight position={[0, 10, 5]} intensity={1} /> */}
        <Grid
          args={[10, 10]} // Size of the grid
          rotation={[0, 0, 0]} // Rotate to lie on the XZ plane
          position={[0, 0, 0]} // Position the grid at the origin
        />
        <Character onLoad={(manager) => setManager(manager)} />
        <OrbitControls />
      </Canvas>
      {manager && <ChatControls manager={manager} />}
    </div>
  );
};

const Character = ({
  onLoad,
}: {
  onLoad: (manager: AICharacterManager) => void;
}) => {
  const { scene, camera } = useThree();
  const managerRef = React.useRef<AICharacterManager | null>(null);

  // Initialize state with types
  const [vrmUrl, setVrmUrl] = useState<string | undefined>(undefined);
  const [voiceName, setVoiceName] = useState<string | undefined>(undefined);
  const [showControls, setShowControls] = useState<boolean>(false);

  React.useEffect(() => {
    // Extract URL parameters
    const searchParams = new URLSearchParams(window.location.search);

    const vrmUrlParam = searchParams.get("vrmUrl") || "none";
    const voiceNameParam = searchParams.get("voiceName") || "none";
    const showControlsParam = searchParams.get("showControls") === "true";

    // Only update state if values are different from current state to avoid unnecessary re-renders
    setVrmUrl((prevUrl) => (prevUrl !== vrmUrlParam ? vrmUrlParam : prevUrl));
    setVoiceName((prevName) =>
      prevName !== voiceNameParam ? voiceNameParam : prevName
    );
    setShowControls((prevShow) =>
      prevShow !== showControlsParam ? showControlsParam : prevShow
    );
  }, []);

  useFrame((_, delta) => {
    if (managerRef.current) {
      managerRef.current.update(delta);
    }
  });

  return (
    <>
      {vrmUrl && voiceName && (
        <AICharacter
          scene={scene}
          camera={camera}
          vrmUrl={vrmUrl !== "none" ? vrmUrl : undefined} // Pass vrmUrl as prop
          voiceName={voiceName !== "none" ? (voiceName as any) : undefined} // Pass voiceName as prop
          showControls={showControls} // Pass showControls as prop
          onLoad={(manager) => {
            managerRef.current = manager;
            onLoad(manager);
          }}
        />
      )}
    </>
  );
};
