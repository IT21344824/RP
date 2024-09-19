import { Link } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

import { images } from "../constants";
// import { CustomButton, Loader } from "../components";
// import { useGlobalContext } from "../context/GlobalProvider";
import CustomButton from '../components/CustomButton';
import CustomButton_2 from '../components/CustomButton_2';

export default function App() {
  return (

    <SafeAreaView className='flex-1' >
      <LinearGradient
        colors={['#0172B2', '#001645']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }} // Inline style for the gradient
      >
        {/* <Loader isLoading={loading} /> */}

        <ScrollView
          contentContainerStyle={{
            height: "100%",
          }}
        >
          <View className='w-full flex justify-around items-center h-full px-4'  >


            <View className='relative mt-20 items-center'  >

              <Image
                source={images.logo}
                className='w-20 h-20'
                resizeMode="contain"
              />
              <Text className='text-5xl text-white font-Cursive1 text-center' >
                ScanHeritage
              </Text>
            </View>

            <Text className='text-xl font-psemibold text-white mt-7 text-center'  >
              Discover the Past, Shape {"\n"}  the Future
            </Text>

            {/* <CustomButton
              title="Continue with Email"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full mt-7"
            /> */}
            <CustomButton_2
              title="Continue with Email"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full mt-7"
            />
          </View>
        </ScrollView>

        <StatusBar backgroundColor="#161622" style="light" />
      </LinearGradient>
    </SafeAreaView>
  );
}
