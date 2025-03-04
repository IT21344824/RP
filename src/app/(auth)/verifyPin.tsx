// import React, { useRef, useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StatusBar } from "react-native";
// import { useRouter } from "expo-router";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { ArrowLeftIcon } from "react-native-heroicons/outline";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import Animated, { FadeInUp } from "react-native-reanimated";

// //PIN Code Validation Schema
// const PinSchema = Yup.object().shape({
//   pin: Yup.string()
//     .length(5, "Enter all 5 digits")
//     .matches(/^[0-9]+$/, "Only numbers are allowed")
//     .required("PIN is required"),
// });

// export default function VerifyPin() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets(); // Fixes Notch Area
//   const inputRefs = useRef<(TextInput | null)[]>([]);

//   return (
//     <SafeAreaView className="flex-1 bg-gray-900 px-6 pb-8">
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

//       {/* Header */}
//       <View className="flex-row items-center mt-5 justify-between">
//         <TouchableOpacity onPress={() => router.back()}>
//           <ArrowLeftIcon size={30} color="white" />
//         </TouchableOpacity>
//         <Text className="text-gray-100 font-medium text-lg italic">ScanHeritage</Text>
//       </View>

//       {/* Title */}
//       <View className="mt-20">
//         <Text className="text-white text-center font-bold text-3xl">Check your email</Text>
//         <Text className="text-gray-400 text-center mt-2">
//           We sent a reset link to <Text className="text-gray-200 font-semibold">contact@sheritage.com</Text>
//         </Text>
//         <Text className="text-gray-400 text-center mt-1">Enter the 5-digit code mentioned in the email</Text>
//       </View>

//       {/* Formik for PIN Input */}
//       <Formik
//         initialValues={{ pin: "" }}
//         validationSchema={PinSchema}
//         onSubmit={(values) => {
//           console.log("Verifying PIN:", values.pin);
//           //router.push("/auth/resetPassword"); // Redirect to reset password screen
//         }}
//       >
//         {({ handleChange, handleSubmit, values, errors, touched }) => (
//           <>
//             {/* OTP Input Fields */}
//             <Animated.View entering={FadeInUp.duration(500)} className="flex-row justify-center mt-16 space-x-4 gap-5">
//               {Array(5)
//                 .fill("")
//                 .map((_, index) => (
//                   <TextInput
//                     key={index}
//                     ref={(el) => (inputRefs.current[index] = el)}
//                     className={`w-14 h-14 text-white border-2 ${
//                       errors.pin && touched.pin ? "border-red-500" : "border-yellow-300"
//                     } text-center text-2xl font-bold rounded-lg`}
//                     keyboardType="number-pad"
//                     maxLength={1}
//                     value={values.pin[index] || ""}
//                     onChangeText={(text) => {
//                       let newPin = values.pin.split("");
//                       newPin[index] = text;
//                       handleChange("pin")(newPin.join(""));

//                       // Move to the next input field
//                       if (text && index < 4) {
//                         inputRefs.current[index + 1]?.focus();
//                       }
//                     }}
//                   />
//                 ))}
//             </Animated.View>

//             {/* Error Message */}
//             {errors.pin && touched.pin && (
//               <Text className="text-red-500 text-center mt-5">{errors.pin}</Text>
//             )}

//             {/* Verify Code Button */}
//             <TouchableOpacity
//               className="bg-amber-500 py-4 rounded-lg mt-12 border-2 border-yellow-300 shadow-lg shadow-yellow-400"
//               onPress={() => { handleSubmit(); router.push("/setPassword" as any); }}
//             >
//               <Text className="text-center text-black font-bold text-lg">Verify code</Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </Formik>
//     </SafeAreaView>
//   );
// }
