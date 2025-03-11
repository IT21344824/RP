import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface FeatureItem {
  id: string;
  title: string;
  image: any;
  onPress: () => void;
}

interface FeatureGridProps {
  features: FeatureItem[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  return (
    <Animated.View
      entering={FadeInUp.duration(500)}
      className="flex-row flex-wrap justify-center gap-4 mt-4"
    >
      {features.map((feature) => (
        <TouchableOpacity
          key={feature.id}
          onPress={feature.onPress}
          className=" w-52 h-52 bg-white rounded-xl shadow-md flex items-center justify-center shadow-slate-800"
        >
          <Image source={feature.image} className="w-24 h-24 mb-2 rounded-3xl" />
          <Text className="text-black font-semibold text-sm text-center">
            {feature.title}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

export default FeatureGrid;
