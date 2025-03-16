
import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber/native";
import { useSharedValue, withTiming } from "react-native-reanimated";

type GLTFResult = GLTF & {
  nodes: {
    meshobj: THREE.Mesh
  }
  materials: {
    ['33']: THREE.MeshStandardMaterial
    ['34']: THREE.MeshStandardMaterial
  };
};

const ActionName = "COMPOUND.001Action";

const Clay_Kadai_Pots = (props: JSX.IntrinsicElements["group"]) => {
  const y = useSharedValue(0);
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    require("../../assets/models/Clay_Kadai_Pots.glb")
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);


  useEffect(() => {
    if (actions[ActionName]) {
      actions[ActionName]?.play();
    }
    y.value = withTiming(2, { duration: 2000 });
  }, []);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = y.value;
    }
  });
  console.log("Clay_Kadai_Pots 3D")

  return (
    <group ref={group} {...props} dispose={null}>
      {nodes.meshobj && nodes.meshobj.geometry && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.meshobj.geometry}
          material={nodes.meshobj.material ?? new THREE.MeshStandardMaterial()}
        />
      )}
    </group>
  );
};

export default Clay_Kadai_Pots;
