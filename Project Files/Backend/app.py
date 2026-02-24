from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

try:
    model = joblib.load('wind_turbine_model.pkl')
    scaler = joblib.load('scaler.pkl')
    print("Model loaded successfully!")
except:
    print("Model not found. Run train_model.py first.")
    model = None
    scaler = None

@app.route('/')
def home():
    return jsonify({
        "message": "Wind Turbine Energy Prediction API Running"
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not trained yet"}), 500

    data = request.get_json()

    features = np.array([[ 
        float(data['windSpeed']),
        float(data['windDirection']),
        float(data['temperature']),
        float(data['pressure']),
        float(data['humidity'])
    ]])

    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]

    return jsonify({
        "prediction": round(float(prediction), 2),
        "unit": "kW"
    })

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5000)