import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { Formik } from "formik";
import Animated, { FadeInUp } from "react-native-reanimated";
import FormInput from "../../components/formLogin"; // Importing FormInput
import { LoginSchema } from "../../validations/LoginSchema"; // Importing validation


export default function Login() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  
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
      <View className=" mt-16">
        <Text className="text-white text-center font-bold text-3xl">Sign in here !</Text>
        <Text className="text-gray-400 text-center mt-2">Please fill out your details to get ScanHeritage Account</Text>
      </View>

      {/* Formik Form */}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log(values);
         router.push("/(tabs)/home" as any);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <Animated.View entering={FadeInUp.duration(500)} className="mt-12 space-y-8">
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

            {/* Forgot Password Link */}
            <TouchableOpacity className="self-end mt-3">
              <Text className="text-gray-200 font-semibold text-lg" onPress={() => router.push("/forgotPassword" as any)}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button with Glowing Border */}
            <TouchableOpacity className="bg-amber-500 py-4 rounded-lg mt-8 border-2 border-yellow-300 shadow-lg shadow-yellow-400" onPress={() => handleSubmit()}> 
              <Text className="text-center text-black font-bold text-lg">Sign in</Text>
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
                <TouchableOpacity onPress={() => console.log("Google Login Pressed")}> 
                <Image source={require("../../assets/google.png")} className="w-10 h-10" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("Facebook Login Pressed")}> 
                <Image source={require("../../assets/facebook.png")} className="w-10 h-10" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("Instagram Login Pressed")}> 
                <Image source={require("../../assets/instagram.png")} className="w-10 h-10" />
                </TouchableOpacity>
            </View>

      {/* Sign Up Link */}
      <Text className="text-gray-400 text-center mt-6">
        Don’t have an account?{' '}
        <Text className="text-amber-500 font-semibold ml-5 text-lg"onPress={() => router.push("/signup" as any)}>Sign up here</Text>
      </Text>
    </SafeAreaView>
  );
}
