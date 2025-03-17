import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../components/Header"; 
import usePredictionStore from "../store/useBrahmiStore";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const { height: screenHeight } = Dimensions.get("window");

const PredictedScreen = () => {
  const router = useRouter();
  const { predictedClass, classDescription, additionalInfo, imageUrl } = usePredictionStore();

  const [showDetails, setShowDetails] = useState(false); // Toggle Historical Info

  // Bottom Sheet Animation
  const containerHeight = useSharedValue(300); // Default collapsed height

  const animatedStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      containerHeight.value = Math.max(300, Math.min(screenHeight * 0.9, containerHeight.value - event.translationY));
    })
    .onEnd(() => {
      if (containerHeight.value > screenHeight * 0.6) {
        containerHeight.value = withTiming(screenHeight * 0.9, { duration: 300 }); // Expand
      } else {
        containerHeight.value = withTiming(300, { duration: 300 }); // Collapse
      }
    });

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <Header/>
        <View className="flex-row items-center justify-between px-4 mt-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-200">
            <ArrowLeftIcon size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold">Brahmi OCR</Text>
          <View className="w-10" />
        </View>

        {/* Prediction Image */}
        <View className="items-center mt-6">
          {imageUrl && (
            <Image source={{ uri: imageUrl }} className=" w-80 h-80 rounded-xl shadow-lg" />
          )}
        </View>
      </ScrollView>

      {/* Draggable Bottom Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={animatedStyle}
          className="absolute bottom-0 w-full bg-white rounded-t-3xl p-5 shadow-lg"
        >
          {/* Draggable Indicator */}
          <View className="w-24 h-1 bg-gray-600 rounded-full mx-auto z-10" />

          {/* Predicted Class */}
          <Text className="text-lg font-bold text-center mt-6">
            Predicted Class: {predictedClass || "No Prediction Yet"}
          </Text>

          {/* View Data Button */}
          {!showDetails && (
            <TouchableOpacity
              onPress={() => setShowDetails(true)}
              className="bg-amber-500 p-4 rounded-full mt-6"
            >
              <Text className="text-white font-bold text-center">View Historical Data</Text>
            </TouchableOpacity>
          )}

          {/* Historical Data (Shown After Clicking Button) */}
          {showDetails && (
            <View className="p-4 mt-4 bg-white rounded-md shadow-lg">
              <Text className="text-lg font-bold">Description:</Text>
              <Text className="text-gray-600">{classDescription || "No description available."}</Text>

              <Text className="text-lg font-bold mt-3">Additional Info:</Text>
              <Text className="text-gray-600">{additionalInfo || "No additional information."}</Text>
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default PredictedScreen;
