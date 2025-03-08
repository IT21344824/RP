// // import React from "react";
// // import { View, Text, Image, TouchableOpacity } from "react-native";
// // import { useRouter } from "expo-router";
// // import { BellIcon } from "react-native-heroicons/outline";

// // interface HeaderProps {
// //   username: string;
// //   profileImage: any;
// // }

// // const Header: React.FC<HeaderProps> = ({ username, profileImage }) => {
// //   const router = useRouter();

// //   return (
// //     <View className="bg-[#8B5E3C] rounded-2xl p-4 flex-row justify-between items-center shadow-md">
// //       {/* Profile Section */}
// //       <TouchableOpacity onPress={() => router.push("/login")} className="flex-row items-center">
// //         <Image source={profileImage} className="w-12 h-12 rounded-full mr-3" />
// //         <View>
// //           <Text className="text-white text-xs">Welcome !</Text>
// //           <Text className="text-white font-bold text-lg">{username}</Text>
// //         </View>
// //       </TouchableOpacity>

// //       {/* Notification Icon */}
// //       <TouchableOpacity onPress={() => console.log("Notifications Clicked")}>
// //         <View className="relative">
// //           <BellIcon size={28} color="white" />
// //           <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
// //         </View>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default Header;





import React from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { BellIcon } from "react-native-heroicons/outline";

interface HeaderProps {
  username: string;
  profileImage: any;
}

const Header: React.FC<HeaderProps> = ({ username, profileImage }) => {
  const router = useRouter();

  return (
<View
      className="w-full overflow-hidden shadow-lg"
      style={{
        borderBottomLeftRadius: 25,  // Adjust radius as needed
        borderBottomRightRadius: 25, // Adjust radius as needed
      }}
    >
      <ImageBackground
        source={require("../assets/head_bg.png")} // Ensure you have this asset
        className="w-full h-36 p-5"
        resizeMode="cover"
        style={{
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          overflow: "hidden",
        }}
      >
      <View className="flex-row justify-between items-center mt-5">
        {/* Profile Section */}
        <TouchableOpacity onPress={() => router.push("/login")} className="flex-row items-center">
          <Image
            source={profileImage}
            className="w-14 h-14 rounded-full border-2 border-white"
          />
          <View className="ml-3">
            <Text className="text-white font-medium text-lg opacity-80">Welcome!</Text>
            <Text className="text-white font-bold text-xl">{username}</Text>
          </View>
        </TouchableOpacity>

        {/* Notification Icon */}
        <TouchableOpacity onPress={() => console.log("Notifications Clicked")}>
          <View className="relative">
            <BellIcon size={36} color="white" />
            <View className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border border-white" />
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    </View>
  );
};

export default Header;

// // import React from "react";
// // import { View, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
// // import { useRouter } from "expo-router";
// // import { BellIcon } from "react-native-heroicons/outline";

// // interface HeaderProps {
// //   username: string;
// //   profileImage: any;
// // }

// // const Header: React.FC<HeaderProps> = ({ username, profileImage }) => {
// //   const router = useRouter();

// //   return (
// //     <ImageBackground
// //       source={require("../assets/head_bg.png")}
// //       className="w-full h-36 p-5 rounded-b-3xl shadow-lg"
// //       resizeMode="cover"
// //       style={{ overflow: "hidden", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
// //     >
// //       <View className="flex-row justify-between items-center">
// //         {/* Profile Section */}
// //         <TouchableOpacity onPress={() => router.push("/")} className="flex-row items-center">
// //           <Image source={profileImage} className="w-14 h-14 rounded-full border-2 border-white" />
// //           <View className="ml-3">
// //             <Text className="text-white text-sm opacity-80">Welcome!</Text>
// //             <Text className="text-white font-bold text-lg">{username}</Text>
// //           </View>
// //         </TouchableOpacity>

// //         {/* Notification Icon */}
// //         <TouchableOpacity onPress={() => console.log("Notifications Clicked")}>
// //           <BellIcon size={26} color="white" />
// //         </TouchableOpacity>
// //       </View>
// //     </ImageBackground>
// //   );
// // };

// // export default Header;
