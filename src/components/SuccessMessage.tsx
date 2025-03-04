// import React from "react";
// import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
// import { BlurView } from "expo-blur";
// import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";


// interface SuccessMessageProps {
//   visible: boolean;
//   onClose: () => void;
//   title: string;
//   message: string;
//   buttonText?: string;
// }

// const SuccessMessage: React.FC<SuccessMessageProps> = ({
//   visible,
//   onClose,
//   title,
//   message,
//   buttonText = "Done",
// }) => {
//   return (
//     <Modal visible={visible} transparent animationType="fade">
        
//       {/* Blur Background */}
//       <BlurView intensity={50} className="flex-1 justify-center items-center bg-black/60 px-6">
//         <Animated.View
//           entering={FadeInUp.duration(600)}
//           className="bg-white p-3 border-4 border-amber-400 w-full h-96  max-w-sm shadow-2xl shadow-black rounded-3xl"
//         >
//           <View className="items-center space-y-8 m-6">
//             {/* Success Icon with Improved Padding */}
//             <Animated.View entering={FadeIn.duration(800)}>
//               <View className="w-24 h-24 border-4 border-amber-500 rounded-full flex items-center justify-center bg-amber-100 p-6">
//                 <Image source={require("../assets/success.png")} className="w-14 h-14" />
//               </View>
//             </Animated.View>

//             {/* Title & Message with More Padding */}
//             <View className="px-6">
//               <Text className="text-black font-extrabold text-2xl text-center">{title}</Text>
//               <Text className="text-gray-600 text-center mt-3 leading-relaxed text-base">
//                 {message}
//               </Text>
//             </View>

//             {/* Button with Glowing Effect */}
//             <TouchableOpacity
//               className="bg-black py-4 px-8 rounded-full w-full max-w-[180px] border border-gray-600 shadow-lg shadow-amber-400 mt-5"
//               onPress={onClose}
//             >
//               <Text className="text-white font-bold text-lg text-center">{buttonText}</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </BlurView>
//     </Modal>
//   );
// };

// export default SuccessMessage;
