import React, { useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";


// Prevent native splash from auto-hiding
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

export default function LauncherScreen() {
  const router = useRouter();
  const ring1Padding = useSharedValue(0);
  const ring2Padding = useSharedValue(0);

  useEffect(() => {
    ring1Padding.value = 0;
    ring2Padding.value = 0;
    setTimeout(() => { ring1Padding.value = withSpring(ring1Padding.value + hp(5)) }, 100);
    setTimeout(() => { ring2Padding.value = withSpring(ring2Padding.value + hp(5.5)) }, 300);

    // Navigate to home after 5 seconds
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      router.replace("/Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-amber-500">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View className="flex-1 justify-center items-center space-y-10">
        {/* Logo with animated rings */}
        <Animated.View className="bg-white/20 rounded-full" style={{ padding: ring2Padding }}>
          <Animated.View className="bg-white/20 rounded-full" style={{ padding: ring1Padding }}>
            <Image
              source={require("../assets/launcher.png")}
              style={{ width: hp(20), height: hp(20) }}
            />
          </Animated.View>
        </Animated.View>

        {/* App Name */}
        <View className="flex items-center space-y-3">
          <Text className="font-bold text-white tracking-widest text-5xl mt-5">ScanHeritage</Text>
          <ActivityIndicator size="large" color="white" className=" m-6" />
        </View>
      </View>
    </View>
  );
}
