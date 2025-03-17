import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, ArrowLeftIcon } from "react-native-heroicons/outline";
import usePredictionStore from "../store/useBrahmiStore";  // Import Zustand Store
import SuccessMessage from "../components/SuccessMessage";
import Header from "../components/Header";
import HistoryList from "../components/HistoryList";


const { width } = Dimensions.get("window");

export default function BrahmiScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const { predict, isLoading } = usePredictionStore();
  const [successModalVisible, setSuccessModalVisible] = useState(false);


  
const historyData = [
  { id: "1", title: "Archeological Pot", location: "Anuradhapura", image: require("../assets/pot.png") },
  { id: "2", title: "Ancient Coin", location: "Polonnaruwa", image: require("../assets/pot.png") },
  { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
  { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
  { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
  { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
];

  // Open Camera
  const openCamera = async () => {
    // Request Camera Permissions
    const { status } = await Camera.requestCameraPermissionsAsync();
  
    // Check if permission is granted
    if (status !== "granted") {
      alert("Camera permission is required.");
      return;
    }
  
    // Open Camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Ensure only images are picked
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    // Check if the user canceled picking
    if (!result.canceled && result.assets?.length > 0) {
      setSelectedImage(result.assets[0].uri); // Save selected image
    }
  };
  

  // Open File Picker
  const openFilePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Handle Prediction Request
  const handlePrediction = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    await predict(selectedImage, () => {
      setSuccessModalVisible(true);
      router.push("/predict");
    });
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
         {/* Header */}
//         <Header />
        <View className="px-4 mt-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="bg-black/20 p-3 rounded-full w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeftIcon size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-center">Brahmi OCR</Text>
        </View>

        <View className="items-center justify-center mt-5">
          {/* Image Preview */}
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} className=" w-40 h-40 rounded-full border-2 border-gray-400" />
          ) : (
            <TouchableOpacity
              className=" w-40 h-40 bg-black rounded-full flex items-center justify-center border-2 border-gray-300"
              onPress={openCamera}
            >
              <CameraIcon size={36} color="white" />
            </TouchableOpacity>
          )}

          {/* Add Manually Button */}
          <TouchableOpacity onPress={openFilePicker} className="bg-amber-500 mt-5 px-8 py-4 rounded-lg">
            <Text className="text-white font-bold">Add Manually</Text>
          </TouchableOpacity>

          {/* Predict Button */}
          <TouchableOpacity onPress={handlePrediction} className="bg-green-500 mt-8 px-8 py-4 rounded-3xl">
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold">Predict</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* History List - Always at Bottom */}      
     <View className="absolute bottom-0 w-full">
      <HistoryList data={historyData} />
      </View>

      {/* Success Modal */}
      <SuccessMessage
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Prediction Successful!"
        message="The artifact has been successfully identified."
        buttonText="Done"
      />
    </View>
  );
}
