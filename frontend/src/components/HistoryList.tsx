

import React from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions } from "react-native";
import HistoryCard from "./HistoryCard";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const screenHeight = Dimensions.get("window").height;

interface HistoryListProps {
  data: Array<{ id: string; title: string; location: string; image: any }>;
}

const HistoryList: React.FC<HistoryListProps> = ({ data }) => {
  const containerHeight = useSharedValue(300);

  const animatedStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
  }));

  const panGesture = Gesture.Pan().onEnd((event) => {
    if (event.translationY < -50) {
      containerHeight.value = withTiming(screenHeight * 0.9, { duration: 300 });
    } else if (event.translationY > 50) {
      containerHeight.value = withTiming(300, { duration: 300 });
    }
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        className="bg-white w-full rounded-t-3xl p-5 shadow-lg"
        style={animatedStyle}
      >
        {/* Draggable Indicator */}
        <View className=" w-24 h-1 bg-gray-600 rounded-full mx-auto  z-10" />

        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-black font-bold text-lg">HISTORY</Text>
          <TouchableOpacity onPress={() => console.log("See More")}>
            <Text className="text-amber-600 font-medium">See more</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable List */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default HistoryList;
