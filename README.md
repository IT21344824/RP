# MOBILE APPLICATION TO SCAN AND EXTRACT HISTORICALLY AND ARCHITECTURALLY ACCURATE DATA OF AN ARCHAEOLOGICAL OBJECT

# Research Group - 24_25J_092

#Preserving the past with the power of AI, deep learning, and 3D reconstruction. Empowering users to explore Sri Lanka’s archaeological heritage through a smart mobile application.

![iPhone 16 Pro](https://github.com/user-attachments/assets/67b886ce-4c88-4d19-896c-8a3fc98d7b65)

# Introduction
Archaeological documentation is often labor-intensive, expert-driven, and inaccessible to the public. In this project, we present a comprehensive mobile solution that leverages artificial intelligence, deep learning, and computer vision to identify, interpret, and digitally reconstruct Sri Lanka’s historical artifacts and inscriptions. By combining OCR, object detection, 3D modeling, and architectural analysis, this research introduces a powerful platform for cultural heritage preservation, education, and tourism.

# Overview
The project involves developing a mobile application to scan and extract historically and architecturally accurate data of archaeological objects. This innovative tool addresses key challenges in archaeology, such as object recognition, historical data retrieval, architectural feature detection, and creating 3D models from 2D images. It uses advanced image processing, machine learning, and 3D reconstruction to enhance the study and preservation of cultural heritage.

# Research Components

# Component 1  
**Component Name:** 3D Prompt Generation from 2D Archaeological Images  
- Generates `.glb` models using CGAN-based 3D reconstruction.
- Enables zoom, rotate, and interactive exploration in real-time.

**Key Features:**  
- TripoSR (CGAN) for 3D model generation.  
- Preprocessing using rembg and OpenCV for feature clarity.  
- Mobile frontend with @react-three/fiber for dynamic rendering.  
- Compatible with AR/VR extensions.

**Technologies Used:**  
- CGAN, Flask, Cloudinary, React Native  
- @react-three/fiber/native, rembg  

**Model Name:** 3D Artifact Generator  


 
---

# Component 2  

**Component Name:** Historical Object Detection and Metadata Retrieval  
- Classifies Polonnaruwa-era artifacts into 22 unique classes.
- Displays detailed historical usage and cultural significance.

**Key Features:**  
- Custom CNN model trained on domain-specific artifact images.  
- Uses TensorFlow backend and CSV-based metadata repository.  
- Real-time object recognition via mobile image capture or upload.

**Technologies Used:**  
- TensorFlow, OpenCV, Flask, React Native  
- CSV for metadata, RESTful API  

**Model Name:** Historical Object Detection Model  



---

# Component 3  
**Component Diagram:** 

![brahmi](https://github.com/user-attachments/assets/a0bb4af8-5984-4d99-8022-74ca2435f473)

**Component Name:** Brahmi Script OCR and Historical Data Retrieval  
- Recognizes five evolutionary stages of Brahmi script.
- Translates characters to modern Sinhala using dictionary mapping.
- Retrieves contextual metadata (ruler, region, time period).

**Key Features:**  
- Exception CNN architecture with over 89% validation accuracy.  
- Integration with Flask API and MongoDB for real-time metadata access.  
- Cloudinary-enabled scalable image handling.  
- Mobile app interface for instant prediction and history tracking.
- translate to the Prediction data into Sinhala 

**Technologies Used:**  
- TensorFlow/Keras, Flask, Cloudinary, MongoDB, React Native , Azure translation
- OCR, JSON mapping, REST API  

**Model Name:**  Brahmi script Ocr and Data Retrieval  


---

# Component 4  
**Component Name:** Architectural Feature Detection and Metadata Retrieval  
- Detects columns, domes, carvings, and stylistic features of ancient sites.
- Provides historical and stylistic metadata based on classification.

**Key Features:**  
- CNN (MobileNetV2) fine-tuned on 16 architectural classes.  
- Noise-resistant preprocessing and field-ready mobile design.  
- Metadata integration and query history for offline reference.

**Technologies Used:**  
- TensorFlow (MobileNetV2), Flask, React Native, MongoDB  
- Data augmentation and REST API communication  

**Model Name:** Architectural Feature Classifier  


---

# System Architecture Diagram

![system diagram](https://github.com/user-attachments/assets/b4e5edef-2e0b-48ec-8018-a498647415b9)


---

## dependencies

### Python Libraries
- Data Processing: numpy, pandas
- Deep Learning: tensorflow, keras
- Image Processing: cv2 (OpenCV library), PIL (Pillow library)
- Visualization: matplotlib, seaborn
- Metrics and Evaluation: sklearn
- 3D Model Handling: Trimesh, PyGLTFLib

### React Native Dependencies
- Three.js
- React Three Fiber
- React-native
- Reanimated
- Nativewind

---

# Contributors

| Role            | Name                      | Index Number |
|-----------------|---------------------------|--------------|
| 3D Generation   |  Ekanayake T.E.M.A.P.     | IT21344824   |
| Object Detection| Jayawardhana J.R.K.B.     | IT21352294   |
| Brahmi OCR      | Ekanayake T.E.M.A.P.      | IT21344824   |
| Architectural   | Ediriwickrama E.A.K.V.    | IT21273094   |

---

# Contact Us

- Ekanayake T.E.M.A.P. – `it21344824@my.sliit.lk`  
- Jayawardhana J.R.K.B. – `it21352294@my.sliit.lk`
- Serasinghe G.P.G.Y – `it21360978@my.sliit.lk`  
- Ediriwickrama E.A.K.V. – `it21273094@my.sliit.lk`

---

> _“Preserving Sri Lanka’s ancient legacy—one scan at a time.”_















<!--

##  contributors

- IT21344824 - T.E.M.A.P. Ekanayake
- IT21352294 - J.R.K.B. Jayawardhana
- IT21273094 - E.A.K.V. Ediriwickrama 
- IT21360978 - G.P.G.Y. Serasinghe


##  overview of the project

The project involves developing a mobile application to scan and extract historically and architecturally accurate data of archaeological objects. This innovative tool addresses key challenges in archaeology, such as object recognition, historical data retrieval, architectural feature detection, and creating 3D models from 2D images. It uses advanced image processing, machine learning, and 3D reconstruction to enhance the study and preservation of cultural heritage.


##  architectural diagram
![diagram-export-12-7-2024-8_39_38-PM](https://github.com/user-attachments/assets/fef6618b-31b0-4abb-86ec-8a420cfd24fe)


## dependencies

### Python Libraries
- Data Processing: numpy, pandas
- Deep Learning: tensorflow, keras
- Image Processing: cv2 (OpenCV library), PIL (Pillow library)
- Visualization: matplotlib, seaborn
- Metrics and Evaluation: sklearn
- 3D Model Handling: Trimesh, PyGLTFLib

### React Native Dependencies
- Three.js
- React Three Fiber
- react-native  -->
