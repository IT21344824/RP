/* eslint-disable react-native/no-inline-styles */
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    ScrollView,
    View,
    Linking,
} from "react-native";
import React from "react";
import {
    GestureHandlerRootView,
    TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ArrowIcon from "@/assets/icons/ArrowIcon.svg";
import { MotiView } from "moti";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Home = () => {
    const { width } = useWindowDimensions();

    const data = [
        {
            navigate: "/3dModels/3dModel",
            title: "01. Load SandakadaPahana 3D Model",
        },
        {
            navigate: "/3dModels/3dModel3",
            title: "02. Load ClayStoragePot 3D Model",
        },
        {
            navigate: "/3dModels/3dModel4",
            title: "03. Load ClayStoragePot_2 3D Model",
        },
        {
            navigate: "/3dModels/3dmodel_CKP",
            title: "04. Load ClayKadaiPot 3D Model",
        },
        {
            navigate: "/3dModels/3dmodel_CMP",
            title: "05. Load ClayMediumPot 3D Model",
        },
        {
            navigate: "/3dModels/3dmodel_Cp",
            title: "06. Load ClayPlate 3D Model",
        },
        {
            navigate: "/3dModels/3dmodel_CRP",
            title: "07. Load ClayRicePot 3D Model",
        },
        {
            navigate: "/3dModels/3dmodel_MC",
            title: "08. Load MetalCup 3D Model",
        },
        {
            navigate: "/3dModels/3dmodel_SVMB",
            title: "09. Load StoneVesselMetalBase 3D Model",
        },
        {
            navigate: "/3dModels/3dmodel_WC",
            title: "10. Load WoodenCup 3D Model",
        },
        {
            navigate: "/3dModels/3dmodel_WSC",
            title: "11. Load WoodenSandalwoodCup 3D Model",
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
                    {data.map((v, i) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    router.navigate(v.navigate);
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
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F6F6F6" },
    cardContainer: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#1C6BC8",
        aspectRatio: 16 / 9,
        marginTop: 10,
        borderRadius: 25,
    },
    cardText: {
        color: "white",
        fontSize: 28,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Inter-Bold",
    },
    cardButton: {
        backgroundColor: "white",
        height: 46,
        borderRadius: 12.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    cardButtonText: {
        color: "black",
        fontSize: 16,
        marginLeft: 10,
        fontFamily: "Inter-Medium",
    },
    listContainer: {
        padding: 20,
        margin: 10,
        borderRadius: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
    },
    listText: { color: "black", fontFamily: "Inter-Medium" },
});
