// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "./HomeScreen";
// import CustomTabBar from "../../components/CustomBar";
// import '../../../global.css';

// const Tab = createBottomTabNavigator();

// export default function TabLayout() {
//   return (
//     <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
//       <Tab.Screen name="home" component={HomeScreen} />
//       <Tab.Screen name="search" component={HomeScreen} />
//       <Tab.Screen name="bookmark" component={HomeScreen} />
//       <Tab.Screen name="profile" component={HomeScreen} />
//     </Tab.Navigator>
//   );
// }

import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import CustomTabBar from "../../components/CustomBar";
import '../../../global.css';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          height: 70,
          borderTopWidth: 0,
          borderTopColor: "",
        },
        headerShown: false,
        tabBarActiveTintColor: "#D97706",
        tabBarInactiveTintColor: "#666",
      }}
      tabBar={(props) => <CustomTabBar {...props} />} // Custom Tab Bar
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="bookmark" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}



