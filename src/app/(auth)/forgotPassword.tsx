import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { Formik } from "formik";
import Animated, { FadeInUp } from "react-native-reanimated";
import FormInput from "../../components/formLogin"; // Reusable Input Component
import { ForgotPasswordSchema } from "../../validations/ForgotPasswordSchema"; // Validation Schema

export default function ForgotPassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Fixes Notch Area

  return (
     <SafeAreaView className="flex-1 bg-gray-900 px-6 pb-8">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View className="flex-row items-center mt-5 justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={30} color="white" />
        </TouchableOpacity>
        <Text className="text-gray-100 font-medium text-lg italic">ScanHeritage</Text>
      </View>

      {/* Title */}
      <View className="mt-20">
        <Text className="text-white text-center font-bold text-3xl">Reset Password</Text>
        <Text className="text-gray-400 text-center mt-2">Enter your email to receive a password reset link</Text>
      </View>

      {/* Formik Form */}
      <Formik
        initialValues={{ email: "" }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => {
          console.log("Reset link sent to:", values.email);
          // Add password reset logic here
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <Animated.View entering={FadeInUp.duration(500)} className="mt-10 space-y-8">
            {/* Email Input */}
            <Text className="text-white font-medium mb-5">Your Email</Text>
            <FormInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email && errors.email}
            />

            {/* Reset Password Button */}
            <TouchableOpacity
  className="bg-amber-500 py-4 rounded-lg mt-8 border-2 border-yellow-300 shadow-lg shadow-yellow-400"
  onPress={() => router.push("/verifyPin"as any)}
>
  <Text className="text-center text-black font-bold text-lg">Reset Password</Text>
</TouchableOpacity>

          </Animated.View>
        )}
      </Formik>
    </SafeAreaView>
  );
}
