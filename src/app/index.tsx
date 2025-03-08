
import LauncherScreen from '../screens/launcherScreen';
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
import "../../global.css";

export default function index() {
    return (

        <SafeAreaView className='flex-1' >

            <LauncherScreen />
        </SafeAreaView>

    );
}



