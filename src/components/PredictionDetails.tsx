// import React from "react";
// import { View, Text, TouchableOpacity, Dimensions } from "react-native";
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
// import { GestureDetector, Gesture } from "react-native-gesture-handler";

// const { height } = Dimensions.get("window"); // Get screen height

// interface PredictedDetailsProps {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }

// const PredictedDetails: React.FC<PredictedDetailsProps> = ({ activeTab, setActiveTab }) => {
//   const translateY = useSharedValue(200); // Initial position of bottom sheet

//   // Gesture handling for drag up/down
//   const gesture = Gesture.Pan()
//     .onUpdate((event) => {
//       translateY.value = Math.max(-height * 0.3, Math.min(200, event.translationY)); // Set limits
//     })
//     .onEnd(() => {
//       if (translateY.value < 100) {
//         translateY.value = withSpring(-height * 0.2); // Expand if pulled up enough
//       } else {
//         translateY.value = withSpring(200); // Collapse if released early
//       }
//     });

//   // Animated styles for smooth dragging
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   return (
//     <GestureDetector gesture={gesture}>
//       <Animated.View
//         style={animatedStyle}
//         className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-lg"
//       >
//         {/* Drag Handle */}
//         <View className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-3" />

//         {/* Title */}
//         <Text className="text-lg font-bold text-center">Predicted letter/letters</Text>

//         {/* Tab Switcher */}
//         <View className="flex-row justify-center mt-4 space-x-5 border-b pb-2">
//           <TouchableOpacity onPress={() => setActiveTab("overview")}>
//             <Text className={`text-md ${activeTab === "overview" ? "font-bold text-black" : "text-gray-400"}`}>
//               Overview
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setActiveTab("historical")}>
//             <Text className={`text-md ${activeTab === "historical" ? "font-bold text-black" : "text-gray-400"}`}>
//               Historical
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Content */}
//         <View className="mt-4">
//           {activeTab === "overview" ? (
//             <Text className="text-sm text-gray-600">
//               This vast mountain range is renowned for its remarkable diversity in terms of topography and climate.
//             </Text>
//           ) : (
//             <Text className="text-sm text-gray-600">
//               It features towering peaks, active volcanoes, deep canyons, and a rich history of human civilization.
//             </Text>
//           )}
//         </View>
//       </Animated.View>
//     </GestureDetector>
//   );
// };

// export default PredictedDetails;
