// import React, { useState } from "react";
// import { 
//   View, Text, TouchableOpacity, ScrollView, Image, Dimensions 
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Header from "../components/Header";
// import HistoryList from "../components/HistoryList";
// import * as ImagePicker from "expo-image-picker";
// import { Camera } from "expo-camera";
// import { CameraIcon } from "react-native-heroicons/outline";

// const { width, height } = Dimensions.get("window"); 

// const historyData = [
//   { id: "1", title: "Archeological Pot", location: "Anuradhapura", image: require("../assets/pot.png") },
//   { id: "2", title: "Ancient Coin", location: "Polonnaruwa", image: require("../assets/pot.png") },
//   { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
//   { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
//   { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
//   { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
// ];

// export default function BrahmiScreen() {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);

//   // Open Camera
//   const openCamera = async () => {
//     const { status } = await Camera.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       alert("Camera permission is required.");
//       return;
//     }
//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   // Open File Picker
//   const openFilePicker = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100">
//       <View className="absolute -top-36 left-0 right-0 h-[400px] bg-white rounded-b-3xl" />

//       {/* Circles for UI Background */}
//       <View className="absolute w-[300px] h-[300px] bg-white opacity-20 rounded-full top-10 left-[-80px]" />
//       <View className="absolute w-[250px] h-[250px] bg-white opacity-20 rounded-full top-40 right-[-50px]" />

//       <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <Header username="YourUsername" profileImage={require("../assets/facebook.png")} />

//         {/* Scanner Section */}
//         <View className="items-center justify-center mt-16">
//           {/* If Image Selected, Show Image Instead of Scanner Icon */}
//           {selectedImage ? (
//             <Image source={{ uri: selectedImage }} className="w-28 h-28 rounded-full border-2 border-gray-400" />
//           ) : (
//             <TouchableOpacity
//               className="w-28 h-28 bg-black rounded-full flex items-center justify-center border-2 border-gray-300"
//               onPress={openCamera}
//             >
//               <CameraIcon size={36} color="white" />
//             </TouchableOpacity>
//           )}

//           {/* Add Manually Button */}
//           <TouchableOpacity onPress={openFilePicker} className="bg-amber-500 mt-5 px-6 py-3 rounded-lg">
//             <Text className="text-white font-bold">Add Manually</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* History List - Always at Bottom */}
//       <View className="absolute bottom-0 w-full">
//         <HistoryList data={historyData} />
//       </View>
//     </SafeAreaView>
//   );
// }




import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, ScrollView, Image, Dimensions 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { useRouter } from "expo-router";
import HistoryList from "../components/HistoryList";
import CustomTabBar from "../components/CustomBar";  // Ensure Custom TabBar is used
import SuccessMessage from "../components/SuccessMessage";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { CameraIcon , ArrowLeftIcon } from "react-native-heroicons/outline";

const { width, height } = Dimensions.get("window"); 

const historyData = [
  { id: "1", title: "Archeological Pot", location: "Anuradhapura", image: require("../assets/pot.png") },
  { id: "2", title: "Ancient Coin", location: "Polonnaruwa", image: require("../assets/pot.png") },
  { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
  { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
  { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
  { id: "3", title: "Carved Stone", location: "Sigiriya", image: require("../assets/pot.png") },
];

export default function BrahmiScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const router = useRouter();

  // Open Camera
  // Open Camera
  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
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

  // Simulate a successful prediction
  const handlePrediction = () => {
    console.log("Prediction Success!");
    setSuccessModalVisible(true);
    router.push("/predict" as any);
  };


  return (
    <View className="flex-1 bg-gray-50">
      {/* Background Shape */}
      

      {/* UI Circles for Design */}
      <View className="absolute w-[300px] h-[300px] bg-white opacity-20 rounded-full top-10 left-[-80px]" />
      <View className="absolute w-[250px] h-[250px] bg-white opacity-20 rounded-full top-40 right-[-50px]" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Header username="YourUsername" profileImage={require("../assets/user.png")} />

        {/* Back Button - Positioned Below the Header */}
        
        <View className="px-4 mt-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="bg-black/20 p-3 rounded-full w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeftIcon size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-center">Brahmi OCR</Text>
        </View>

        {/* Scanner Section */}
        <View className="items-center justify-center mt-5">
          {/* If Image Selected, Show Image Instead of Scanner Icon */}
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} className="w-28 h-28 rounded-full border-2 border-gray-400" />
          ) : (
            <TouchableOpacity
              className=" w-36 h-36 bg-black rounded-full flex items-center justify-center border-2 border-gray-300"
              onPress={openCamera}
            >
              <CameraIcon size={36} color="white" />
            </TouchableOpacity>
          )}

          {/* Add Manually Button */}
          <TouchableOpacity onPress={openFilePicker} className="bg-amber-500 mt-5 px-8 py-4 rounded-lg">
            <Text className="text-white font-bold">Add Manually</Text>
          </TouchableOpacity>

          {/* Predict Button Below Add Manually */}
          <TouchableOpacity onPress={handlePrediction} className="bg-green-500 mt-8 px-8 py-4 rounded-3xl">
            <Text className="text-white font-bold">Predict</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* History List - Always at Bottom */}
      <View className="absolute bottom-0 w-full">
        <HistoryList data={historyData} />
      </View>

      {/* Success Modal Component */}
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
