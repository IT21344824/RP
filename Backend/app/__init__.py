from flask import Flask
from flask_pymongo import PyMongo
from flask_mail import Mail
from flask_jwt_extended import JWTManager
import cloudinary
import cloudinary.uploader
import cloudinary.api
from .config import Config
from flask_cors import CORS



# Initialize extensions
mongo = PyMongo()
mail = Mail()
jwt = JWTManager()

# Cloudinary configuration
cloudinary.config(
    cloud_name=Config.CLOUDINARY_CLOUD_NAME,
    api_key=Config.CLOUDINARY_API_KEY,
    api_secret=Config.CLOUDINARY_API_SECRET
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize the MongoDB connection
    mongo.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    
    # Enable CORS
    CORS(app)

    # Register Blueprints (routes)
    from .auth.routes import auth_bp
    from .predictions.routes import predictions_bp
    
    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(predictions_bp, url_prefix='/predictions')

    return app
