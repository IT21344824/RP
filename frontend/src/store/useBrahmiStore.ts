import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

// Define Bounding Box Interface
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}


// Define Prediction History Item Interface
interface PredictionHistory {
    id: string;
    title: string;
    location: string;
    image: string;
  }


// Define Prediction State
interface PredictionState {
  predictedClass: string | null;
  classDescription: string | null;
  additionalInfo: string | null;
  imageUrl: string | null;
  boundingBoxes: BoundingBox[]; // Array of bounding boxes
  selectedImage: string | null; // Image to show in UI
  isLoading: boolean;
  predict: (imageUri: string, onSuccess: (data: any) => void) => Promise<void>;
  setSelectedImage: (imageUri: string) => void;
}

// API Endpoint
const PREDICTION_URL = "http://172.20.10.2:5000/predictions/predict";
const HISTORY_URL = "http://172.20.10.2:5000/predictions/user_brahmi";



const usePredictionStore = create<PredictionState>((set) => ({
  predictedClass: null,
  classDescription: null,
  additionalInfo: null,
  imageUrl: null,
  boundingBoxes: [],
  selectedImage: null,
  isLoading: false,

  // Prediction API Call
  predict: async (imageUri, onSuccess) => {
    set({ isLoading: true });

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      // Send Request to Backend
      const response = await axios.post(PREDICTION_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Destructure API Response Safely
      const {
        predicted_class = "Unknown",
        class_description = "No description available",
        additional_info = "No additional info",
        image_url = null,
        bounding_boxes = [],
      } = response.data || {};

      // Update Zustand Store
      set({
        predictedClass: predicted_class,
        classDescription: class_description,
        additionalInfo: additional_info,
        imageUrl: image_url,
        boundingBoxes: bounding_boxes,
        selectedImage: image_url, // Default to main image
        isLoading: false,
      });

      // Show Success Toast
      Toast.show({
        type: "success",
        text1: "Prediction Successful",
        text2: `Class: ${predicted_class}`,
      });

      // Pass Data to onSuccess Callback
      onSuccess(response.data);
    } catch (error: any) {
      console.error("Prediction API Error:", error);

      // Show Error Toast
      Toast.show({
        type: "error",
        text1: "Prediction Failed",
        text2: error.response?.data?.error || error.message || "Please try again!",
      });

      set({ isLoading: false });
    }
  },

  

  // Function to Change Selected Image
  setSelectedImage: (imageUri) => set({ selectedImage: imageUri }),




  
}));

export default usePredictionStore;



// import { create } from "zustand";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-toast-message";

// // Define Bounding Box Interface
// interface BoundingBox {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// // Define Prediction History Item Interface
// interface PredictionHistory {
//   id: string;
//   title: string;
//   location: string;
//   image: string;
// }

// // Define Prediction State
// interface PredictionState {
//   predictedClass: string | null;
//   classDescription: string | null;
//   additionalInfo: string | null;
//   imageUrl: string | null;
//   boundingBoxes: BoundingBox[];
//   selectedImage: string | null;
//   predictionHistory: PredictionHistory[];
//   isLoading: boolean;
//   predict: (imageUri: string, onSuccess: (data: any) => void) => Promise<void>;
//   fetchPredictionHistory: () => Promise<void>;
//   setSelectedImage: (imageUri: string) => void;
// }

// // API Endpoints
// const PREDICTION_URL = "http://172.20.10.2:5000/predictions/predict";
// const HISTORY_URL = "http://172.20.10.2:5000/predictions/user_brahmi";

// const usePredictionStore = create<PredictionState>((set) => ({
//   predictedClass: null,
//   classDescription: null,
//   additionalInfo: null,
//   imageUrl: null,
//   boundingBoxes: [],
//   selectedImage: null,
//   predictionHistory: [], // Fixed: Added predictionHistory state
//   isLoading: false,

//   // Prediction API Call
//   predict: async (imageUri, onSuccess) => {
//     set({ isLoading: true });

//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication token not found.");
//       }

//       // Prepare FormData
//       const formData = new FormData();
//       formData.append("file", {
//         uri: imageUri,
//         name: "image.jpg",
//         type: "image/jpeg",
//       } as any);

//       // Send Request to Backend
//       const response = await axios.post(PREDICTION_URL, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // Destructure API Response Safely
//       const {
//         predicted_class = "Unknown",
//         class_description = "No description available",
//         additional_info = "No additional info",
//         image_url = null,
//         bounding_boxes = [],
//       } = response.data || {};

//       // Update Zustand Store
//       set({
//         predictedClass: predicted_class,
//         classDescription: class_description,
//         additionalInfo: additional_info,
//         imageUrl: image_url,
//         boundingBoxes: bounding_boxes,
//         selectedImage: image_url,
//         isLoading: false,
//       });

//       // Show Success Toast
//       Toast.show({
//         type: "success",
//         text1: "Prediction Successful",
//         text2: `Class: ${predicted_class}`,
//       });

//       // Pass Data to onSuccess Callback
//       onSuccess(response.data);
//     } catch (error: any) {
//       console.error("Prediction API Error:", error);

//       // Show Error Toast
//       Toast.show({
//         type: "error",
//         text1: "Prediction Failed",
//         text2: error.response?.data?.error || error.message || "Please try again!",
//       });

//       set({ isLoading: false });
//     }
//   },

//   // Function to Fetch User Prediction History
//   fetchPredictionHistory: async () => {
//     set({ isLoading: true });

//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication token not found.");
//       }

//       console.log("Fetching User Predictions...");

//       // API Call
//       const response = await axios.get(HISTORY_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       console.log("Fetched Predictions:", response.data);

//       set({ predictionHistory: response.data.predictions, isLoading: false });
//     } catch (error: any) {
//       console.error("Error fetching predictions:", error.response?.data || error);

//       Toast.show({
//         type: "error",
//         text1: "History Fetch Failed",
//         text2: "Could not load prediction history",
//       });

//       set({ isLoading: false });
//     }
//   },

//   // Function to Change Selected Image
//   setSelectedImage: (imageUri) => set({ selectedImage: imageUri }),
// }));

// export default usePredictionStore;
