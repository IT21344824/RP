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
  const [types, setTypes] = useState("");
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
      const response = await fetch("http://192.168.207.98:5000/predict", {
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
          culturalSignificance: firstPrediction.Cultural_Significance || "Unknown",
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar animated style="light" />
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={[styles.cardContainer, { width: width * 0.95 }]}
          >
            <View>
              <Text style={styles.cardText}>3D Models</Text>
            </View>
          </MotiView>

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
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>Object Type: {types}</Text>
              <Text style={styles.detailsText}>Year/Period: {objectDetails.yearPeriod}</Text>
              <Text style={styles.detailsText}>Use: {objectDetails.use}</Text>
              <Text style={styles.detailsText}>
                Cultural Significance: {objectDetails.culturalSignificance}
              </Text>
            </View>
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
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#F59E0B", // Amber 500
    aspectRatio: 16 / 9,
    marginTop: 10,
    borderRadius: 25,
  },
  cardText: {
    color: "black",
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#F59E0B", // Amber 500
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
    backgroundColor: "#222", // Dark Gray to contrast with black background
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  detailsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F59E0B", // Amber 500 text
    marginBottom: 5,
  },
});
