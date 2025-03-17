// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import * as ImagePicker from "expo-image-picker";
// import { ArrowLeftIcon, CameraIcon } from "react-native-heroicons/outline";
// import { Formik } from "formik";
// import ProfileSchema from "../../validations/ProfileSchema"; // Import validation schema


// export default function profile() {

// const router = useRouter();
//   const [profileImage, setProfileImage] = useState<string | null>(null);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });
//     if (!result.canceled) {
//       setProfileImage(result.assets[0].uri);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100 px-6 py-4">
//       {/* Header */}
//       <View className="flex-row items-center mb-4">
//         <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-200">
//           <ArrowLeftIcon size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-xl font-bold ml-4">Profile</Text>
//       </View>
      
//       <Text className="text-center text-gray-500">Please fill out your details to update Account</Text>
      
//       {/* Profile Image */}
//       <View className="items-center my-4">
//         <TouchableOpacity onPress={pickImage} className="relative">
//           <Image
//             source={profileImage ? { uri: profileImage } : require("../assets/default_avatar.png")}
//             className="w-24 h-24 rounded-full border-2 border-gray-300"
//           />
//           <View className="absolute bottom-0 right-0 bg-black p-2 rounded-full">
//             <CameraIcon size={16} color="white" />
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* Formik Form */}
//       <Formik
//         initialValues={{ username: "", email: "", bio: "", address: "", city: "", mobile: "" }}
//         validationSchema={ProfileSchema}
//         onSubmit={(values) => console.log("Form submitted!", values)}
//       >
//         {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
//           <View className="space-y-3">
//             <TextInput
//               className="bg-white p-3 rounded-lg border border-gray-300"
//               placeholder="Username"
//               onChangeText={handleChange("username")}
//               onBlur={handleBlur("username")}
//               value={values.username}
//             />
//             {touched.username && errors.username && <Text className="text-red-500">{errors.username}</Text>}

//             <TextInput
//               className="bg-white p-3 rounded-lg border border-gray-300"
//               placeholder="Email"
//               onChangeText={handleChange("email")}
//               onBlur={handleBlur("email")}
//               value={values.email}
//               keyboardType="email-address"
//             />
//             {touched.email && errors.email && <Text className="text-red-500">{errors.email}</Text>}

//             <TextInput
//               className="bg-white p-3 rounded-lg border border-gray-300"
//               placeholder="Bio"
//               onChangeText={handleChange("bio")}
//               onBlur={handleBlur("bio")}
//               value={values.bio}
//             />

//             <TextInput
//               className="bg-white p-3 rounded-lg border border-gray-300"
//               placeholder="Address"
//               onChangeText={handleChange("address")}
//               onBlur={handleBlur("address")}
//               value={values.address}
//             />

//             <TextInput
//               className="bg-white p-3 rounded-lg border border-gray-300"
//               placeholder="City"
//               onChangeText={handleChange("city")}
//               onBlur={handleBlur("city")}
//               value={values.city}
//             />

//             <TextInput
//               className="bg-white p-3 rounded-lg border border-gray-300"
//               placeholder="Mobile"
//               onChangeText={handleChange("mobile")}
//               onBlur={handleBlur("mobile")}
//               value={values.mobile}
//               keyboardType="numeric"
//             />
//             {touched.mobile && errors.mobile && <Text className="text-red-500">{errors.mobile}</Text>}

//             {/* Buttons */}
//             <TouchableOpacity onPress={() => handleSubmit()} className="bg-amber-500 p-4 rounded-lg">
//               <Text className="text-white text-center font-bold">Update Account</Text>
//             </TouchableOpacity>
//             <TouchableOpacity className="bg-red-500 p-4 rounded-lg">
//               <Text className="text-white text-center font-bold">Delete Account</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </Formik>
//     </SafeAreaView>
//   );
// };



import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, CameraIcon } from "react-native-heroicons/outline";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import ProfileSchema from "../../validations/ProfileSchema";
import useAuthStore from "../../store/useAuthStore";
import { pickProfileImage } from "../../api/auth_api";


