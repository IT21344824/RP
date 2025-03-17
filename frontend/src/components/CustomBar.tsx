// import React, { Component } from "react";
// import { View, TouchableOpacity, Text } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   HomeIcon,
//   StarIcon,
//   BookmarkIcon,
//   UserIcon,
// } from "react-native-heroicons/outline";
// import { BottomTabBarProps } from "@react-navigation/bottom-tabs";


// const tabs = [
//   { name: "home", icon: HomeIcon},
//   { name: "search", icon: StarIcon },
//   { name: "bookmark", icon: BookmarkIcon },
//   { name: "profile", icon: UserIcon },
// ];

// const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
//   const router = useRouter();

//   return (
//     <View
//       className="absolute bottom-6 left-5 right-5 flex-row justify-around items-center bg-white h-auto pt-1  border border-gray-200 rounded-full shadow-lg"
//       style={{
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 8, // For Android shadow
//       }}
//     >
//       {tabs.map((tab, index) => {
//         const isFocused = state.index === index;
//         const Icon = tab.icon;

//         return (
//           <TouchableOpacity
//             key={tab.name}
//             className="flex items-center justify-center w-1/4"
//             onPress={() => router.push(`/${tab.name}` as any )}

//           >
//             <View
//               className={`p-3 rounded-full ${
//                 isFocused ? "bg-amber-500" : "bg-transparent"
//               }`}
//             >
//               <Icon size={26} color={isFocused ? "#000" : "#666"} />
//             </View>
//             <Text
//               className={`${
//                 isFocused ? "font-bold" : "font-normal"
//               } text-xs text-center`}
//               style={{ color: isFocused ? "#000" : "#666" }}
//             >
//               {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// export default CustomTabBar;


import React from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { useRouter } from "expo-router";
import {
  HomeIcon,
  StarIcon,
  BookmarkIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  { name: "home", icon: HomeIcon },
  { name: "search", icon: StarIcon },
  { name: "bookmark", icon: BookmarkIcon },
  { name: "profile", icon: UserIcon },
];

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Get safe area insets for iOS bottom space

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-gray-300 shadow-lg"
      style={{
        paddingBottom: Platform.OS === "ios" ? insets.bottom : 10, // Add safe area padding for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8, // Android shadow
        paddingTop: 10,
      }}
    >
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            className="flex items-center justify-center w-1/4 "
            onPress={() => router.push(`/${tab.name}` as any)}
          >
            <Icon size={28} color={isFocused ? "#FFA500" : "#888"} />
            <Text
              className={`text-xs ${
                isFocused ? "font-bold text-amber-500" : "text-gray-500"
              }`}
            >
              {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
