import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect } from "react";
import { Box3, Vector3 } from "three";

export const BedroomEnvironment = () => {
  const gltf = useLoader(
    GLTFLoader,
    "chat-runtime-deps/environments/bedroom/scene.gltf"
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

  return <primitive object={gltf.scene} dispose={null} />;
};