export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUserProfile, deleteUserAccount, isLoading, loadUser } =
    useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profile_image || null
  );

  // Open Camera
  const openCamera = async () => {
    // Request Camera Permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access in your device settings."
      );
      return;
    }

    // Open Camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images, // Fix deprecated option
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Handle Selected Image
    if (!result.canceled && result.assets?.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    loadUser().then(() => {
      //console.log("Loaded User Data:", user); // Debugging
    });
  }, []);
  


  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteUserAccount(() => {
              router.replace("/login");
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-6 py-4">
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center mb-6 justify-between">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-gray-800"
          >
            <ArrowLeftIcon size={24} color="white" />
          </TouchableOpacity>

          {/* Centered Text */}
          <View className="flex-1 items-center -ml-8">
            <Text className="text-white text-3xl font-bold">Profile</Text>
          </View>

          {/* Invisible View to Maintain Alignment */}
          <View className="w-10" />
        </View>

        <Text className="text-center text-gray-400 mb-4">
          Please fill out your details to update Account
        </Text>

        <View className="items-center my-4">
          <TouchableOpacity onPress={openCamera} className="relative">
            {/* Profile Image */}
            <Image
              source={profileImage ? { uri: profileImage } : require("../../assets/user.png")}
              className=" w-36 h-36 rounded-full border-4 border-gray-500"
            />
            {/* Camera Icon */}
            <View className="absolute bottom-2 right-2 bg-white p-2 rounded-full">
              <CameraIcon size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>

        <Formik
          initialValues={{
            username: user?.username ?? "",
            email: user?.email ?? "",
            bio: user?.bio ?? "",
            address: user?.address ?? "",
            city: user?.city ?? "",
            mobile: user?.mobile ?? "",
          }}
          validationSchema={ProfileSchema}
          onSubmit={(values) => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("email", values.email);
            formData.append("bio", values.bio);
            formData.append("address", values.address);
            formData.append("city", values.city);
            formData.append("mobile", values.mobile);

            if (profileImage) {
              const uriParts = profileImage.split(".");
              const fileType = uriParts[uriParts.length - 1];
              formData.append("profile_image", {
                uri: profileImage,
                name: `profile.${fileType}`,
                type: `image/${fileType}`,
              } as any);
            }

            updateUserProfile(formData, () => {
              loadUser();
              router.back();
            });
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View className="space-y-4 mt-6">
              <TextInput
                className="bg-gray-200 text-black p-4 rounded-lg mb-5"
                placeholder="Username"
                placeholderTextColor="gray"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
              <TextInput
                className="bg-gray-200 text-black p-4 rounded-lg mb-5"
                placeholder="Email"
                placeholderTextColor="gray"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
              />
              <TextInput
                className="bg-gray-200 text-black p-4 rounded-lg mb-5 h-24"
                placeholder="Bio.."
                placeholderTextColor="gray"
                onChangeText={handleChange("bio")}
                onBlur={handleBlur("bio")}
                value={values.bio}
                multiline={true}
                numberOfLines={4}
                style={{ textAlignVertical: "top" }}
              />
              <TextInput
                className="bg-gray-200 text-black p-4 rounded-lg mb-5 h-20"
                placeholder="Address"
                placeholderTextColor="gray"
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
                multiline={true}
                numberOfLines={3}
                style={{ textAlignVertical: "top" }}
              />
              <TextInput
                className="bg-gray-200 text-black p-4 rounded-lg mb-5"
                placeholder="City"
                placeholderTextColor="gray"
                onChangeText={handleChange("city")}
                onBlur={handleBlur("city")}
                value={values.city}
              />
              <TextInput
                className="bg-gray-200 text-black p-4 rounded-lg mb-5"
                placeholder="Mobile"
                placeholderTextColor="gray"
                onChangeText={handleChange("mobile")}
                onBlur={handleBlur("mobile")}
                value={values.mobile}
                keyboardType="numeric"
              />

              <TouchableOpacity
                onPress={() => handleSubmit()}
                disabled={isLoading}
                className="bg-amber-500 p-4 rounded-full border border-white mt-4"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center font-bold">
                    Update Account
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteAccount}
                disabled={isLoading}
                className="bg-red-500 p-4 rounded-full border border-white mt-5"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center font-bold">
                    Delete Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}

