
// import LauncherScreen from '../screens/launcherScreen';
// import { Link } from 'expo-router';
// import { StatusBar } from "expo-status-bar";
// import { Redirect, router } from "expo-router";
// import { View, Text, Image, ScrollView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from 'expo-linear-gradient';

// import { images } from "../constants";
// // import { CustomButton, Loader } from "../components";
// // import { useGlobalContext } from "../context/GlobalProvider";
// import CustomButton from '../components/CustomButton';
// import CustomButton_2 from '../components/CustomButton_2';
// import "../../global.css";

// export default function index() {
//     return <LauncherScreen />;
// }


import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import useAuthStore from "../store/useAuthStore";
import LauncherScreen from "../screens/launcherScreen";

export default function Index() {
  const router = useRouter();
  const { loadUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // ⏳ Show LauncherScreen for 3 sec

      const isLoggedIn = await loadUser(); // Check if user exists in storage

      if (isLoggedIn) {
        router.replace("/home"); // ✅ Navigate to home if logged in
      } else {
        router.replace("/welcome"); // ✅ Navigate to welcome/login screen
      }

      setIsChecking(false);
    };

    checkUser();
  }, []);

  if (isChecking) {
    return (
      <View className="flex-1">
        <LauncherScreen />  
        {/*  Activity Indicator while checking auth */}
        <ActivityIndicator size="large" color="#ff9800" style={{ position: "absolute", bottom: 50 }} />
      </View>
    );
  }

  return null;
}


