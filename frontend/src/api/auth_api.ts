import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";

// Define types for the response
interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    username: string;
    email: string;
    profile_image?: string;
  };
}

// Function to login user
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Login failed. Try again!";
  }
};

// Function to logout user (clear AsyncStorage)
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error("Logout Error:", error);
  }
};


// Define types for signup response
interface SignupResponse {
  message: string;
  access_token: string;
  user: {
    username: string;
    email: string;
    profile_image?: string;
  };
}

// Function to register a new user
export const signupUser = async (username: string, email: string, password: string): Promise<SignupResponse> => {
  try {
    const response = await api.post<SignupResponse>("/signup", { username, email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Signup failed. Try again!";
  }
};

// Function to get user
export const getUserProfile = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No token found!");
    }

    const response = await api.get("/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Fetched User Profile:", response.data); // Debugging

    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error.response?.data || error);
    throw error.response?.data || "Failed to fetch user profile!";
  }
};

// Function to send a password reset request
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to send reset PIN. Try again!";
  }
};

// Function to verify the PIN
export const verifyPin = async (email: string, pin: string): Promise<{ message: string }> => {
  try {
    const response = await api.post("/verify-pin", { email, pin });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to verify PIN. Try again!";
  }
};

// Function to reset password
export const setNewPassword = async (email: string, password: string): Promise<{ message: string }> => {
  try {
    const response = await api.post("/set-password", { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to update password. Try again!";
  }
};


//  Update Profile (With Image Support)
export const updateProfile = async (formData: FormData): Promise<{ message: string; updated_fields: any }> => {
  try {
    const response = await api.put("/edit-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to update profile. Try again!";
  }
};

//  Pick an Image
export const pickProfileImage = async (): Promise<string | null> => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  return result.canceled ? null : result.assets[0].uri;
};

//  delete the user account
export const deleteAccount = async (): Promise<{ message: string }> => {
  try {
    const response = await api.delete("/delete-account"); // Ensure API instance is set up correctly
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to delete account!";
  }
};
