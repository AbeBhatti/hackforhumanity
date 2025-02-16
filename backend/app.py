from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow all origins, you can restrict it to certain origins if needed

def fetch_coordinates_with_risk():
    return [
        {"coordinates": [-121.50751051615619, 48.99944578960554], "risk": 0.8},
        {"coordinates": [-121.53751050305566, 48.999445114780904], "risk": 0.7},
        {"coordinates": [-121.56751049463797, 48.999444527559305], "risk": 0.9},
        # More coordinates would go here...
    ]

@app.route('/coordinates', methods=['GET'])
def get_coordinates():
    coordinates_with_risk = fetch_coordinates_with_risk()
    print(coordinates_with_risk)  # Add this to see the data in the Flask console
    return jsonify(coordinates_with_risk)

if __name__ == '__main__':
    app.run(debug=True)
