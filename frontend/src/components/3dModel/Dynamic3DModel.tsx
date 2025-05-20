import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber/native";
import { useSharedValue, withTiming } from "react-native-reanimated";

type GLTFResult = GLTF & {
    nodes: {
        meshobj: THREE.Mesh;
    };
    materials: {
        ['33']: THREE.MeshStandardMaterial;
        ['34']: THREE.MeshStandardMaterial;
    };
};

const ActionName = "COMPOUND.001Action";

const Dynamic3DModel = ({ modelUrl }: { modelUrl: string }) => {
    const y = useSharedValue(0);
    const group = useRef<THREE.Group>(null);
    const { nodes, animations } = useGLTF(modelUrl) as GLTFResult;
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        actions[ActionName]?.play();
        y.value = withTiming(2, { duration: 2000 });
    }, []);

    useFrame(() => {
        group.current?.rotation.set(0, y.value, 0);
    });

    return (
        <group ref={group} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.meshobj.geometry}
                material={nodes.meshobj.material}
            />
        </group>
    );
};

export default Dynamic3DModel;
