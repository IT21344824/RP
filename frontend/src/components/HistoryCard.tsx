import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

interface HistoryCardProps {
  item: {
    id: string;
    title: string;
    location: string;
    image: any;
  };
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item }) => {
  return (
    <Animated.View
      entering={FadeInRight.duration(500)}
      className=" border flex-row items-center p-3 rounded-full gap-10 mb-3 shadow-md"
    >
      {/* Image */}
      <Image source={item.image} className=" ml-7w-12 h-12 rounded-md" resizeMode="contain" />
      
      {/* Text Content */}
      <View className="ml-3">
        <Text className="text-black font-bold">{item.title}</Text>
        <Text className="text-gray-500 text-xs">{item.location}</Text>
      </View>
    </Animated.View>
  );
};

export default HistoryCard;


// import React from "react";
// import { View, Text, Image } from "react-native";
// import Animated, { FadeInRight } from "react-native-reanimated";

// interface HistoryCardProps {
//   item: {
//     predictedClass: string;
//     classDescription: string;
//     imageUrl: string;
//     date: string;
//   };
// }

// const HistoryCard: React.FC<HistoryCardProps> = ({ item }) => {
//   return (
//     <Animated.View
//       entering={FadeInRight.duration(500)}
//       className="border flex-row items-center p-3 rounded-lg gap-10 mb-3 shadow-md bg-white"
//     >
//       {/* Image */}
//       <Image source={{ uri: item.imageUrl }} className="w-16 h-16 rounded-md" resizeMode="cover" />
      
//       {/* Text Content */}
//       <View className="ml-3">
//         <Text className="text-black font-bold">{item.predictedClass}</Text>
//         <Text className="text-gray-500 text-sm">{item.classDescription}</Text>
//         <Text className="text-gray-400 text-xs">{item.date}</Text>
//       </View>
//     </Animated.View>
//   );
// };

// export default HistoryCard;
