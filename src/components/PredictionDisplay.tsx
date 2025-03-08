// import React from "react";
// import { View, Image, ScrollView } from "react-native";

// interface PredictionDisplayProps {
//   mainImage: any;
//   additionalImages: any[];
// }

// const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ mainImage, additionalImages }) => {
//   return (
//     <View className="items-center mt-5">
//       {/* Large Predicted Image */}
//       <View className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center shadow-md">
//         <Image source={mainImage} className="w-20 h-20" resizeMode="contain" />
//       </View>

//       {/* Small Predicted Images in Right Corner */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
//         {additionalImages.map((img, index) => (
//           <View key={index} className="w-14 h-14 mx-2 bg-gray-100 rounded-md flex items-center justify-center shadow-md">
//             <Image source={img} className="w-10 h-10" resizeMode="contain" />
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default PredictionDisplay;
