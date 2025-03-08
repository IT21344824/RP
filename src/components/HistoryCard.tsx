// import React from "react";
// import { View, Text, Image } from "react-native";
// import Animated, { FadeInRight } from "react-native-reanimated";

// interface HistoryCardProps {
//   item: {
//     id: string;
//     title: string;
//     location: string;
//     image: any;
//   };
// }

// const HistoryCard: React.FC<HistoryCardProps> = ({ item }) => {
//   return (
//     <Animated.View
//       entering={FadeInRight.duration(500)}
//       className="bg-white flex-row items-center p-3 rounded-lg mb-3 shadow-md"
//     >
//       {/* Image */}
//       <Image source={item.image} className="w-12 h-12 rounded-md" resizeMode="contain" />
      
//       {/* Text Content */}
//       <View className="ml-3">
//         <Text className="text-black font-bold">{item.title}</Text>
//         <Text className="text-gray-500 text-xs">{item.location}</Text>
//       </View>
//     </Animated.View>
//   );
// };

// export default HistoryCard;
