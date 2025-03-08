import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    ScrollView,
    View,
    ActivityIndicator,
    Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import * as ImagePicker from "expo-image-picker";

const Home = () => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const router = useRouter();
    const [types, setTypes] = useState([]);

    const handlePrediction = async (fileUri) => {
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
        });

        try {
            const response = await fetch("http://192.168.8.168:5000/predict", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Error: ${error.error}`);
                return;
            }

            const data = await response.json();
            const types = data.prediction.map(item => item.Types);
            setTypes(types); // Store the types in state
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Check the console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access media library is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        } else {
            alert("Image selection was canceled.");
        }
    };

    // Function to navigate based on the types
    // const handleNavigate3D = () => {
    //   if (types.length > 0) {
    //     const type = types[0]; // Assuming only one type is returned
    //     if (type === "Clay_Kadai_Pots") {
    //       router.push("/3dModels/3dModel");
    //     } else if (type === "Clay_Medium_Pots") {
    //       router.push("/3dModels/3dModel2");
    //     } else if (type === "Clay_Mini_Pots") {
    //       router.push("/3dModels/3dModel");
    //     } else if (type === "Clay_Plates") {
    //       router.push("/3dModels/3dModel2");
    //     } else if (type === "Clay_Kadai_Pots") {
    //       router.push("/3dModels/3dModel");
    //     } else if (type === "Clay_Tea_Plates") {
    //       router.push("/3dModels/3dModel2");
    //     } else if (type === "Clay_Medium_Pots") {
    //       router.push("/3dModels/3dModel3");
    //     } else if (type === "Clay_Storage_Pots") {
    //       router.push("/3dModels/3dModel4");
    //     } else {
    //       alert("No matching screen for the detected type.");
    //     }
    //   }
    // };

    const handleNavigate3D = () => {
        if (types.length > 0) {
            const type = types[0]; // Assuming only one type is returned
            switch (type) {
                case "Clay_Kadai_Pots":
                    router.push("/3dModels/3dmodel_CKP");
                    break;
                // case "Clay_Medium_Pots":
                //     router.push("/3dModels/3dmodel_CMP");
                //     break;
                case "Clay_Mini_Pots":
                    router.push("/3dModels/3dmodel_CMP");
                    break;
                case "Clay_Plates":
                    router.push("/3dModels/3dmodel_Cp");
                    break;
                case "Clay_Rice_Pots":
                    router.push("/3dModels/3dmodel_CRP");
                    break;
                // case "Clay_Storage_Pots":
                //     router.push("/3dModels/3dModel4");
                //     break;
                // case "Clay_Tawa_Plates":
                //     router.push("/3dModels/3dModel6");
                //     break;
                // case "Clay_Tea_Plates":
                //     router.push("/3dModels/3dModel2");
                //     break;
                // case "Clay_Water_Cups":
                //     router.push("/3dModels/3dModel7");
                //     break;
                // case "Clay_Water_Pots":
                //     router.push("/3dModels/3dModel8");
                //     break;
                case "Metal_Cups":
                    router.push("/3dModels/3dmodel_MC");
                    break;
                // case "Metal_Pots":
                //     router.push("/3dModels/3dModel10");
                //     break;
                // case "Metal_Swords":
                //     router.push("/3dModels/3dModel11");
                //     break;
                case "Stone_Moonstone":
                    router.push("/3dModels/3dModel");
                    break;
                // case "Stone_Pillars":
                //     router.push("/3dModels/3dModel13");
                //     break;
                // case "Stone_Sandalwood_Grinder":
                //     router.push("/3dModels/3dModel");
                //     break;
                case "Stone_Vessel_Metal_Base":
                    router.push("/3dModels/3dmodel_SVMB");
                    break;
                // case "Wood_Carved_Coconut_Shell":
                //     router.push("/3dModels/3dModel16");
                //     break;
                // case "Wood_Coconut_Shell":
                //     router.push("/3dModels/3dModel17");
                //     break;
                case "Wood_Cup":
                    router.push("/3dModels/3dmodel_WC");
                    break;
                case "Wood_Sandalwood_Cup":
                    router.push("/3dModels/3dmodel_WSC");
                    break;
                // case "Wood_Sandalwood_Jar":
                //     router.push("/3dModels/3dModel20");
                //     break;
                default:
                    alert("No matching screen for the detected type.");
            }
        } else {
            alert("No types detected.");
        }
    };


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StatusBar animated style="dark" />
                    <MotiView
                        from={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={[styles.cardContainer, { width: width * 0.95 }]}
                    >
                        <View>
                            <Text style={styles.cardText}>3D Models</Text>
                        </View>
                    </MotiView>

                    {/* Button to trigger image picker */}
                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleImagePicker}
                    >
                        <Text style={styles.uploadButtonText}>
                            {loading ? "Processing..." : "Select Image"}
                        </Text>
                    </TouchableOpacity>

                    {/* Display selected image */}
                    {imageUri && (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.selectedImage}
                            resizeMode="contain"
                        />
                    )}

                    {/* Upload and Predict button */}
                    {imageUri && (
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => handlePrediction(imageUri)}
                        >
                            <Text style={styles.uploadButtonText}>
                                {loading ? "Processing..." : "Upload and Predict"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* 3D Button to navigate based on type */}
                    {types.length > 0 && (
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={handleNavigate3D}
                        >
                            <Text style={styles.uploadButtonText}>Go to 3D Model</Text>
                        </TouchableOpacity>
                    )}

                    {loading && <ActivityIndicator size="large" color="#0000ff" />}
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F6F6F6" },
    cardContainer: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#1C6BC8",
        aspectRatio: 16 / 9,
        marginTop: 10,
        borderRadius: 25,
    },
    cardText: {
        color: "white",
        fontSize: 28,
        textAlign: "center",
        fontWeight: "bold",
    },
    uploadButton: {
        backgroundColor: "#1C6BC8",
        padding: 15,
        borderRadius: 10,
        margin: 20,
        alignItems: "center",
    },
    uploadButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    selectedImage: {
        width: "100%",
        height: 300,
        marginVertical: 20,
    },
});
