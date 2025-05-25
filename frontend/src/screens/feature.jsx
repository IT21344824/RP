
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
import { CameraIcon, ArrowLeftIcon } from "react-native-heroicons/outline";
import { MotiView } from "moti";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons"; // Camera icon
import axios from "axios";

const Feature = () => {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [blinkAnim] = useState(new Animated.Value(1)); // Blinking effect

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        alert("Permissions are required to access the camera and gallery.");
      }
    };

    requestPermissions();

    const blink = () => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start(() => blink());
    };

    blink();
    return () => {
      blinkAnim.stopAnimation();
    };
  }, []);

  const handlePrediction = async (fileUri) => {
    if (!fileUri) {
      alert("Please upload a file.");
      return;
    }
  
    setLoading(true);
  
    let filename = fileUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : "image/jpeg";
  
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: filename,
      type: type,
    });
  
    console.log("FormData Debug:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);  // Should log file data
    }
  
    try {
      const response = await axios.post("http://192.168.230.41:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
  
      console.log("Response Data:", response.data);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Axios Error:", error);
  
      if (error.response) {
        console.error("Server responded with:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response received from server");
      } else {
        console.error("Axios Error:", error.message);
      }
  
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar animated style="light" />

          <MotiView from={{ opacity: 0, translateY: 50 }} animate={{ opacity: 1, translateY: 0 }} style={[styles.cardContainer, { width: width * 0.95 }]}>            
            <Animated.Text style={[styles.cardText]}>ARCHITECTURAL FEATURE DETECTION</Animated.Text>
          </MotiView>

          <TouchableOpacity onPress={handleCamera} style={styles.cameraIconContainer}>
            <CameraIcon size={36} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
            <Text style={styles.uploadButtonText}>{loading ? "Processing..." : "Select Image"}</Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.selectedImage} resizeMode="contain" />}

          {image && (
            <TouchableOpacity style={styles.uploadButton} onPress={() => handlePrediction(image)}>
              <Text style={styles.uploadButtonText}>{loading ? "Processing..." : "Get Feature"}</Text>
            </TouchableOpacity>
          )}

          {prediction && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}><Text style={styles.label}>Feature Type:</Text> {prediction.class_name}</Text>
              <Text style={styles.detailsText}><Text style={styles.label}>Time Period:</Text> {prediction.time_period}</Text>
              <Text style={styles.detailsText}><Text style={styles.label}>Origin:</Text> {prediction.origin}</Text>
              <Text style={styles.detailsText}><Text style={styles.label}>Cultural Significance:</Text> {prediction.cultural_significance}</Text>
              {/* <Text style={styles.detailsText}><Text style={styles.label}>Confidence:</Text> {Math.round(prediction.confidence * 100)}%</Text> */}
            </View>
          )}

          {loading && <ActivityIndicator size="large" color="#F59E0B" />}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Feature;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#F59E0B",
    padding: 30,
    minHeight: 120,
    width: "90%",
    marginTop: 20,
    borderRadius: 25,
  },
  cardText: { color: "black", fontSize: 28, textAlign: "center", fontWeight: "bold" },
  uploadButton: { backgroundColor: "#F59E0B", padding: 15, borderRadius: 10, margin: 20, alignItems: "center" },
  uploadButtonText: { color: "black", fontSize: 18, fontWeight: "bold" },
  selectedImage: { width: "100%", height: 300, marginVertical: 20 },
  detailsContainer: { backgroundColor: "#222", padding: 15, borderRadius: 10, margin: 20 },
  detailsText: { fontSize: 16, fontWeight: "bold", color: "#F59E0B", marginBottom: 5 },
  label: { color: "white", fontWeight: "bold" },
  cameraIconContainer: { alignItems: "center", marginTop: 10 },
});
