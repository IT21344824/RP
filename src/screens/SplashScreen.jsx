import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from "expo-router"; // Use router for navigation
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import * as SplashScreen from "expo-splash-screen"; // Ensure splash screen control

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = () => {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5); // Start small

  useEffect(() => {
    console.log("Splash Screen Loaded");

    // Start animation
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withTiming(1, { duration: 1000 });

    // Navigate to Home screen after 2 seconds
    setTimeout(async () => {
      await SplashScreen.hideAsync(); // Hide native splash
      router.replace("/home"); // Use router for navigation
    }, 2000);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <View style={styles.outerCircle}>
          <Animated.View style={animatedStyle}>
            <View style={styles.middleCircle}>
              <View style={styles.innerCircle}>
                <Image
                  source={require("../assets/launcher.png")} // Ensure image exists
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* App Name */}
      <Text style={styles.appName}>ScanHeritage</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c9731b",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  outerCircle: {
    width: 208, // 52 * 4
    height: 208,
    backgroundColor: "white",
    borderRadius: 104,
    alignItems: "center",
    justifyContent: "center",
  },
  middleCircle: {
    width: 176, // 44 * 4
    height: 176,
    backgroundColor: "yellow",
    borderRadius: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 144, // 36 * 4
    height: 144,
    backgroundColor: "white",
    borderRadius: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 128, // 32 * 4
    height: 128,
  },
  appName: {
    marginTop: 20,
    color: "black",
    fontWeight: "bold",
    fontSize: 24,
    fontStyle: "italic",
  },
});

export default SplashScreenComponent;
