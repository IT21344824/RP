// import React from "react";
// import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import HistoryCard from "./HistoryCard";

// interface HistoryListProps {
//   data: Array<{ id: string; title: string; location: string; image: any }>;
// }

// const HistoryList: React.FC<HistoryListProps> = ({ data }) => {
//   return (
//     <View className="bg-white w-full rounded-t-3xl p-5 h-[300px] shadow-lg">
//       {/* Header */}
//       <View className="flex-row justify-between items-center mb-3">
//         <Text className="text-black font-bold text-lg">HISTORY</Text>
//         <TouchableOpacity onPress={() => console.log("See More")}>
//           <Text className="text-amber-600 font-medium">See more</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Scrollable List */}
//       <FlatList
//         data={data}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <HistoryCard item={item} />}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default HistoryList;
