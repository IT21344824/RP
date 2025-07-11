import os
import time
import logging
import torch
import numpy as np
from flask import Flask, request, jsonify, send_file, send_from_directory
from PIL import Image
import rembg
import pymeshlab as pymesh
from tsr.system import TSR
from tsr.utils import remove_background, resize_foreground
import imageio
import trimesh
from werkzeug.utils import secure_filename

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Flask App
app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = "output"
STATIC_MODEL_PATH = 'output/Clay_Kadai_Pots/Clay_Kadai_Pots.glb'  # Static fallback model path
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load TripoSR Model
device = "cuda:0" if torch.cuda.is_available() else "cpu"
model = TSR.from_pretrained("stabilityai/TripoSR", config_name="config.yaml", weight_name="model.ckpt")
model.to(device)
logging.info("TripoSR Model Loaded.")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    logging.info(f"Received file: {filename}")
    
    return process_image(file_path)

def process_image(file_path):
    start_time = time.time()
    image = Image.open(file_path).convert("RGBA").resize((512, 512))
    
    # Process Image
    rembg_session = rembg.new_session()
    image = remove_background(image, rembg_session)
    image = resize_foreground(image, 0.85)
    image = np.array(image).astype(np.float32) / 255.0
    image = image[:, :, :3] * image[:, :, 3:4] + (1 - image[:, :, 3:4]) * 0.5
    image = Image.fromarray((image * 255.0).astype(np.uint8))
    
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    image_dir = os.path.join(OUTPUT_FOLDER, base_name)
    os.makedirs(image_dir, exist_ok=True)
    image.save(os.path.join(image_dir, "processed.png"))
    
    # Run Model
    with torch.no_grad():
        scene_codes = model([image], device=device)
    
    # Rendering
    render_images = model.render(scene_codes, n_views=30, return_type="pil")
    render_video_path = os.path.join(image_dir, "render.mp4")
    with imageio.get_writer(render_video_path, fps=30, codec="libx264") as writer:
        for frame in render_images[0]:
            writer.append_data(np.array(frame))
    
    # Export Mesh
    meshes = model.extract_mesh(scene_codes, has_vertex_color=False)
    mesh_file = os.path.join(image_dir, "model.obj")
    meshes[0].export(mesh_file)
    
    glb_file = os.path.join(image_dir, "model.glb")
    mesh_trimesh = trimesh.load(mesh_file)
    mesh_trimesh.export(glb_file)
    
    process_time = time.time() - start_time
    logging.info(f"Processing completed in {process_time:.2f} seconds.")
    
    # Return Dynamic .glb Model URL
    model_glb_url = f"/output/{base_name}/model.glb"
    render_video_url = f"/output/{base_name}/render.mp4"
    # mesh_obj_url = f"/output/{base_name}/model.obj"

    return jsonify({
        "status": "success",
        "renderVideo": render_video_url,
        # "mesh_obj": mesh_obj_url,
        "modelGlb": model_glb_url
    })

@app.route('/output/<folder>/<filename>', methods=['GET'])
def download_file(folder, filename):
    file_path = os.path.join(OUTPUT_FOLDER, folder, filename)
    if os.path.exists(file_path):
        return send_from_directory(os.path.join(OUTPUT_FOLDER, folder), filename, mimetype='application/octet-stream')
    return jsonify({"error": "File not found"}), 404

@app.route('/static-model', methods=['GET'])
def static_model():
    if os.path.exists(STATIC_MODEL_PATH):
        return send_from_directory(os.path.dirname(STATIC_MODEL_PATH), os.path.basename(STATIC_MODEL_PATH), mimetype='application/octet-stream')
    return jsonify({"error": "Static model not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
