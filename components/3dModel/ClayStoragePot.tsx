import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber/native";
import { useSharedValue } from "react-native-reanimated";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
    Object_3: THREE.Mesh;
    Object_4: THREE.Mesh;
    Object_5: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_7: THREE.Mesh;
    Object_8: THREE.Mesh;
    Object_9: THREE.Mesh;
    Object_10: THREE.Mesh;
    Object_11: THREE.Mesh;
  };
  materials: {
    material_0: THREE.MeshStandardMaterial;
  };
};

const ClayStoragePot = (props: JSX.IntrinsicElements["group"]) => {
  const y = useSharedValue(0);
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(
    require("../../assets/models/Clay_Storage_Pots.glb")
  ) as GLTFResult;

  // Update group rotation in each frame
  useFrame(() => {
    group.current?.rotation.set(0, y.value, 0);
  });

  useEffect(() => {
    if (!group.current) return;

    // Compute bounding box and adjust the position
    const boundingBox = new THREE.Box3().setFromObject(group.current);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // Adjust position to center the object
    group.current.position.set(-center.x, -center.y, -center.z);

    // Optional: Log material to check if it's being applied correctly
    console.log(materials.material_0);

    // Ensure the material has the correct settings
    materials.material_0.metalness = 0.5; // Example: Adjust material's properties
    materials.material_0.roughness = 0.7; // Adjust roughness for better appearance under lights
    materials.material_0.emissive = new THREE.Color(0x000000); // Prevent emissive from causing issues
  }, [materials]);

  return (
    <group {...props} ref={group} dispose={null}>
      <group scale={2}>
        {(Object.keys(nodes) as Array<keyof typeof nodes>).map((key, index) => (
          <mesh
            key={index}
            castShadow
            receiveShadow
            geometry={nodes[key].geometry}
            material={materials.material_0}
          />
        ))}
      </group>
    </group>
  );
};

export default ClayStoragePot;
