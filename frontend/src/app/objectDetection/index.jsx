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
import Constants from "expo-constants";

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


  const LOCAL_IP = Constants.expoConfig?.hostUri?.split(":")[0]; // Extract the local IP dynamically
  const BASE_URL = `http://${LOCAL_IP}:5000/predict`; // Use it in your API call

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
      const response = await fetch(BASE_URL, {
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

      if (data.prediction.length > 0) {
        const firstPrediction = data.prediction[0];
        setTypes(firstPrediction.Types);
        setObjectDetails({
          yearPeriod: firstPrediction.Year_Period || "Unknown",
          use: firstPrediction.Use || "Unknown",
          culturalSignificance: firstPrediction["Cultural_Significance"] || "Unknown",
        });
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

  const handleCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

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

        case "Clay_Storage_Pots":
          console.log("Clay_Storage_Pots")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel4");
          break;
        case "Clay_Tawa_Plates":
          console.log("Clay_Tawa_Plates")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel6");
          break;
        case "Clay_Tea_Plates":
          console.log("Clay_Tea_Plates")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel2");
          break;
        case "Clay_Water_Cups":
          console.log("Clay_Water_Cups")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel7");
          break;
        case "Clay_Water_Pots":
          console.log("Clay_Water_Pots")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel8");
          break;

        case "Metal_Cups":
          router.push("/3dModels/3dmodel_MC");
          break;

        case "Metal_Pots":
          console.log("Metal_Pots")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel10");
          break;
        case "Metal_Swords":
          console.log("Metal_Swords")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel11");
          break;

        case "Stone_Moonstone":
          router.push("/3dModels/3dModel");
          break;

        case "Stone_Pillars":
          console.log("Stone_Pillars")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel13");
          break;
        case "Stone_Sandalwood_Grinder":
          console.log("Stone_Sandalwood_Grinder")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel");
          break;

        case "Stone_Vessel_Metal_Base":
          router.push("/3dModels/3dmodel_SVMB");
          break;

        case "Wood_Carved_Coconut_Shell":
          console.log("Wood_Carved_Coconut_Shell")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel16");
          break;
        case "Wood_Coconut_Shell":
          console.log("Wood_Coconut_Shell")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel17");
          break;

        case "Wood_Cup":
          router.push("/3dModels/3dmodel_WC");
          break;
        case "Wood_Sandalwood_Cup":
          router.push("/3dModels/3dmodel_WSC");
          break;
        case "Wood_Sandalwood_Jar":
          console.log("Wood_Sandalwood_Jar")
          alert(`can not identtify the object or can not create a 3d model`);
          // router.push("/3dModels/3dModel20");
          break;
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

          {/* Camera Icon */}
          <TouchableOpacity onPress={handleCamera} style={styles.cameraIconContainer}>
            <MaterialIcons name="camera-alt" size={40} color="#F59E0B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
            <Text style={styles.uploadButtonText}>
              {loading ? "Processing..." : "Select Image"}
            </Text>
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image }} style={styles.selectedImage} resizeMode="contain" />
          )}

          {image && (
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
