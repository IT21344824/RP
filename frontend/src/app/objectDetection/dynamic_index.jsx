// app/3dModels/index.jsx
import React, { useState, useEffect } from "react";
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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons"; // For camera icon

const Home3D = () => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const router = useRouter();
    const [types, setTypes] = useState("");
    const [objectDetails, setObjectDetails] = useState({
        yearPeriod: "",
        use: "",
        culturalSignificance: "",
    });

    const [blinkAnim] = useState(new Animated.Value(1)); // Initial opacity 1

    useEffect(() => {
        const blink = () => {
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => blink());
        };

        blink();

        return () => {
            blinkAnim.stopAnimation();
        };
    }, [blinkAnim]);

    // const handlePrediction = async (fileUri) => {
    //   setLoading(true);

    //   if (!fileUri) {
    //     alert("Please upload a file.");
    //     setLoading(false);
    //     return;
    //   }

    //   const formData = new FormData();
    //   formData.append("file", {
    //     uri: fileUri,
    //     name: "image.jpg",
    //     type: "image/jpeg",
    //   });

    //   try {
    //     const response = await fetch("http://172.28.16.76:5000/predict", {
    //       method: "POST",
    //       body: formData,
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     });

    //     if (!response.ok) {
    //       const error = await response.json();
    //       console.log(error);
    //       alert(`Error: ${error.error}`);
    //       return;
    //     }

    //     const data = await response.json();
    //     console.log("Response Data:", data);

    //     if (data.prediction.length > 0) {
    //       const firstPrediction = data.prediction[0];
    //       setTypes(firstPrediction.Types);
    //       setObjectDetails({
    //         yearPeriod: firstPrediction.Year_Period || "Unknown",
    //         use: firstPrediction.Use || "Unknown",
    //         culturalSignificance: firstPrediction["Cultural_Significance"] || "Unknown",
    //       });
    //     } else {
    //       alert("No object detected.");
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //     alert("Something went wrong. Check the console for details.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };



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



    const handleNavigate3D = async (fileUri) => {
        console.log('handleNavigate3D Received modelData:');


        // Navigate to DynamicIndex and pass the image URI as state
        router.push({
            pathname: "/3dModels/Dynamic3DModel",

        });
    };


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StatusBar animated style="light" />

                    {/* Enlarged Object Detect Part Card */}
                    <MotiView
                        from={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={[styles.cardContainer, { width: width * 0.95 }]}
                    >
                        <Animated.Text style={[styles.cardText, { opacity: blinkAnim }]}>
                            OBJECT DETECT PART
                        </Animated.Text>
                    </MotiView>

                    <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
                        <Text style={styles.uploadButtonText}>
                            {loading ? "Processing..." : "Select Image"}
                        </Text>
                    </TouchableOpacity>

                    {image && (
                        <Image source={{ uri: image }} style={styles.selectedImage} resizeMode="contain" />
                    )}

                    {/* {image && (
            <TouchableOpacity style={styles.uploadButton} onPress={() => handlePrediction(image)}>
              <Text style={styles.uploadButtonText}>
                {loading ? "Processing..." : "Details"}
              </Text>
            </TouchableOpacity>
          )}

          {types && (
            <View style={styles.detailsContainer} className="gap-4">
              <Text style={styles.detailsText} ><Text className="text-rose-600">Object Type:</Text> {types}</Text>
              <Text style={styles.detailsText}> <Text className="text-rose-600">Year/Period:</Text> {objectDetails.yearPeriod}</Text>
              <Text style={styles.detailsText}> <Text className="text-rose-600">Use:</Text> {objectDetails.use}</Text>
              <Text style={styles.detailsText}>
                <Text className="text-rose-600 "> Cultural Significance:</Text> {objectDetails.culturalSignificance}
              </Text>
            </View>
          )} */}

                    {/* 3D Button to navigate based on type */}

                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() => handleNavigate3D(image)}
                    >
                        <Text style={styles.uploadButtonText}>Go to 3D Model</Text>
                    </TouchableOpacity>

                    {loading && <ActivityIndicator size="large" color="#F59E0B" />}
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default Home3D;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000", // Black Background
    },
    cardContainer: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#F59E0B", // Amber 500
        paddingVertical: 30, // Increased padding for bigger card
        paddingHorizontal: 40, // More horizontal padding
        minHeight: 120, // Ensuring larger height
        width: "90%", // Make it wider
        marginTop: 20, // Adjust margin for better spacing
        borderRadius: 25,
    },
    cardText: {
        color: "black",
        fontSize: 28,
        textAlign: "center",
        fontWeight: "bold",
    },
    uploadButton: {
        backgroundColor: "#F59E0B",
        padding: 15,
        borderRadius: 10,
        margin: 20,
        alignItems: "center",
    },
    uploadButtonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
    selectedImage: {
        width: "100%",
        height: 300,
        marginVertical: 20,
    },
    detailsContainer: {
        backgroundColor: "#222",
        padding: 15,
        borderRadius: 10,
        margin: 20,
    },
    detailsText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#F59E0B",
        marginBottom: 5,
    },
    cameraIconContainer: {
        alignItems: "center",
        marginTop: 10,
    },
});
