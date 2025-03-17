import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'ScanHeritage25')  # Default secret key if not in .env
    MONGO_URI = os.getenv('MONGO_URI')  # MongoDB connection string
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')  # Email username
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')  # Email password
    MAIL_SERVER = 'smtp.gmail.com'  # Gmail's SMTP server
    MAIL_PORT = 587  # Gmail's SMTP port
    MAIL_USE_TLS = True  # Gmail requires TLS
    MAIL_USE_SSL = False  # Don't use SSL
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'CeylonScanHeritage25')  # JWT secret key
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
