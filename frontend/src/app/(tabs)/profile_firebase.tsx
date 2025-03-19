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

// Firebase imports
import {
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth, db, storage } from "../../../firebase";
import { deleteUser } from "firebase/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    username: string;
    email: string;
    bio?: string;
    address?: string;
    city?: string;
    mobile?: string;
    profileImage?: string;
  } | null>(null);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, "Users", currentUser.uid);
        const userSnap = await getDoc(docRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser({
            id: currentUser.uid,
            username: userData.username || "",
            email: userData.email || "",
            bio: userData.bio || "",
            address: userData.address || "",
            city: userData.city || "",
            mobile: userData.mobile || "",
            profileImage: userData.profileImage || null,
          });
          setProfileImage(userData.profileImage || null);
        }
      }
    };

    fetchUser();
  }, []);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access in your device settings."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const userId = auth.currentUser?.uid;
      if (!userId) return null;

      const imageRef = ref(storage, `profileImages/${userId}`);
      const uploadTask = uploadBytesResumable(imageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleUpdateProfile = async (values: any) => {
    setIsLoading(true);

    try {
      let uploadedImageUrl = profileImage;

      if (profileImage && profileImage.startsWith("file")) {
        uploadedImageUrl = await uploadImage(profileImage);
      }

      const userRef = doc(db, "Users", user?.id!);
      await updateDoc(userRef, {
        username: values.username,
        email: values.email,
        bio: values.bio,
        address: values.address,
        city: values.city,
        mobile: values.mobile,
        profileImage: uploadedImageUrl,
      });

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

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
            try {
              await deleteUser(auth.currentUser!);
              Alert.alert("Account Deleted", "Your account has been deleted.");
              router.replace("/login");
            } catch (error) {
              console.error("Delete failed:", error);
              Alert.alert("Error", "Failed to delete account.");
            }
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
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-800">
            <ArrowLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 items-center -ml-8">
            <Text className="text-white text-3xl font-bold">Profile</Text>
          </View>
          <View className="w-10" />
        </View>

        <Text className="text-center text-gray-400 mb-4">Update your profile details</Text>

        <View className="items-center my-4">
          <TouchableOpacity onPress={openCamera} className="relative">
            <Image
              source={profileImage ? { uri: profileImage } : require("../../assets/user.png")}
              className="w-36 h-36 rounded-full border-4 border-gray-500"
            />
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
          onSubmit={handleUpdateProfile}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View className="space-y-4 mt-6">
              {(["username", "email", "bio", "address", "city", "mobile"] as Array<keyof typeof values>).map((field) => (
                <TextInput
                  key={field}
                  className="bg-gray-200 text-black p-4 rounded-lg mb-5"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  onChangeText={handleChange(field)}
                  onBlur={handleBlur(field)}
                  value={values[field]} // ✅ Fix applied
                />
              ))}


              <TouchableOpacity onPress={() => handleSubmit()} className="bg-amber-500 p-4 rounded-full">
                {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white text-center font-bold">Update</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeleteAccount} className="bg-red-500 p-4 rounded-full">
                <Text className="text-white text-center font-bold">Delete Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}
