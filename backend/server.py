from flask import Flask, jsonify
from flask_cors import CORS
import importlib.util
import sys
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load embersearch.py dynamically from the same directory as server.py
def load_embersearch_script():
    script_path = os.path.join(os.path.dirname(__file__), 'embersearch.py')
    spec = importlib.util.spec_from_file_location("embersearch", script_path)
    embersearch = importlib.util.module_from_spec(spec)
    sys.modules["embersearch"] = embersearch
    spec.loader.exec_module(embersearch)
    return embersearch

@app.route("/")
def index():
    return "Flask server is running. Navigate to /wildfire_risk to see the data."

@app.route('/wildfire_risk', methods=['GET'])
def wildfire_risk():
    try:
        embersearch = load_embersearch_script()
        risk_data = embersearch.get_wildfire_risk_data()  # Call the dynamic Earth Engine logic
        print("Risk Data:", risk_data)  # Debug: print the risk data
        return jsonify(risk_data)
    except Exception as e:
        print(f"Error in Flask route: {e}")
        return jsonify({"error": f"Error fetching data: {str(e)}"}), 500

@app.route('/coordinates', methods=['GET'])
def get_coordinates():
    try:
        embersearch = load_embersearch_script()
        coordinates_data = embersearch.get_coordinates()  # Call the updated function
        print("Coordinates Data:", coordinates_data)  # Debug: print the coordinates
        return jsonify(coordinates_data)
    except Exception as e:
        print(f"Error in Flask route: {e}")
        return jsonify({"error": f"Error fetching data: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)

