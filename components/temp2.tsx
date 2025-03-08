import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import * as ImagePicker from "expo-image-picker";

interface PredictionResponse {
  Types: string;
  [key: string]: any;
}

const Home: React.FC = () => {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null); // For storing selected image URI
  const router = useRouter();

  // Map `Types` to target screens
  const navigationMap: Record<string, string> = {
    Clay_Kadai_Pots: "/3dModels/3dModel",
    Clay_Tea_Plates: "/3dModels/3dModel2",
    Clay_Medium_Pots: "/3dModels/3dModel3",
    Clay_Storage_Pots: "/3dModels/3dModel4",
    // Add additional mappings here
  };



  const handlePrediction = async (fileUri: string) => {
    setLoading(true);
    try {
      // Create the FormData
      const formData = new FormData();

      // Fetch the file as a Blob
      const response = await fetch(fileUri);
      const fileBlob = await response.blob();  // Convert to Blob

      // Log the fileBlob to ensure it is a valid image
      console.log("File Blob:", fileBlob);

      // Append the file to FormData
      formData.append("file", fileBlob, "artifact.jpg"); // "artifact.jpg" is the filename

      const SERVER_URL = "http://192.168.103.153:5000"; // Update if needed

      const uploadResponse = await fetch(`${SERVER_URL}/predict`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data", // Ensure multipart form data header
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image.");
      }

      const result: { prediction: PredictionResponse[] } = await uploadResponse.json();

      if (result.prediction && result.prediction.length > 0) {
        const type = result.prediction[0]?.Types; // Extract `Types` from API response

        // Navigate based on the type returned
        if (type === "Clay_Kadai_Pots") {
          router.push("/3dModels/3dModel");
        } else if (type === "Clay_Tea_Plates") {
          router.push("/3dModels/3dModel2");
        } else if (type === "Clay_Medium_Pots") {
          router.push("/3dModels/3dModel3");
        } else if (type === "Clay_Storage_Pots") {
          router.push("/3dModels/3dModel4");
        } else {
          alert("No matching screen for the detected type.");
        }
      } else {
        alert("No prediction result received.");
      }
    } catch (error) {
      console.error(error); // Log the error
      alert("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleImagePicker = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri); // Set the image URI to state
    } else {
      alert("Image selection was canceled.");
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
    fontFamily: "Inter-Bold",
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
});
