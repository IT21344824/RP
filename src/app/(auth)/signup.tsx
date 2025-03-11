import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { Formik } from "formik";
import Animated, { FadeInUp } from "react-native-reanimated";
import FormInput from "../../components/formLogin"; // Reusable Input Component
import { SignupSchema } from "../../validations/SignupSchema"; // Validation Schema

export default function Signup() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const insets = useSafeAreaInsets(); // Fixes Notch Area

  return (
    <SafeAreaView className="flex-1 bg-black px-6 pb-8">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View className="flex-row items-center mt-5 justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={30} color="white" />
        </TouchableOpacity>
        <Text className="text-gray-100 font-medium text-lg italic">ScanHeritage</Text>
      </View>

      {/* Title */}
      <View className="mt-12">
        <Text className="text-white text-center font-bold text-3xl">Sign up here !</Text>
        <Text className="text-gray-400 text-center mt-2">Please fill out your details and create a ScanHeritage Account</Text>
      </View>

      {/* Formik Form */}
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          console.log(values);
          // router.push("/dashboard");
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <Animated.View entering={FadeInUp.duration(500)} className="mt-10 space-y-8">
            {/* Username Input */}
            <FormInput
              placeholder="Username"
              value={values.username}
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              error={touched.username && errors.username}
            />

            {/* Email Input */}
            <FormInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email && errors.email}
            />

            {/* Password Input */}
            <FormInput
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              error={touched.password && errors.password}
              secureTextEntry={!passwordVisible}
              togglePassword={() => setPasswordVisible(!passwordVisible)}
              showPassword={passwordVisible}
            />

            {/* Signup Button with Glowing Effect */}
            <TouchableOpacity className="bg-amber-500 py-4 rounded-lg mt-8 border-2 border-yellow-300 shadow-lg shadow-yellow-400" onPress={() => handleSubmit()}>
              <Text className="text-center text-black font-bold text-lg">SIGN UP</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Formik>

      {/* OR Section */}
      <View className="flex-row items-center justify-center my-5 mt-8">
        <View className="flex-1 h-0.5 bg-gray-600" />
        <Text className="text-gray-400 mx-3">or</Text>
        <View className="flex-1 h-0.5 bg-gray-600" />
      </View>

      {/* Social Login */}
      <View className="flex-row justify-center space-x-6 gap-10">
        <TouchableOpacity onPress={() => console.log("Google Signup Pressed")}>
          <Image source={require("../../assets/google.png")} className="w-10 h-10" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Facebook Signup Pressed")}>
          <Image source={require("../../assets/facebook.png")} className="w-10 h-10" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Instagram Signup Pressed")}>
          <Image source={require("../../assets/instagram.png")} className="w-10 h-10" />
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <Text className="text-gray-400 text-center mt-6">
        Already have an account?{" "}
        <Text className="text-amber-500 font-semibold ml-5 text-lg" onPress={() => router.push("/login")}>Sign In here</Text>
      </Text>
    </SafeAreaView>
  );
}
