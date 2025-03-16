import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { Formik } from "formik";
import Animated, { FadeInUp } from "react-native-reanimated";
import FormInput from "../../components/formLogin"; // Import FormInput component
import { PasswordSchema } from "../../validations/PasswordSchema"; // Import validation schema
import SuccessMessage from "../../components/SuccessMessage"; // Import SuccessMessage Component

export default function SetPassword() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
      <View className="mt-10">
        <Text className="text-white text-left font-bold text-3xl">Set a new Password</Text>
        <Text className="text-gray-400 text-left mt-2">
          Create a new password. Ensure it differs from previous ones for security.
        </Text>
      </View>

      {/* Formik for Password Input */}
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={PasswordSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("New Password:", values.password);

          // Simulate API call and show success modal
          setTimeout(() => {
            setSubmitting(false);
            setModalVisible(true);

            // Auto close modal and navigate to Login screen
            setTimeout(() => {
              setModalVisible(false);
              router.push("/login");
            }, 3000);
          }, 2000);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <Animated.View entering={FadeInUp.duration(500)} className="mt-10 space-y-8">
            {/* Password Input */}
            <View>
              <Text className="text-white font-semibold mb-2">Password</Text>
              <FormInput
                placeholder="Enter your new password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password && errors.password}
                secureTextEntry={!passwordVisible}
                togglePassword={() => setPasswordVisible(!passwordVisible)}
                showPassword={passwordVisible}
              />
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text className="text-white font-semibold mb-2">Confirm Password</Text>
              <FormInput
                placeholder="Re-enter password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={touched.confirmPassword && errors.confirmPassword}
                secureTextEntry={!confirmPasswordVisible}
                togglePassword={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                showPassword={confirmPasswordVisible}
              />
            </View>

            {/* Update Password Button */}
            <TouchableOpacity
              className={`bg-amber-500 py-4 rounded-lg mt-8 border-2 border-yellow-300 shadow-lg shadow-yellow-400 ${
                isSubmitting ? "opacity-50" : ""
              }`}
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
            >
              <Text className="text-center text-black font-bold text-lg">
                {isSubmitting ? "Updating..." : "Update Password"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Formik>

      {/*Success Message Component */}
      <SuccessMessage
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          router.push("/login");
        }}
        title="Set Password Successful"
        message="Congratulations! Your password has been changed. Redirecting to Login..."
      />
    </SafeAreaView>
  );
}
