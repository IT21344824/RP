
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
MODEL_PATH = "architectural_model.h5"
model = load_model(MODEL_PATH)

# Load historical data CSV
HISTORICAL_CSV_PATH = "Dataset/architectural_historical_data.csv"
df_historical = pd.read_csv(HISTORICAL_CSV_PATH)

# Define class names
class_names = df_historical["Class"].tolist()

# Image size
IMG_SIZE = (224, 224)

# Ensure uploads folder exists
UPLOAD_FOLDER = "F:/Research/Feature detect/uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/predict', methods=['POST'])
def predict():
    print("Received request at /predict")
    print("Request files:", request.files)  # Debugging line

    if 'file' not in request.files:
        print("No file found in request")
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    
    if file.filename == '':
        print("Empty file name")
        return jsonify({"error": "No selected file"}), 400

    print("File received:", file.filename)

    try:
        # Save the uploaded file with a proper filename
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        print(f"File saved at {file_path}")

        # Process image
        img = load_img(file_path, target_size=IMG_SIZE)
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        prediction = model.predict(img_array)
        predicted_class_idx = np.argmax(prediction)
        class_name = class_names[predicted_class_idx]
        confidence = float(prediction[0][predicted_class_idx])

        # Retrieve historical data related to the class
        historical_info = df_historical[df_historical["Class"] == class_name].to_dict(orient="records")[0]

        os.remove(file_path)  # Delete file after processing

        # Send the result back as JSON
        return jsonify({
            "prediction": {
                "class_name": class_name,
                "description": historical_info.get("Description", "N/A"),
                "time_period": historical_info.get("Time Period", "N/A"),
                "origin": historical_info.get("Origin", "N/A"),
                "cultural_significance": historical_info.get("Cultural Significance", "N/A"),
                "confidence": confidence
            }
        })

    except Exception as e:
        print("Server error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
