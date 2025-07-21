from flask import Blueprint, request, jsonify, send_from_directory
from services.map_service import generate_map_image

map_bp = Blueprint('map', __name__)

@map_bp.route('/')
def index():
    return send_from_directory('../frontend/dist', 'index.html')

@map_bp.route('/generate_map', methods=['POST'])
def generate_map():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    result = generate_map_image(data)
    
    if "error" in result:
        return jsonify(result), 500

    return jsonify(result)
