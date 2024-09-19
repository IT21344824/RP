import { useState } from "react";
import { Link, router } from "expo-router";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton_3 from "../../components/CustomButton_3";


const SignIn = () => {
    // const { setUser, setIsLogged } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const submit = async () => {
        // if (form.email === "" || form.password === "") {
        //   Alert.alert("Error", "Please fill in all fields");
        // }

        // setSubmitting(true);

        // try {
        //   await signIn(form.email, form.password);
        //   const result = await getCurrentUser();
        //   setUser(result);
        //   setIsLogged(true);

        //   Alert.alert("Success", "User signed in successfully");
        //   router.replace("/home");
        // } catch (error) {
        //   Alert.alert("Error", error.message);
        // } finally {
        //   setSubmitting(false);
        // }
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
                    <Text className="text-4xl font-semibold text-black font-psemibold mt-40 mb-10">
                        Login
                    </Text>

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                    />

                    <CustomButton_3
                        title="Log In"
                        handlePress={submit}
                        containerStyles="mt-7"
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
                            Don't have an account?
                        </Text>
                        <Link
                            href="/sign-up" className="text-lg font-psemibold text-primary"
                        >
                            Sign up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
