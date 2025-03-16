
import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber/native";
import { useSharedValue, withTiming } from "react-native-reanimated";

type GLTFResult = GLTF & {
  nodes: {
    mesh_id7: THREE.Mesh
    mesh_id8: THREE.Mesh
  }
  materials: {
    ['33']: THREE.MeshStandardMaterial
    ['34']: THREE.MeshStandardMaterial
  };
};

const ActionName = "COMPOUND.001Action";

const SandakadaPahana = (props: JSX.IntrinsicElements["group"]) => {
  const y = useSharedValue(0);
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    require("../../assets/models/SandakadaPahana.glb")
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions[ActionName]?.play();
    y.value = withTiming(2, { duration: 2000 });
  }, []);

  useFrame(() => {
    group.current?.rotation.set(0, y.value, 0);
  });

  return (
    <group {...props} dispose={null}>
      <group position={[-0.194, -0.024, 0.421]} rotation={[-2.995, 0.86, Math.PI]} scale={0.001}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh_id7.geometry}
          material={materials['33'] ?? new THREE.MeshStandardMaterial()}
          position={[0, -7.879, 376.836]}
          scale={40}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh_id8.geometry}
          material={materials['34'] ?? new THREE.MeshStandardMaterial()}
          position={[0, -7.879, 376.836]}
          scale={40}
        />
      </group>
    </group>
  );
};

export default SandakadaPahana;
