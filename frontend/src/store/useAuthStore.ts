import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, logoutUser, signupUser , forgotPassword ,verifyPin ,setNewPassword , updateProfile , deleteAccount , getUserProfile } from "../api/auth_api"; // Import signup API
import Toast from "react-native-toast-message";
import jwtDecode from "jwt-decode";

// Define Zustand state interface
interface AuthState {
  user: {
    username: string;
    email: string;
    bio?: string;
    address?: string;
    city?: string;
    mobile?: string;
    profile_image?: string | null;
  } | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<boolean>;
  getUserProfile: () => Promise<void>;
  sendPasswordReset: (email: string, onSuccess: () => void) => Promise<void>; // Forgot Password Function
  verifyResetPin: (email: string, pin: string, onSuccess: () => void) => Promise<void>; // Verify PIN Function
  resetPassword: (email: string, password: string, onSuccess: () => void) => Promise<void>; // Set Password Function
  updateUserProfile: (formData: FormData, onSuccess: () => void) => Promise<void>;//update user profile
  deleteUserAccount: (onSuccess: () => void) => Promise<void>; //delete a user account
}

const useAuthStore = create<AuthState>((set) => ({
  user: {
    username: "",
    email: "",
    bio: "",
    address: "",
    city: "",
    mobile: "",
    profile_image: null,
  },
  token: null,
  isLoading: false,

  // Login function
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await loginUser(email, password);
      await AsyncStorage.setItem("token", data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.access_token, isLoading: false });

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome, ${data.user.username}!`,
      });

    } catch (error: any) {
      // Show error toast
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message || "Invalid credentials",
      });
      set({ isLoading: false });
    }
  },

  // Signup function (Newly Added)
  signup: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const data = await signupUser(username, email, password);
      await AsyncStorage.setItem("token", data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.access_token, isLoading: false });

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Signup Successful",
        text2: `Welcome, ${data.user.username}!`,
      });

    } catch (error: any) {
      // Show error toast
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: error.message || "Something went wrong",
      });
      set({ isLoading: false });
    }
  },

  // Get User
  getUserProfile: async () => {
    set({ isLoading: true });
    try {
      const userData = await getUserProfile(); // Call API function
  
      // Format profile image correctly
      const formattedUser = {
        username: userData.username || "",
        email: userData.email || "",
        bio: userData.bio || "",
        address: userData.address || "",
        city: userData.city || "",
        mobile: userData.mobile || "",
        profile_image: Array.isArray(userData.profile_image)
          ? userData.profile_image[0]  // Store first image
          : userData.profile_image || null,
      };
  
      console.log("Loaded User Data:", formattedUser);
  
      // Store in AsyncStorage and Zustand
      await AsyncStorage.setItem("user", JSON.stringify(formattedUser));
      set({ user: formattedUser, isLoading: false });
  
    } catch (error: any) {
      console.error("Error loading user:", error);
      Toast.show({
        type: "error",
        text1: "Profile Fetch Failed",
        text2: "Could not load user profile",
      });
      set({ isLoading: false });
    }
  },
  

  // Forgot Password function
  sendPasswordReset: async (email, onSuccess) => {
    set({ isLoading: true });
    try {
      const data = await forgotPassword(email);
      Toast.show({
        type: "success",
        text1: "Reset PIN Sent",
        text2: data.message,
      });
      onSuccess(); // Navigate to the next step after success
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to Send Reset PIN",
        text2: error.message || "Please try again",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Verify PIN function
  verifyResetPin: async (email, pin, onSuccess) => {
    set({ isLoading: true });
    try {
      const data = await verifyPin(email, pin);
      Toast.show({
        type: "success",
        text1: "PIN Verified",
        text2: data.message,
      });
      onSuccess(); // Navigate to Reset Password screen after success
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Invalid PIN",
        text2: error.message || "Please try again",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Reset Password function
  resetPassword: async (email, password, onSuccess) => {
    set({ isLoading: true });
    try {
      const data = await setNewPassword(email, password);
      Toast.show({
        type: "success",
        text1: "Password Updated",
        text2: data.message,
      });
      onSuccess(); // Navigate to the Login screen after success
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Password Update Failed",
        text2: error.message || "Please try again",
      });
    } finally {
      set({ isLoading: false });
    }
  },


  // Update Profile function
  updateUserProfile: async (formData, onSuccess) => {
    set({ isLoading: true });
    try {
      const response = await updateProfile(formData); // Send API request
      let updatedUser = { ...response.updated_fields };
  
      // Ensure default values
      const formattedUser = {
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        bio: updatedUser.bio || "",
        address: updatedUser.address || "",
        city: updatedUser.city || "",
        mobile: updatedUser.mobile || "",
        profile_image: Array.isArray(updatedUser.profile_image)
          ? updatedUser.profile_image[0] // Store first image
          : updatedUser.profile_image || null,
      };
  
      console.log("Saving Updated User Data:", formattedUser);
  
      // Store in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(formattedUser));
  
      // Update Zustand state
      set({ user: formattedUser, isLoading: false });
  
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your changes have been saved successfully!",
      });
  
      onSuccess();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message || "Please try again",
      });
      set({ isLoading: false });
    }
  },
  
  

  // Delete Account function
  deleteUserAccount: async (onSuccess) => {
    set({ isLoading: true });
    try {
      const response = await deleteAccount();

      //Clear AsyncStorage & Zustand state
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      set({ user: null, token: null, isLoading: false });

      Toast.show({
        type: "success",
        text1: "Account Deleted",
        text2: "Your account has been removed permanently.",
      });

      onSuccess();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: error.message || "Please try again.",
      });
      set({ isLoading: false });
    }
  },

  // Logout function
  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await logoutUser();
    set({ user: null, token: null });

    // Show logout toast
    Toast.show({
      type: "info",
      text1: "Logged Out",
      text2: "You have been logged out successfully",
    });
  },

  
  
  // Load user data from AsyncStorage
  // loadUser: async () => {
  //   try {
  //     const storedToken = await AsyncStorage.getItem("token");
  //     if (!storedToken) {
  //       console.log("No token found, user not logged in.");
  //       return false;
  //     }
  
      // Decode token to check expiration
  //     const decodedToken: any = jwtDecode(storedToken);
  //     const currentTime = Date.now() / 1000; 
  
  //     if (decodedToken.exp < currentTime) {
  //       console.log("Token expired! Logging out user...");
  //       await AsyncStorage.removeItem("token");
  //       await AsyncStorage.removeItem("user");
  //       set({ user: null, token: null });
  //       return false;
  //     }
  
  //     console.log("Fetching latest user data from API...");
      
  //     // Fetch latest user profile
  //     const userData = await getUserProfile();
  
  //     // Ensure default values
  //     const formattedUser = {
  //       username: userData.username || "",
  //       email: userData.email || "",
  //       bio: userData.bio || "",
  //       address: userData.address || "",
  //       city: userData.city || "",
  //       mobile: userData.mobile || "",
  //       profile_image: Array.isArray(userData.profile_image)
          /* ? userData.profile_image[0] */
  //         : userData.profile_image || null,
  //     };
  
  //     console.log("Loaded User Data:", formattedUser);
  
  //     // Store in AsyncStorage
  //     await AsyncStorage.setItem("user", JSON.stringify(formattedUser));
  
  //     // Update Zustand store
  //     set({ user: formattedUser, token: storedToken });
  
  //     return true;
  //   } catch (error: any) {
  //     console.error(" Error loading user:", error);
  //     return false;
  //   }
  // },
  
  loadUser: async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) {
        console.log("No token found, user not logged in.");
        return false;
      }
  
      console.log("Fetching latest user data from API...");
  
      // Fetch latest user profile from the backend
      const userData = await getUserProfile();
  
      // Ensure all fields exist
      const formattedUser = {
        username: userData.username || "",
        email: userData.email || "",
        bio: userData.bio || "",
        address: userData.address || "",
        city: userData.city || "",
        mobile: userData.mobile || "",
        profile_image: Array.isArray(userData.profile_image)
          ? userData.profile_image[0] // Store image
          : userData.profile_image || null,
      };
  
      console.log("Loaded User Data:", formattedUser);
  
      // Store in AsyncStorage and Zustand
      await AsyncStorage.setItem("user", JSON.stringify(formattedUser));
      set({ user: formattedUser, token: storedToken });
  
      return true;
    } catch (error: any) {
      console.error("Error loading user:", error);
      return false;
    }
  },
  

  
  

}));




export default useAuthStore;
