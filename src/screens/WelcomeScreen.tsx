import React, { useRef, useState, useEffect } from "react";
import { View, Text, ImageBackground, TouchableOpacity, StatusBar, FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Animated, { FadeIn } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Asset from "expo-asset";

const { width, height } = Dimensions.get("screen");

const slides = [
  { id: 1, text: "Discover the Past\n Shape the Future" },
  { id: 2, text: "Preserve Heritage\n with AI" },
  { id: 3, text: "Join the Cultural\n Revolution" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % slides.length;
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
        return newIndex;
      });
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / wp(100));
    setActiveIndex(slideIndex);
  };

  return (
    
    <ImageBackground source={require("../assets/bg2.jpg")}style={{ width, height }} className="flex-1 relative" resizeMode="cover">
      {/* <BlurView intensity={20} className="absolute inset-0 w-screen h-screen rounded-lg" /> */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView className="flex-1 justify-between pb-8">
        {/* App Title */}
        <View className="mt-5 items-center">
          <Text className="text-white font-bold text-lg italic">ScanHeritage</Text>
        </View>

        {/* Auto Swiper Text in Center */}
        <View className="flex-1 justify-center items-center">
          <FlatList
            ref={flatListRef}
            data={slides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <View className="w-screen items-center justify-center">
                <Text className="text-white text-center font-bold text-6xl tracking-normal">{item.text}</Text>
              </View>
            )}
          />
        </View>

        {/* Swiper Indicators */}
        <View className="flex flex-row justify-center space-x-2">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 mb-6 mx-1 rounded-full  ${activeIndex === index ? "w-6 bg-white" : "w-3 bg-gray-400"}`}
            />
          ))}
        </View>

        {/* Buttons */}
        <Animated.View entering={FadeIn.duration(500)} className="items-center">
          <TouchableOpacity
            className="bg-amber-500 py-4 px-12 rounded-full"
           // onPress={() => router.push("/dashboard")}
          >
            <Text className="text-black font-bold text-lg">GET STARTED</Text>
          </TouchableOpacity>

          <Text className="text-white text-sm mt-10">
            Already have an account?{' '}
            <Text className="text-amber-500 font-semibold text-lg" >Sign In here</Text>
          </Text>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}
//onPress={() => router.push("/login")}