/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  View,
} from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ArrowIcon from "@/src/assets/icons/ArrowIcon.svg";
import { MotiView } from "moti";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Home = () => {
  const { width } = useWindowDimensions();

  const data = [
    {
      navigate: "/3dModels/3dModel",
      title: "00. Load SandakadaPahana (Stone_Moonstone) 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_Clay_Medium_Pots",
      title: "01. Load ClayMediumPot 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_CKP",
      title: "02. Load ClayKadaiPot",
    },
    {
      navigate: "/3dModels/3dmodel_CMP",
      title: "03. Load ClayMiniPot 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_Cp",
      title: "04. Load ClayPlate 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_CRP",
      title: "05. Load ClayRicePot 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_CSP",
      title: "06. Load ClayStoragePot 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_CTP",
      title: "07. Load ClayTawaPlate 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_Clay_Tea_Plate",
      title: "08. Load ClayTeaPlate 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_CWC",
      title: "09. Load ClayWaterCups 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_Clay_Water_Pots",
      title: "10. Load ClayWaterPot 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_MC",
      title: "11. Load MetalCup 3D Model",
    },
    // {
    //   navigate: "/3dModels/3dmodel_MP",
    //   title: "12. Load MetalPot 3D Model",
    // },
    // {
    //   navigate: "/3dModels/3dmodel_MS",
    //   title: "13. Load MetalSword 3D Model",
    // },
    // {
    //   navigate: "/3dModels/3dmodel_SP",
    //   title: "14. Load StonePillar 3D Model",
    // },
    {
      navigate: "/3dModels/3dmodel_SSG",
      title: "15. Load StoneSandalwoodGrinder 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_SVMB",
      title: "16. Load StoneVesselMetalBase 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_WCCS",
      title: "17. Load WoodCarvedCoconutShell 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_WCS",
      title: "18. Load WoodCoconutShell 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_WC",
      title: "19. Load WoodenCup 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_WSC",
      title: "20. Load WoodenSandalwoodCup 3D Model",
    },
    {
      navigate: "/3dModels/3dmodel_WSJ",
      title: "21. Load WoodSandalwoodJar 3D Model",
    },
  ];



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar animated style="dark" />
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={[styles.cardContainer, { width: width * 0.95 }]}
          >
            <View>
              <Text style={styles.cardText}>3D Models </Text>
            </View>
          </MotiView>

          {data.map((v, i) => (
            <TouchableOpacity
              onPress={() => {
                router.push(v.navigate); // using `push` instead of `navigate` for navigation
              }}
              key={i}
            >
              <MotiView
                style={styles.listContainer}
                from={{ opacity: 0, translateY: 50, scale: 0.5 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ delay: 100 + i * 100 }}
              >
                <Text style={styles.listText}>{v.title}</Text>
                <ArrowIcon width={14} height={14} />
              </MotiView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#000", // Black Background
  },
  cardContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#F59E0B", // Amber 500
    aspectRatio: 16 / 9,
    marginTop: 10,
    borderRadius: 25,
  },

  cardText: {
    color: "black",
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  listContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f2d29b",
  },
  listText: { color: "black", fontFamily: "Inter-Medium" },
});
