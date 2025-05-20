// import { StackNavigator } from "@/layouts/StackNavigator";
import { TransitionPresets } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen, Stack } from "expo-router";

export default function ModelRootLayout() {


  return (


    <Stack>

      <Stack.Screen name="index" />
      <Stack.Screen name="3dModel/index" />
      <Stack.Screen name="3dModel2/index" />
      <Stack.Screen name="3dmodel_CWP/index" />


      <Stack.Screen name="3dmodel_CKP/index" />
      <Stack.Screen name="3dmodel_Clay_Medium_Pots/index" />
      <Stack.Screen name="3dmodel_Clay_Water_Pots/index" />
      <Stack.Screen name="3dmodel_CMP/index" />
      <Stack.Screen name="3dmodel_Cp/index" />
      <Stack.Screen name="3dmodel_CRP/index" />
      <Stack.Screen name="3dmodel_CSP/index" />
      <Stack.Screen name="3dmodel_CTP/index" />
      <Stack.Screen name="3dmodel_CWC/index" />
      <Stack.Screen name="3dmodel_Clay_Tea_Plate/index" />
      <Stack.Screen name="3dmodel_MC/index" />
      <Stack.Screen name="3dmodel_SSG/index" />
      <Stack.Screen name="3dmodel_SVMB/index" />
      <Stack.Screen name="3dmodel_WC/index" />
      <Stack.Screen name="3dmodel_WCCS/index" />
      <Stack.Screen name="3dmodel_WCS/index" />
      <Stack.Screen name="3dmodel_WSC/index" />
      <Stack.Screen name="3dmodel_WSJ/index" />


    </Stack>
  );
}
