import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Set Predictions API base URL
const PREDICTIONS_API_URL = "http://172.20.10.2:5000/predictions";
const HISTORY_URL = "/predictions/user_brahmi";

// Create an Axios instance
const predictionsApi = axios.create({
  baseURL: PREDICTIONS_API_URL,
  headers: { "Content-Type": "multipart/form-data" },
});

// Automatically attach JWT token to every request
predictionsApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to upload image & predict class
export const predictImage = async (imageUri: string) => {
  const formData = new FormData();
  const fileType = imageUri.split(".").pop();

  formData.append("file", {
    uri: imageUri,
    name: `prediction.${fileType}`,
    type: `image/${fileType}`,
  } as any);

  try {
    const response = await predictionsApi.post("/predict", formData);
    return response.data; // Response contains predicted class & details
  } catch (error: any) {
    throw error.response?.data || "Prediction failed!";
  }
};

export default predictionsApi;
