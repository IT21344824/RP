from datetime import datetime, timedelta
from .. import mongo  # Import mongo from __init__.py
from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app

class User:
    def __init__(self, username, email, password, reset_token=None, reset_token_expiry=None, profile_image=None ,bio=None,address=None,city=None,mobile=None):
        self.username = username
        self.email = email
        self.password = password
        self.reset_token = reset_token
        self.reset_token_expiry = reset_token_expiry
        self.profile_image = profile_image
        self.bio = bio
        self.address = address
        self.city = city
        self.mobile = mobile

    def save(self):
        """ Save or update user information in the MongoDB database """
        try:
            # Use Flask app context explicitly to access mongo.db
            with current_app.app_context():
                user_data = {
                    'username': self.username,
                    'email': self.email,
                    'password': self.password,
                    'reset_token': self.reset_token,
                    'reset_token_expiry': self.reset_token_expiry,
                    'profile_image': self.profile_image,
                    'bio': self.bio,
                    'address': self.address,
                    'city': self.city,
                    'mobile': self.mobile,
                }
                # Upsert (insert or update) the user document based on email
                mongo.db.users.update_one({'email': self.email}, {'$set': user_data}, upsert=True)
        except Exception as e:
            print(f"Error while saving user: {e}")
            raise Exception("An error occurred while saving user data.")

    @classmethod
    def find_by_email(cls, email):
        """ Find a user by email """
        try:
            # Use Flask app context explicitly to access mongo.db
            with current_app.app_context():
                user_data = mongo.db.users.find_one({'email': email})
                if user_data:
                    return cls(
                        username=user_data['username'],
                        email=user_data['email'],
                        password=user_data['password'],
                        reset_token=user_data.get('reset_token'),
                        reset_token_expiry=user_data.get('reset_token_expiry'),
                        profile_image=user_data.get('profile_image'),
                        bio=user_data.get('bio'),
                        address=user_data.get('address'),
                        city=user_data.get('city'),
                        mobile=user_data.get('mobile')
                    )
                return None
        except Exception as e:
            print(f"Error while fetching user by email: {e}")
            raise Exception("An error occurred while fetching user data.")

    @classmethod
    def verify_reset_token(cls, token):
        """Verify the reset token and ensure it's not expired."""
        try:
            # Find user by the reset token
            user_data = mongo.db.users.find_one({'reset_token': token})
            if user_data:
                expiry_time = user_data.get('reset_token_expiry')
                if expiry_time and datetime.now() < expiry_time:
                    return cls(
                        username=user_data['username'],
                        email=user_data['email'],
                        password=user_data['password'],
                        reset_token=user_data['reset_token'],
                        reset_token_expiry=user_data['reset_token_expiry'],
                        profile_image=user_data.get('profile_image'),
                        bio=user_data.get('bio'),
                        address=user_data.get('address'),
                        city=user_data.get('city'),
                        mobile=user_data.get('mobile')
                    )
                else:
                    print(f"Token expired: {expiry_time}")
            return None
        except Exception as e:
            print(f"Error while verifying reset token: {e}")
            return None
