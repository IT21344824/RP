from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import User
from .utils import upload_image_to_cloudinary
from .utils import delete_image_from_cloudinary
from .. import mongo  # Import mongo from the app module
import random
import string
from flask_mail import Message
from flask import current_app
from .utils import send_email_via_smtp
from datetime import datetime, timedelta
import logging
import cloudinary.uploader







auth_bp = Blueprint('auth', __name__)


# Store the pin and its expiration time (10 seconds)
def generate_reset_pin():
    pin = ''.join(random.choices(string.digits, k=5))  # Generate a 5-digit pin
    expiration_time = datetime.now() + timedelta(seconds=1000)  # Set expiration time as 1000 seconds from now
    return pin, expiration_time

# Signup Route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.find_by_email(email):
        return jsonify({"message": "Email already exists!"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    new_user.save()

    access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
    # Return user details along with access token
    return jsonify({
        "message": "User created successfully!",
        "access_token": access_token,
        "user": {
            "username": new_user.username,
            "email": new_user.email,
            "profile_image": new_user.profile_image
        }
    }), 201
    
    
# Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.find_by_email(email)
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials!"}), 401
    access_token = create_access_token(identity=email,expires_delta=timedelta(days=1))
    return jsonify({
        "message": "Login successful!",
        "access_token": access_token,
        "user": {
            "username": user.username,
            "email": user.email,
            "profile_image": user.profile_image
        }
    }), 200






# @auth_bp.route('/forgot-password', methods=['POST'])
# def forgot_password():
#     try:
#         data = request.get_json()
#         email = data.get('email')

#         if not email:
#             return jsonify({"message": "Email is required!"}), 400

#         user = User.find_by_email(email)
#         if not user:
#             return jsonify({"message": "Email not found!"}), 404

#         pin, expiration_time = generate_reset_pin()
#         user.reset_token = pin
#         user.reset_token_expiry = expiration_time
#         user.save()

#         # Send reset pin email
#         response = send_email_via_smtp(email, "Password Reset Pin", pin)

#         if "Failed" in response:
#             return jsonify({"message": response}), 500

#         return jsonify({"message": "Password reset pin sent to your email!"}), 200

#     except Exception as e:
#         # Log the error to the console for debugging
#         logging.error(f"Error in forgot_password: {str(e)}")
#         return jsonify({"message": f"Error: {str(e)}"}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    user = User.find_by_email(email)
    if not user:
        return jsonify({"message": "Email not found!"}), 404

    # Generate reset pin and expiration time
    pin, expiration_time = generate_reset_pin()
    user.reset_token = pin
    user.reset_token_expiry = expiration_time
    user.save()

    # Send reset pin email
    response = send_email_via_smtp(
        email,  # To email
        "Password Reset Pin",  # Subject
        pin,  # Pin for the user
        user.username  # Username to be passed for the template
    )

    if "Failed" in response:
        return jsonify({"message": response}), 500

    return jsonify({"message": "Password reset pin sent to your email!"}), 200






@auth_bp.route('/verify-pin', methods=['POST'])
def verify_pin():
    data = request.get_json()
    email = data.get('email')  # Ensure email is provided
    entered_pin = data.get('pin')

    user = User.find_by_email(email)  # Find the user by email
    if not user:
        return jsonify({"message": "Email not found!"}), 404

    # Check if the pin entered by the user matches the pin in the reset_token field
    if user.reset_token != entered_pin:
        return jsonify({"message": "Invalid pin!"}), 400

    # Check if the pin has expired
    if datetime.now() > user.reset_token_expiry:
        return jsonify({"message": "Pin has expired!"}), 400

    return jsonify({"message": "Pin verified successfully!"}), 200






# Set Password Route
@auth_bp.route('/set-password', methods=['POST'])
def set_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    # Check the token and its expiry time
    user = User.verify_reset_token(token)
    if not user:
        return jsonify({"message": "Invalid or expired token!"}), 400

    hashed_password = generate_password_hash(new_password)
    user.password = hashed_password
    user.reset_token = None  # Clear the reset token after successful password change
    user.save()

    return jsonify({"message": "Password updated successfully!"}), 200




@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    """Retrieve logged-in user details"""
    current_user_email = get_jwt_identity()

    # Fetch user from MongoDB
    user = mongo.db.users.find_one({"email": current_user_email}, {"_id": 0})

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Ensure all fields exist to avoid returning 'None' values
    formatted_user = {
        "username": user.get("username", ""),
        "email": user.get("email", ""),
        "bio": user.get("bio", ""),
        "address": user.get("address", ""),
        "city": user.get("city", ""),
        "mobile": user.get("mobile", ""),
        "profile_image": user.get("profile_image", ""),
    }

    return jsonify(formatted_user), 200





# @auth_bp.route('/edit-profile', methods=['PUT'])
# @jwt_required()  # Protect this route with JWT authentication
# def edit_profile():
#     # Get current logged-in user's email from JWT
#     current_user_email = get_jwt_identity()

#     # Get the user object from the database
#     user = User.find_by_email(current_user_email)

#     if not user:
#         return jsonify({"message": "User not found!"}), 404

#     # Get the form data from the request
#     data = request.form  # Form data contains non-file fields (e.g., name, bio, etc.)
#     image_file = request.files.get('profile_image')  # Image file from the form

#     # Initialize a dictionary to store the updated fields
#     updated_fields = {}

#     # Update user profile fields if data is provided
#     if 'username' in data:
#         updated_fields['username'] = data['username']
#     if 'email' in data:
#         updated_fields['email'] = data['email']
#     if 'bio' in data:
#         updated_fields['bio'] = data['bio']
#     if 'address' in data:
#         updated_fields['address'] = data['address']
#     if 'city' in data:
#         updated_fields['city'] = data['city']
#     if 'mobile' in data:
#         updated_fields['mobile'] = data['mobile']

#     # If an image is provided, upload it to Cloudinary
#     if image_file:
#         # Check if profile_image is a list or a string
#         if isinstance(user.profile_image, str):  # If profile_image is a string (URL)
#             print(f"User's current profile image URL: {user.profile_image}")  # Debugging: log the full URL
            
#             # Extract the public ID from the current image URL
#             try:
#                 old_public_id = user.profile_image.split('/')[-1].split('.')[0]
#                 print(f"Extracted public_id for deletion: {old_public_id}")  # Debugging: log the public_id
#             except Exception as e:
#                 print(f"Error extracting public_id from URL: {e}")
#                 return jsonify({"message": "Error extracting old image public_id!"}), 400

#             # If the old image exists, delete it
#             if old_public_id:
#                 print(f"Attempting to delete old image with public_id: {old_public_id}")
#                 if delete_image_from_cloudinary(old_public_id):
#                     print("Old image deleted successfully.")
#                 else:
#                     return jsonify({"message": "Failed to delete old image!"}), 500
#             else:
#                 print("No valid old public_id found for deletion.")
#                 return jsonify({"message": "No old image to delete!"}), 400

#         # If profile_image is a list, handle the first element
#         elif isinstance(user.profile_image, list) and len(user.profile_image) > 0:
#             print(f"User's current profile image URLs: {user.profile_image}")  # Debugging: log the list of URLs
            
#             # Extract the public ID from the first image URL in the list
#             try:
#                 # Correct extraction of public_id: get the part after 'user_images/'
#                 old_public_id = user.profile_image[0].split('user_images/')[1].split('.')[0]
#                 print(f"Extracted public_id for deletion: {old_public_id}")  # Debugging: log the public_id
#             except Exception as e:
#                 print(f"Error extracting public_id from list URL: {e}")
#                 return jsonify({"message": "Error extracting old image public_id from list!"}), 400

#             # If the old image exists, delete it
#             if old_public_id:
#                 full_public_id = f"user_images/{old_public_id}"  # Include the folder path
#                 print(f"Attempting to delete old image with public_id: {full_public_id}")
#                 if delete_image_from_cloudinary(full_public_id):
#                     print("Old image deleted successfully.")
#                 else:
#                     return jsonify({"message": "Failed to delete old image!"}), 500
#             else:
#                 print("No valid old public_id found for deletion.")
#                 return jsonify({"message": "No old image to delete!"}), 400

#         else:
#             print("No profile image found to delete.")
#             return jsonify({"message": "No old image to delete!"}), 400

#         # After deleting the old image, upload the new image
#         if image_file and allowed_file(image_file.filename):  # Ensure it's a valid file type
#             image_url = upload_image_to_cloudinary(image_file, folder_name="user_images")
#             updated_fields['profile_image'] = image_url  # Store the new image URL
#         else:
#             return jsonify({"message": "Invalid file type for profile image!"}), 400

#     # Update the user profile information in the database
#     if updated_fields:
#         mongo.db.users.update_one({'email': current_user_email}, {'$set': updated_fields})

#     return jsonify({"message": "Profile updated successfully!", "updated_fields": updated_fields}), 200

# # Helper function to allow certain file types (like image files)
# def allowed_file(filename):
#     ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@auth_bp.route('/edit-profile', methods=['PUT'])
@jwt_required()  # Protect this route with JWT authentication
def edit_profile():
    # Get current logged-in user's email from JWT
    current_user_email = get_jwt_identity()

    # Get the user object from the database
    user = User.find_by_email(current_user_email)

    if not user:
        return jsonify({"message": "User not found!"}), 404

    # Get the form data from the request
    data = request.form  # Form data contains non-file fields (e.g., name, bio, etc.)
    image_file = request.files.get('profile_image')  # Image file from the form

    # Initialize a dictionary to store the updated fields
    updated_fields = {}

    # Update user profile fields if data is provided
    if 'username' in data:
        updated_fields['username'] = data['username']
    if 'email' in data:
        updated_fields['email'] = data['email']
    if 'bio' in data:
        updated_fields['bio'] = data['bio']
    if 'address' in data:
        updated_fields['address'] = data['address']
    if 'city' in data:
        updated_fields['city'] = data['city']
    if 'mobile' in data:
        updated_fields['mobile'] = data['mobile']

    # Check if the user already has a profile image
    if image_file:
        if isinstance(user.profile_image, str) and user.profile_image:  # If profile_image is a string (URL)
            print(f"User's current profile image URL: {user.profile_image}")  # Debugging: log the full URL
            
            # Extract the public ID from the current image URL
            try:
                # Extract the public ID and include the folder part (user_images/)
                old_public_id = user.profile_image.split('user_images/')[1].split('.')[0]
                full_public_id = f"user_images/{old_public_id}"
                print(f"Extracted public_id for deletion: {full_public_id}")  # Debugging: log the full public_id
            except Exception as e:
                print(f"Error extracting public_id from URL: {e}")
                return jsonify({"message": "Error extracting old image public_id!"}), 400

            # If the old image exists, delete it
            if old_public_id:
                print(f"Attempting to delete old image with public_id: {full_public_id}")
                if delete_image_from_cloudinary(full_public_id):
                    print("Old image deleted successfully.")
                else:
                    return jsonify({"message": "Failed to delete old image!"}), 500
            else:
                print("No valid old public_id found for deletion.")
                return jsonify({"message": "No old image to delete!"}), 400
        elif isinstance(user.profile_image, list) and len(user.profile_image) > 0:  # If profile_image is a list
            print(f"User's current profile image URLs: {user.profile_image}")  # Debugging: log the list of URLs
            
            # Extract the public ID from the first image URL in the list
            try:
                # Correct extraction of public_id: get the part after 'user_images/'
                old_public_id = user.profile_image[0].split('user_images/')[1].split('.')[0]
                full_public_id = f"user_images/{old_public_id}"  # Include the folder path
                print(f"Extracted public_id for deletion: {full_public_id}")  # Debugging: log the full public_id
            except Exception as e:
                print(f"Error extracting public_id from list URL: {e}")
                return jsonify({"message": "Error extracting old image public_id from list!"}), 400

            # If the old image exists, delete it
            if old_public_id:
                print(f"Attempting to delete old image with public_id: {full_public_id}")
                if delete_image_from_cloudinary(full_public_id):
                    print("Old image deleted successfully.")
                else:
                    return jsonify({"message": "Failed to delete old image!"}), 500
            else:
                print("No valid old public_id found for deletion.")
                return jsonify({"message": "No old image to delete!"}), 400

        else:
            print("No existing profile image found to delete.")

        # After deleting the old image (or skipping if no image exists), upload the new image
        if image_file and allowed_file(image_file.filename):  # Ensure it's a valid file type
            image_url = upload_image_to_cloudinary(image_file, folder_name="user_images")
            updated_fields['profile_image'] = image_url  # Store the new image URL
        else:
            return jsonify({"message": "Invalid file type for profile image!"}), 400

    # Update the user profile information in the database
    if updated_fields:
        mongo.db.users.update_one({'email': current_user_email}, {'$set': updated_fields})

    return jsonify({"message": "Profile updated successfully!", "updated_fields": updated_fields}), 200

# Helper function to allow certain file types (like image files)
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS












@auth_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()  # Protect this route with JWT authentication
def delete_account():
    # Get current logged-in user's email from JWT
    current_user_email = get_jwt_identity()

    # Get the user object from the database
    user = User.find_by_email(current_user_email)

    if not user:
        return jsonify({"message": "User not found!"}), 404

    # Check if the user has a profile image to delete from Cloudinary
    if user.profile_image:
        # Check if profile_image is a list (multiple images) or a single image URL
        if isinstance(user.profile_image, list) and len(user.profile_image) > 0:
            # Get the first profile image URL (assuming the first image is the one to delete)
            profile_image_url = user.profile_image[0]
            print(f"User's current profile image URL: {profile_image_url}")  # Debugging: log the full URL

            # Extract the public ID from the first image URL
            try:
                old_public_id = profile_image_url.split('user_images/')[1].split('.')[0]
                full_public_id = f"user_images/{old_public_id}"
                print(f"Extracted public_id for deletion: {full_public_id}")  # Debugging: log the full public_id
            except Exception as e:
                print(f"Error extracting public_id from URL: {e}")
                return jsonify({"message": "Error extracting old image public_id!"}), 400

            # If the old image exists, delete it
            if old_public_id:
                print(f"Attempting to delete old image with public_id: {full_public_id}")
                if delete_image_from_cloudinary(full_public_id):
                    print("Old image deleted successfully.")
                else:
                    return jsonify({"message": "Failed to delete old image from Cloudinary!"}), 500
            else:
                print("No valid old public_id found for deletion.")
                return jsonify({"message": "No old image to delete!"}), 400

        elif isinstance(user.profile_image, str):  # If it's a single image URL (not a list)
            profile_image_url = user.profile_image
            print(f"User's current profile image URL: {profile_image_url}")  # Debugging: log the full URL

            # Extract the public ID from the image URL
            try:
                old_public_id = profile_image_url.split('user_images/')[1].split('.')[0]
                full_public_id = f"user_images/{old_public_id}"
                print(f"Extracted public_id for deletion: {full_public_id}")  # Debugging: log the full public_id
            except Exception as e:
                print(f"Error extracting public_id from URL: {e}")
                return jsonify({"message": "Error extracting old image public_id!"}), 400

            # If the old image exists, delete it
            if old_public_id:
                print(f"Attempting to delete old image with public_id: {full_public_id}")
                if delete_image_from_cloudinary(full_public_id):
                    print("Old image deleted successfully.")
                else:
                    return jsonify({"message": "Failed to delete old image from Cloudinary!"}), 500
            else:
                print("No valid old public_id found for deletion.")
                return jsonify({"message": "No old image to delete!"}), 400
    else:
        print("No profile image found to delete.")

    # Delete the user's account from the database
    try:
        mongo.db.users.delete_one({'email': current_user_email})
        print(f"User account with email {current_user_email} deleted successfully.")
    except Exception as e:
        print(f"Error deleting user account: {e}")
        return jsonify({"message": "Error deleting user account!"}), 500

    return jsonify({"message": "Account deleted successfully!"}), 200











# Fetch All Users Route (Admin Only)
@auth_bp.route('/users', methods=['GET'])
@jwt_required()  # Protect this route with JWT authentication
def get_all_users():
    current_user_email = get_jwt_identity()
    user = User.find_by_email(current_user_email)
    if not user or user.email != 'admin@example.com':  # Simple admin check
        return jsonify({"message": "Unauthorized access!"}), 403

    users = mongo.db.users.find()
    user_list = [{"username": user_data['username'], "email": user_data['email']} for user_data in users]

    return jsonify(user_list), 200



# Test DB Route
@auth_bp.route('/test-db', methods=['GET'])
def test_db():
    try:
        # Debugging: print mongo.db to check if mongo is initialized
        print(f"Mongo DB: {mongo.db}")
        
        # Attempt to access the 'users' collection
        users_count = mongo.db.users.count_documents({})
        return jsonify({"message": "MongoDB connection successful!", "user_count": users_count}), 200
    except Exception as e:
        return jsonify({"message": f"Error connecting to MongoDB: {str(e)}"}), 500


@auth_bp.route('/test-email', methods=['GET'])
def test_email():
    try:
        msg = Message(
            subject="Test Email",
            recipients=["recipient@example.com"],  # Use a real test email here
            body="This is a test email sent from Flask-Mail."
        )
        with current_app.app_context():
            current_app.mail.send(msg)
        return jsonify({"message": "Test email sent successfully!"}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to send email: {str(e)}"}), 500

