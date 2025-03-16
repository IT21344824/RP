import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "../components/Header"; // Adjust the path as necessary
import { ArrowLeftIcon, BookmarkIcon, ChevronUpIcon } from "react-native-heroicons/outline";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const { height: screenHeight } = Dimensions.get("window");

const PredictedScreen = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview"); // State to switch between Overview & Historical

  // Height Animation (Instead of TranslateY)
  const containerHeight = useSharedValue(300); // Default collapsed height

  const animatedStyle = useAnimatedStyle(() => ({
    height: containerHeight.value, // Expand instead of moving
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
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <Header username="YourUsername" profileImage={require("../assets/user.png")} />
        <View className="flex-row items-center justify-between px-4 mt-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-200">
            <ArrowLeftIcon size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold">Brahmi OCR</Text>
          <TouchableOpacity onPress={() => console.log("Bookmark clicked")} className="p-2 rounded-full bg-gray-200">
            <BookmarkIcon size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Prediction Image Section */}
        <View className="items-center mt-6">
          <View className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Image source={require("../assets/pot.png")} className="w-20 h-20" />
          </View>
          {/* Smaller Predicted Images */}
          <View className="flex-row mt-4 space-x-3">
            {[1, 2, 3, 4].map((_, index) => (
              <Image
                key={index}
                source={require("../assets/pot.png")}
                className="w-10 h-10 border border-gray-300 rounded-md"
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Draggable Bottom Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={animatedStyle}
          className="absolute bottom-0 w-full bg-white rounded-t-3xl p-5 shadow-lg"
        >
            {/* Draggable Indicator */}
                 <View className=" w-24 h-1 bg-gray-600 rounded-full mx-auto  z-10" />
       

          {/* Title */}
          <Text className="text-lg font-bold text-center mt-6">Predicted letter/letters</Text>

          {/* Tab Switcher */}
          <View className="flex-row justify-center mt-3 space-x-5 gap-32">
            <TouchableOpacity onPress={() => setSelectedTab("overview")}
              className={`${selectedTab === "overview" ? "border-b-2 border-black" : "opacity-50"}`}>
              <Text className="text-lg font-bold">Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab("historical")}
              className={`${selectedTab === "historical" ? "border-b-2 border-black" : "opacity-50"}`}>
              <Text className="text-lg font-bold">Historical</Text>
            </TouchableOpacity>
          </View>

          {/* Display Text Based on Tab */}
          {selectedTab === "overview" ? (
            <Text className="text-gray-600 mt-3">
              This vast mountain range is renowned for its remarkable diversity in terms of topography and climate...
            </Text>
          ) : (
            <Text className="text-gray-600 mt-3">
              Historically, this artifact was found in ancient ruins and signifies cultural heritage...
            </Text>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default PredictedScreen;
