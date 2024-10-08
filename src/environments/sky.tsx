import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect } from "react";
import { Box3, Vector3 } from "three";

export const SkyEnvironment = () => {
  const gltf = useLoader(
    GLTFLoader,
    "chat-runtime-deps/environments/sky/LightBlueSky.glb"
  );

  useEffect(() => {
    if (gltf) {
      // Compute bounding box to get the dimensions of the model
      const box = new Box3().setFromObject(gltf.scene);
      const size = new Vector3();
      box.getSize(size);

      // Center the model on the scene
      const center = new Vector3();
      box.getCenter(center);
      gltf.scene.position.sub(center); // Center the scene at (0, 0, 0)

      // Scale down to fit within the range -10 to 10 on the Z-axis
      const desiredDepth = 20; // From -10 to 10
      const scaleFactorZ = desiredDepth / size.z; // Scale based on Z axis depth
      gltf.scene.scale.set(scaleFactorZ, scaleFactorZ, scaleFactorZ);

      // Optionally, manually adjust position to fit within the desired space
      gltf.scene.position.set(0, 0, 0); // Adjust if needed
    }
  }, [gltf]);

  return (
    <>
      {/* Directional sunlight */}
      <directionalLight
        position={[10, 10, -10]} // Far away position to simulate distant sunlight
        intensity={1} // Adjusted intensity for natural light
        color={"#ffddbb"} // Warm sunlight color
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Add a point light to simulate extra sunlight directly shining at the center */}
      <pointLight
        position={[2, 2, -2]} // Same position as the directional light
        intensity={1} // Add some localized brightness
        distance={3} // Light distance range before it fades out
        decay={6} // Simulates a more realistic light falloff
      />

      {/* Optional: Ambient light to softly fill shadows */}
      <ambientLight intensity={0.2} color={"#ffffff"} />

      {/* Render the GLTF scene */}
      <primitive object={gltf.scene} dispose={null} />
    </>
  );
};
