import { useState } from "react";
import { Link, router } from "expo-router";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton_3 from "../../components/CustomButton_3";

import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const submit = async () => {

    if (form.email === "" || form.password === "" || form.confirm_password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Check if password and confirm_password match
    if (form.password !== form.confirm_password) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Add a new document in collection "users"
      await setDoc(doc(db, "Users", res.user.uid), {
        username: form.username,
        email: form.email,
        password: form.password,
        timeStamp: serverTimestamp()
      });

      Alert.alert("Success", "User sign up successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-slate-100 h-full ">
      <ScrollView>
        <View
          className="w-full flex justify-center items-center h-full px-4 my-6"
          style={[

            { minHeight: Dimensions.get("window").height - 100, }
          ]}
        >
          <View className='w-full flex flex-row items-center justify-center '>
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-13 h-13"
            />

            <Text className="text-2xl font-semibold text-black font-psemibold pr-3">
              ScanHeritage
            </Text>
          </View>
          <Text className="text-4xl font-semibold text-black font-psemibold mt-20 mb-10">
            Sign Up
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-2"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-2"
          />
          <FormField
            title="Confirm password"
            value={form.confirm_password}
            handleChangeText={(e) => setForm({ ...form, confirm_password: e })}
            otherStyles="mt-2"
          />

          <CustomButton_3
            title="Log In"
            handlePress={submit}
            containerStyles="mt-4"
            className="w-full"
            isLoading={isSubmitting}
          />

          <View className='items-center mt-5'>
            <Text className="text-base font-semibold text-black font-psemibold mb-2">
              Or continue with
            </Text>
            <View className='flex flex-row gap-5'>
              <View className=' bg-gray-300 rounded-full  p-2'>
                <Image
                  source={images.Apple_icon}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </View>

              <View className=' bg-gray-300 rounded-full  p-2'>
                <Image
                  source={images.Google_icon}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </View>

              <View className=' bg-gray-300 rounded-full  p-2'>
                <Image
                  source={images.fb_icon}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </View>

            </View>
          </View>

          <View className="flex justify-center pt-10 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              already have an account?
            </Text>
            <Link
              href="/sign-in" className="text-lg font-psemibold text-primary"
            >
              Log in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp