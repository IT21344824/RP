

# def preprocess_image(image):
#     """Preprocess an image for model prediction."""
#     if len(image.shape) == 2:
#         image = cv.cvtColor(image, cv.COLOR_GRAY2RGB)
#     image = cv.resize(image, (224, 224))
#     image = tf.keras.applications.xception.preprocess_input(image)
#     return np.expand_dims(image, axis=0)

# def extract_bounding_boxes(image):
#     """Extract bounding boxes and sort them left to right."""
#     image_gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
#     _, thresh = cv.threshold(image_gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU)
#     contours, _ = cv.findContours(thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
#     contours = sorted(contours, key=lambda ctr: cv.boundingRect(ctr)[0])
#     bboxes = [cv.boundingRect(contour) for contour in contours]
#     return bboxes

import cv2 as cv
import numpy as np
from collections import Counter
import matplotlib.pyplot as plt
import tensorflow as tf
from .model import class_names, model

def preprocess_image(image):
    """Preprocess an image for model prediction."""
    if len(image.shape) == 2:
        image = cv.cvtColor(image, cv.COLOR_GRAY2RGB)
    image = cv.resize(image, (224, 224))
    image = tf.keras.applications.xception.preprocess_input(image)
    return np.expand_dims(image, axis=0)

def extract_characters(image_path):
    """Extract individual characters and their bounding boxes from an image."""
    image = cv.imread(image_path, cv.IMREAD_GRAYSCALE)
    _, thresh = cv.threshold(image, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU)
    kernel = np.ones((5, 5), np.uint8)
    dilated = cv.dilate(thresh, kernel, iterations=2)
    contours, _ = cv.findContours(dilated, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=lambda ctr: cv.boundingRect(ctr)[0])
    char_images, bboxes = [], []
    for contour in contours:
        x, y, w, h = cv.boundingRect(contour)
        char_images.append(image[y:y+h, x:x+w])
        bboxes.append((x, y, w, h))
    return char_images, bboxes

def is_word_image(image_path):
    """Determine if the image contains multiple characters (word) or a single character."""
    image = cv.imread(image_path, cv.IMREAD_GRAYSCALE)
    _, thresh = cv.threshold(image, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU)
    contours, _ = cv.findContours(thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    return len(contours) > 1

# def recognize_image(image_path, model):
#     """Recognize and classify characters in an image using the trained model."""
#     image = cv.imread(image_path)
#     if is_word_image(image_path):
#         char_images, bboxes = extract_characters(image_path)
#         predicted_classes = []
#         for char_image in char_images:
#             processed_image = preprocess_image(char_image)
#             pred_probs = model.predict(processed_image, verbose=0).squeeze()
#             label = int(pred_probs.argmax())
#             predicted_classes.append(class_names[label])
#         most_common_class = Counter(predicted_classes).most_common(1)[0][0]
#     else:
#         processed_image = preprocess_image(image)
#         pred_probs = model.predict(processed_image, verbose=0).squeeze()
#         label = int(pred_probs.argmax())
#         most_common_class = class_names[label]
#     return most_common_class

def recognize_image(image_path, model):
    """Recognize and classify characters in an image using the trained model."""
    image = cv.imread(image_path)

    if is_word_image(image_path):
        char_images, bboxes = extract_characters(image_path)
        predicted_classes = []

        for char_image in char_images:
            processed_image = preprocess_image(char_image)
            pred_probs = model.predict(processed_image, verbose=0).squeeze()
            label = int(pred_probs.argmax())
            predicted_classes.append(class_names[label])

        most_common_class = Counter(predicted_classes).most_common(1)[0][0]
    else:
        processed_image = preprocess_image(image)
        pred_probs = model.predict(processed_image, verbose=0).squeeze()
        label = int(pred_probs.argmax())
        most_common_class = class_names[label]
        
        # If single character, return an empty list for bounding boxes
        bboxes = [(0, 0, image.shape[1], image.shape[0])]  # Full image as bounding box

    return most_common_class, bboxes