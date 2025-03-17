import React from "react";
import { View, Text, ImageBackground, StatusBar, ScrollView, Dimensions ,SafeAreaView } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter
import Header from "../../components/Header";
import FeatureGrid from "../../components/FeatureGrid";
import useAuthStore from "../../store/useAuthStore"

const { height } = Dimensions.get("window"); // Get full screen height

export default function HomeScreen() {
  const router = useRouter(); // Initialize navigation
  const user = useAuthStore((state) => state.user); // Fetch user from Zustand

  const features = [
    {
      id: "1", title: "Object Detection", image: require("../../assets/object.png"), onPress: () => {
        console.log("Object Detection")
        router.push("/objectDetection")
      }
    },
    { id: "2", title: "Brahmi OCR", image: require("../../assets/ocr.jpg"), onPress: () => router.push("/brahmi") }, // Navigate to BrahmiScreen
    { id: "3", title: "Feature Extraction", image: require("../../assets/feature.png"), onPress: () => console.log("Feature Extraction") },
    {
      id: "4", title: "3D Modeling", image: require("../../assets/3d.jpg"), onPress: () => {
        console.log("3D Modeling")
        router.push("/3dModels")
      }
    },
  ];

  return (
    <View className="flex-1">
      {/* Full-Screen Background Image */}
      <ImageBackground
        source={require("../../assets/Home_bg.png")}
        className="absolute top-0 left-0 w-full h-full"
        resizeMode="cover"
      >
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, minHeight: height + 80 }} // Extend Background
          showsVerticalScrollIndicator={false}
        >
          {/* Header Component */}
          <Header />

          {/* Title & Subtitle */}
          <View className="mt-12 px-6">
            <Text className="text-white font-bold text-3xl text-center">ScanHeritage</Text>
            <Text className="text-gray-400 text-lg text-center mt-6">
              Join the Cultural Revolution with AI
            </Text>
          </View>

          {/* Feature Grid Component */}
          <View className="mt-6">
            <FeatureGrid features={features} />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
