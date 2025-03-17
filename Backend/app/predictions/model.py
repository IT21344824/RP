import os
import tensorflow as tf
import pandas as pd

# Define paths
MODEL_PATH = "app/predictions/Dataset/model.h5"
EXCEL_PATH = "app/predictions/Dataset/class_info.xlsx"  # Changed to .xlsx

# Load model
if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
else:
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

# Load class info from Excel
if os.path.exists(EXCEL_PATH):
    class_info_df = pd.read_excel(EXCEL_PATH, engine='openpyxl')  # Read Excel file
    
    # Ensure column names are formatted correctly
    class_info_df.columns = class_info_df.columns.str.strip()
    
    # Strip spaces from class names for correct matching
    class_info_df['class_name'] = class_info_df['class_name'].str.strip()
    
    # Check if 'class_name' exists
    if 'class_name' not in class_info_df.columns:
        raise KeyError(f"Expected 'class_name' column not found. Found columns: {class_info_df.columns.tolist()}")
    
    # Convert to dictionary
    class_info_dict = class_info_df.set_index('class_name')[['description', 'additional_info']].to_dict(orient="index")
else:
    raise FileNotFoundError(f"Excel file not found at {EXCEL_PATH}")

# Class mapping
class_indices = {
    'early_brahmi': 0,
    'later_brahmi': 1,
    'transitional_brahmi': 2,
    'medieval_sinhala': 3,
    'modern_sinhala': 4
}
class_names = list(class_indices.keys())