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
import * as ImagePicker from 'expo-image-picker';

const Home3D = () => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const router = useRouter();
    const [types, setTypes] = useState([]);
    const [objectDetails, setObjectDetails] = useState({
        yearPeriod: "",
        use: "",
        culturalSignificance: "",
    });

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
            const response = await fetch("http://192.168.58.153:5000/predict", {
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

            // const types = data.prediction.map(item => item.Types);
            // setTypes(types); // Store the types in state

            if (data.prediction.length > 0) {
                const firstPrediction = data.prediction[0];
                setTypes(firstPrediction.Types);
                setObjectDetails({
                    yearPeriod: firstPrediction['Year/Period'] || "Unknown", // Corrected the field name here
                    use: firstPrediction.Use || "Unknown",
                    culturalSignificance: firstPrediction['Cultural Significance'] || "Unknown", // Corrected the field name here    
                });

                console.log("data :", data);
                console.log("types 1:", types);
                console.log("types 2:", types[0]);
            } else {
                alert("No object detected.");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Check the console for details.");
        } finally {
            setLoading(false);
        }
    };


    const handleImagePicker = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };


    const handleNavigate3D = () => {
        if (types.length > 0) {
            // const type = types[0]; // Assuming only one type is returned
            switch (types) {
                case "Clay_Kadai_Pots":
                    router.push("/3dModels/3dmodel_CKP");
                    break;
                case "Clay_Medium_Pots":
                    router.push("/3dModels/3dmodel_CKP");
                    break;
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
                    {image && (
                        <Image
                            source={{ uri: image }}
                            style={styles.selectedImage}
                            resizeMode="contain"
                        />
                    )}

                    {/* Upload and Predict button */}
                    {image && (
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => handlePrediction(image)}
                        >
                            <Text style={styles.uploadButtonText}>
                                {loading ? "Processing..." : "Upload and Predict"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Identified object details */}
                    {types && (
                        <View style={styles.detailsContainer}>
                            <Text style={styles.detailsText}>Object Type: {types}</Text>
                            <Text style={styles.detailsText}>Year/Period: {objectDetails.yearPeriod}</Text>
                            <Text style={styles.detailsText}>Use: {objectDetails.use}</Text>
                            <Text style={styles.detailsText}>
                                Cultural Significance: {objectDetails.culturalSignificance}
                            </Text>
                        </View>
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

export default Home3D;

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
    detailsContainer: {
        backgroundColor: "#E0E0E0",
        padding: 15,
        borderRadius: 10,
        margin: 20,
    },
    detailsText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
});
