import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
import cv2 as cv
from werkzeug.utils import secure_filename
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# give your file environment path to here
model_path = "D:/RP model/ML/ML/artifacts/pot.h5"
file_path = "D:/RP model/ML/ML/details.csv"

if not os.path.exists(model_path):
    print(f"Model file not found at {model_path}")
else:
    print(f"Model file found at {model_path}")

# Load the pre-trained model
model_disease = tf.keras.models.load_model(model_path)
model_disease.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=[
        tf.keras.metrics.CategoricalAccuracy(name='accuracy'),
        tf.keras.metrics.Precision(name='precision'),
        tf.keras.metrics.Recall(name='recall'),
        tf.keras.metrics.AUC(name='auc')
    ]
)

# Class dictionary
class_dict = {
    0: 'Clay_Kadai_Pots',
    1: 'Clay_Medium_Pots',
    2: 'Clay_Mini_Pots',
    3: 'Clay_Plates',
    4: 'Clay_Rice_Pots',
    5: 'Clay_Storage_Pots',
    6: 'Clay_Tawa_Plates',
    7: 'Clay_Tea_Plates',
    8: 'Clay_Water_Cups',
    9: 'Clay_Water_Pots',
    10: 'Metal_Cups',
    11: 'Metal_Pots',
    12: 'Metal_Swords',
    13: 'Stone_Moonstone',
    14: 'Stone_Pillars',
    15: 'Stone_Sandalwood_Grinder',
    16: 'Stone_Vessel_Metal_Base',
    17: 'Wood_Carved_Coconut_Shell',
    18: 'Wood_Coconut_Shell',
    19: 'Wood_Cup',
    20: 'Wood_Sandalwood_Cup',
    21: 'Wood_Sandalwood_Jar'
}

# Create Flask app
app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'D:/New folder/ML/ML/uploads/object detaction'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

 
# Inference function
def inference_disease(image_path):
    image = cv.imread(image_path)
    image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
    image = cv.resize(image, (224, 224))
    image = np.expand_dims(image, axis=0)
    image = tf.keras.applications.xception.preprocess_input(image)
    pred = model_disease.predict(image, verbose=0).squeeze()
    label = int(pred.argmax())
    return class_dict[label]


def loadData(val):
    try:
        data = pd.read_csv(file_path)
    except Exception:
        raise ValueError("Invalid file format. Ensure the file is a CSV.")
    
    filtered_data = data[data['Types'] == val]

    print(filtered_data)
    relevant_columns = ['Types','Year/Period', 'Use', 'Cultural Significance']
    filtered_data = filtered_data[relevant_columns]

    # Convert filtered data to a dictionary
    json_data = filtered_data.to_dict(orient='records')

    return json_data

# API route
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    try:
        result = inference_disease(file_path)
        re = loadData(result)
        return jsonify({'prediction': re}), 200
    except Exception as e:
        print(f"Error during inference: {str(e)}")  # Log error in server
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

# Run the app
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

   