
// import React from "react";
// import { View, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
// import { useRouter } from "expo-router";
// import { BellIcon } from "react-native-heroicons/outline";


// interface HeaderProps {
//   username: string;
//   profileImage: any;
// }

// const Header: React.FC<HeaderProps> = ({ username, profileImage }) => {
//   const router = useRouter();

//   return (
// <View
//       className="w-full overflow-hidden shadow-lg "
//       style={{
//         borderBottomLeftRadius: 25,  // Adjust radius as needed
//         borderBottomRightRadius: 25, // Adjust radius as needed
//       }}
//     >
//       <ImageBackground
//         source={require("../assets/head_bg.png")} // Ensure you have this asset
//         className="w-full h-44 p-5"
//         resizeMode="cover"
//         style={{
//           borderBottomLeftRadius: 25,
//           borderBottomRightRadius: 25,
//           overflow: "hidden",
//         }}
//       >
//       <View className="flex-row justify-between items-center mt-12">
//         {/* Profile Section */}
//         <TouchableOpacity onPress={() => router.push("/login")} className="flex-row items-center">
//           <Image
//             source={profileImage}
//             className="w-14 h-14 rounded-full border-2 border-white p-3"
//           />
//           <View className="ml-3">
//             <Text className="text-white font-medium text-lg opacity-80">Welcome!</Text>
//             <Text className="text-white font-bold text-xl">{username}</Text>
//           </View>
//         </TouchableOpacity>

//         {/* Notification Icon */}
//         <TouchableOpacity onPress={() => console.log("Notifications Clicked")}>
//           <View className="relative">
//             <BellIcon size={36} color="white" />
//             <View className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border border-white" />
//           </View>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//     </View>
//   );
// };

// export default Header;


import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, Modal } from "react-native";
import { useRouter } from "expo-router";
import { BellIcon, ExclamationCircleIcon, UserIcon } from "react-native-heroicons/outline";
import useAuthStore from "../store/useAuthStore"; // Import Zustand store

const defaultProfileImage = require("../assets/user.png"); // Default user image

const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    router.replace("/login"); // Redirect to login page after logout
  };

  return (
    <View
      className="w-full overflow-hidden shadow-lg"
      style={{
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
      }}
    >
      <ImageBackground
        source={require("../assets/head_bg.png")}
        className="w-full h-44 p-5"
        resizeMode="cover"
        style={{
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          overflow: "hidden",
        }}
      >
        <View className="flex-row justify-between items-center mt-12 relative">
          {/* Profile Section - Clickable Image */}
          <TouchableOpacity onPress={() => setModalVisible(true)} className="flex-row items-center">
            <Image
              source={user?.profile_image ? { uri: user.profile_image } : defaultProfileImage}
              className=" w-20 h-20 rounded-full border-2 border-white"
            />
            <View className="ml-3">
              <Text className="text-white font-medium text-lg opacity-80">Welcome!</Text>
              <Text className="text-white font-bold text-2xl">{user?.username || "Guest"}</Text>
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

      {/* Logout Modal Positioned Below Profile Image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-transparent"
        >
          <View className="absolute left-5 top-28 bg-white p-4 mt-3 rounded-lg shadow-lg w-48">
            {/* Profile Button */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                router.push("/profile"); // Navigate to profile
              }}
              className="flex-row items-center py-2"
            >
              <UserIcon size={24} color="black" />
              <Text className="ml-3 text-lg font-medium">Profile</Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center py-2 mt-2"
            >
              <ExclamationCircleIcon size={24} color="red" />
              <Text className="ml-3 text-lg font-medium text-red-500">Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Header;






