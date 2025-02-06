import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";

type ClayStoragePotGLTF = GLTF & {
  nodes: {
    Object_3: THREE.Mesh;
    Object_4: THREE.Mesh;
    Object_5: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_7: THREE.Mesh;
    Object_8: THREE.Mesh;
  };
  materials: {
    model: THREE.MeshStandardMaterial;
  };
};

const ClayStoragePot_2 = (props: JSX.IntrinsicElements["group"]) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(
    require("../../assets/models/Clay_Storage_Pots_2.glb")
  ) as ClayStoragePotGLTF;

  useEffect(() => {
    if (!group.current) return;

    // Compute the bounding box to center the object
    const boundingBox = new THREE.Box3().setFromObject(group.current);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // Adjust the group's position to center the object
    group.current.position.set(-center.x, -center.y, -center.z);


    // Adjust the material properties for better appearance
    if (materials.model) {
      materials.model.metalness = 0.5; // Adjust metalness
      materials.model.roughness = 0.7; // Adjust roughness
      materials.model.emissive = new THREE.Color(0x000000); // Ensure emissive doesn't cause issues
    }
  }, [materials]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={5} position={[0, 4.943, -12.184]} rotation={[-0.583, 0, 0]}>
        <group position={[-2.376, -1.465, 10.88]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_3.geometry}
            material={materials.model}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_4.geometry}
            material={materials.model}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_5.geometry}
            material={materials.model}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_6.geometry}
            material={materials.model}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_7.geometry}
            material={materials.model}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_8.geometry}
            material={materials.model}
          />
        </group>
      </group>
    </group>
  );
};

export default ClayStoragePot_2;
