import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    ScrollView,
    View,
    ActivityIndicator,
    Image,
    Animated,
} from "react-native";
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber/native";
import Trigger from "@/src/components/3dModel/Trigger";
import Loader from "@/src/components/3dModel/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import useControls from "r3f-native-orbitcontrols";
import { StatusBar } from "expo-status-bar";
import Gradient from "@/src/components/3dModel/Gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // Add image picker
import Dynamic3DModel from "@/src/components/3dModel/Dynamic3DModel";
import Constants from "expo-constants";

const DynamicIndex = () => {
    const [loading, setLoading] = useState(false);
    const [OrbitControls, events] = useControls();
    const [modelUrl, setModelUrl] = useState<string | null>(null); // Set modelUrl type to string | null
    const [imageUri, setImageUri] = useState<string | null>(null); // New state for image URI
    const [modelLoaded, setModelLoaded] = useState(false); // New state to track if the model is loaded
    const { width } = useWindowDimensions();
    const [image, setImage] = useState<string | null>(null); // Type for image state
    const router = useRouter();

    const LOCAL_IP = Constants.expoConfig?.hostUri?.split(":")[0]; // Extract the local IP dynamically
    const BASE_URL = `http://${LOCAL_IP}:5000`; // Use it in your API call

    // Function to handle image picking
    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleShowModel = async (fileUri: string | null) => { // Explicitly type fileUri
        setLoading(true);

        if (!fileUri) {
            alert("Please upload a file.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", {
            uri: fileUri,
            name: "image.jpg",
            type: "image/jpeg",
        } as any);

        try {
            const response = await fetch(`${BASE_URL}/upload`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!response.ok) {
                const error = await response.json();
                console.log(error);
                alert(`Error: ${error.error}`);
                return;
            }

            const data = await response.json();
            console.log("Response Data:", data);
            if (data.modelGlb) {
                setModelUrl(`${BASE_URL}/${data.modelGlb}`);
                setModelLoaded(true); // Set modelLoaded to true when model is loaded
            } else {
                alert("Model Error");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Check the console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar animated style="light" />
            <View style={styles.textContainer}>
                <Text style={styles.textTitle}>Load Successfully</Text>
                <Text style={styles.text}>
                    3D modeling is the process of creating 3D objects using specialized software
                </Text>
            </View>

            {/* Conditionally render the buttons if the model is not loaded */}
            {!modelLoaded && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
                        <Text style={styles.uploadButtonText}>
                            {loading ? "Processing..." : "Select Image"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.uploadButtonG} onPress={() => handleShowModel(image)}>
                        <Text style={styles.uploadButtonText}>
                            {loading ? "Processing..." : "Genarate"}
                        </Text>
                    </TouchableOpacity>
                </View>

            )}

            {image && !modelLoaded && (
                <Image source={{ uri: image }} style={styles.selectedImage} resizeMode="contain" />
            )}


            {/* Model loading screen */}
            <View style={styles.modelContainer} {...events}>
                <Gradient />
                {loading && <Loader />}
                <Canvas>
                    <OrbitControls enablePan={false} enableZoom={true} />
                    <directionalLight position={[1, 0, 0]} args={["white", 2]} />
                    <directionalLight position={[-1, 0, 0]} args={["white", 2]} />
                    <directionalLight position={[0, 0, 1]} args={["white", 2]} />
                    <directionalLight position={[0, 0, -1]} args={["white", 2]} />
                    <directionalLight position={[0, 1, 0]} args={["white", 15]} />
                    <directionalLight position={[0, -1, 0]} args={["white", 2]} />

                    <Suspense fallback={<Trigger setLoading={setLoading} />}>
                        {modelUrl && <Dynamic3DModel modelUrl={modelUrl} />}
                    </Suspense>
                </Canvas>
            </View>

            {/* Button to navigate back */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    router.back();
                }}
            >
                <Text className="text-black-200 font-bold text-lg">Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DynamicIndex;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    modelContainer: {
        flex: 1,
    },
    textContainer: {
        marginHorizontal: 24,
        gap: 4,
        marginVertical: 20,
    },
    uploadButtonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
    uploadButton: {
        backgroundColor: "#F59E0B",
        padding: 15,
        borderRadius: 10,
        margin: 20,
        alignItems: "center",
    }, uploadButtonG: {
        backgroundColor: "#ff6130",
        padding: 15,
        borderRadius: 10,
        margin: 20,
        alignItems: "center",
    },
    selectedImage: {
        width: "100%",
        height: 300,
        marginVertical: 20,
    },
    textTitle: {
        fontFamily: "Inter-Bold",
        color: "white",
        fontSize: 18,
        textAlign: "center",
    },
    text: {
        fontFamily: "Inter-Light",
        color: "white",
        fontSize: 14,
        textAlign: "center",
    },
    button: {
        backgroundColor: "white",
        padding: 14,
        margin: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    loadButton: {
        backgroundColor: "#444",
        padding: 12,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    textButton: {
        fontFamily: "Inter-Bold",
        color: "white",
        fontSize: 14,
    }, buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between", // or "center" if you want them centered
        marginHorizontal: 20,
    },
});
