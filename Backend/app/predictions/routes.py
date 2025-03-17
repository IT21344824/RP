# predictions/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import numpy as np
from PIL import Image
import cloudinary.uploader
import cloudinary
from datetime import datetime
from .model import model, class_names, class_info_dict
# from .utils import preprocess_image, extract_bounding_boxes
from app import mongo
from collections import Counter
from .utils import preprocess_image, extract_characters , recognize_image



predictions_bp = Blueprint('predictions', __name__)

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)
# MongoDB configuration
def get_mongo_db():
    return mongo.db



@predictions_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    """Handle image prediction requests."""
    current_user_email = get_jwt_identity()
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    file_path = os.path.join('uploads', secure_filename(file.filename))
    file.save(file_path)
    
    # Recognize characters in the image
    predicted_class, bounding_boxes = recognize_image(file_path, model)

    class_info = class_info_dict.get(predicted_class, {"description": "No description", "additional_info": "No info"})
    
    # Upload the image to Cloudinary
    cloudinary_response = cloudinary.uploader.upload(file_path, folder="Brahmi_predictions")
    image_url = cloudinary_response['secure_url']
    
    # Save prediction results to MongoDB
    get_mongo_db().Brahmi_predictions.insert_one({
        'email': current_user_email,
        'predicted_class': predicted_class,
        'image_url': image_url,
        'class_description': class_info['description'],
        'additional_info': class_info['additional_info'],
        'bounding_boxes': bounding_boxes,
        'timestamp': datetime.now()
    })
    
    # Remove the temporary file after processing
    os.remove(file_path)
    
    return jsonify({
        'predicted_class': predicted_class,
        'class_description': class_info['description'],
        'additional_info': class_info['additional_info'],
        'bounding_boxes': bounding_boxes,
        'image_url': image_url
    })
    
    
@predictions_bp.route('/user_brahmi', methods=['GET'])
@jwt_required()
def get_user_predictions():
    """Retrieve all predictions made by the logged-in user."""
    current_user_email = get_jwt_identity()
    
    # Fetch predictions from MongoDB
    predictions = list(get_mongo_db().Brahmi_predictions.find({'email': current_user_email}, {'_id': 0}))
    
    if not predictions:
        return jsonify({'message': 'No predictions found for this user'}), 404
    
    return jsonify({'predictions': predictions}), 200

    
    
    
    
    # Route to predict class of a scanned character
# @predictions_bp.route('/predict', methods=['POST'])
# @jwt_required()
# def predict():
#     current_user_email = get_jwt_identity()

#     if 'file' not in request.files:
#         return jsonify({'error': 'No file uploaded'}), 400

#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'error': 'No file selected'}), 400

#     try:
#         # Save uploaded file temporarily
#         file_path = os.path.join('uploads', secure_filename(file.filename))
#         file.save(file_path)

#         # Process the image
#         image = Image.open(file_path)
#         image = np.array(image)
#         bounding_boxes = extract_bounding_boxes(image)
        
#         class_counts = {}
#         for bbox in bounding_boxes:
#             x, y, w, h = bbox
#             char_image = image[y:y+h, x:x+w]
#             processed_char_image = preprocess_image(char_image)
#             pred_probs = model.predict(processed_char_image, verbose=0).squeeze()
#             label = int(pred_probs.argmax())
#             predicted_class = class_names[label]
#             class_counts[predicted_class] = class_counts.get(predicted_class, 0) + 1
        
#         majority_class = max(class_counts, key=class_counts.get)
#         majority_percentage = class_counts[majority_class] / len(bounding_boxes)
        
#         # Get class info from Excel
#         class_info = class_info_dict.get(majority_class, {"description": "No description", "additional_info": "No info"})

#         # Upload image to Cloudinary
#         cloudinary_response = cloudinary.uploader.upload(file_path, folder="predictions")
#         image_url = cloudinary_response['secure_url']

#         # Save to MongoDB
#         get_mongo_db().predictions.insert_one({

#             'email': current_user_email,
#             'majority_class': majority_class,
#             'majority_percentage': majority_percentage,
#             'image_url': image_url,
#             'class_description': class_info['description'],
#             'additional_info': class_info['additional_info'],
#             'timestamp': datetime.now()
#         })

#         os.remove(file_path)  # Clean up uploaded file

#         return jsonify({
#             'majority_class': majority_class,
#             'majority_percentage': majority_percentage,
#             'class_description': class_info['description'],
#             'additional_info': class_info['additional_info'],
#             'bounding_boxes': bounding_boxes,
#             'image_url': image_url
#         })

#     except Exception as e:
#         print(f"Error during prediction: {e}")
#         return jsonify({'error': 'Prediction failed'}), 500
