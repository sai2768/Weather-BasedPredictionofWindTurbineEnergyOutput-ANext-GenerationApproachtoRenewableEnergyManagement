# Python Flask Backend Code

This file contains all the Python code you need to create for the backend ML model and Flask server.

## Project Structure

Create a folder called `backend` with the following files:

```
backend/
├── app.py                          # Flask server
├── train_model.py                  # Model training script
├── requirements.txt                # Python dependencies
└── wind_turbine_data.csv          # Your dataset
```

## 1. requirements.txt

Create this file with the following dependencies:

```
flask==3.0.0
flask-cors==4.0.0
pandas==2.1.0
numpy==1.24.3
scikit-learn==1.3.0
joblib==1.3.2
```

## 2. train_model.py

This script trains the Random Forest model and saves it:

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import os

def train_model():
    print("Loading dataset...")

    # Load your dataset
    # If you don't have a dataset, create sample data
    if not os.path.exists('wind_turbine_data.csv'):
        print("Creating sample dataset...")
        np.random.seed(42)
        n_samples = 1000

        wind_speed = np.random.uniform(0, 25, n_samples)
        wind_direction = np.random.uniform(0, 360, n_samples)
        temperature = np.random.uniform(-10, 35, n_samples)
        pressure = np.random.uniform(980, 1040, n_samples)
        humidity = np.random.uniform(20, 100, n_samples)

        # Power output formula (simplified model)
        power = (0.5 * 1.225 * np.pi * (50**2) * (wind_speed**3) / 1000) * \
                (1 - 0.001 * np.abs(temperature - 15)) * \
                (0.8 + 0.2 * np.random.random(n_samples))
        power = np.clip(power, 0, 2500)

        df = pd.DataFrame({
            'wind_speed': wind_speed,
            'wind_direction': wind_direction,
            'temperature': temperature,
            'pressure': pressure,
            'humidity': humidity,
            'power_output': power
        })

        df.to_csv('wind_turbine_data.csv', index=False)
        print("Sample dataset created!")

    df = pd.read_csv('wind_turbine_data.csv')
    print(f"Dataset loaded with {len(df)} records")

    # Check for missing values
    print("\nChecking for missing values...")
    print(df.isnull().sum())

    # Fill missing values if any
    df = df.fillna(df.mean())

    # Separate features and target
    X = df[['wind_speed', 'wind_direction', 'temperature', 'pressure', 'humidity']]
    y = df['power_output']

    print("\nFeature columns:", X.columns.tolist())
    print("Target column: power_output")

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"\nTraining set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")

    # Feature scaling
    print("\nScaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train Random Forest model
    print("\nTraining Random Forest Regressor...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train_scaled, y_train)
    print("Model training completed!")

    # Evaluate the model
    print("\nEvaluating model...")
    y_pred = model.predict(X_test_scaled)

    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print(f"\nModel Performance:")
    print(f"R² Score: {r2:.4f}")
    print(f"Mean Absolute Error: {mae:.2f} kW")
    print(f"Root Mean Squared Error: {rmse:.2f} kW")

    # Feature importance
    print("\nFeature Importance:")
    for feature, importance in zip(X.columns, model.feature_importances_):
        print(f"{feature}: {importance:.4f}")

    # Save the model and scaler
    print("\nSaving model and scaler...")
    joblib.dump(model, 'wind_turbine_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    print("Model saved as 'wind_turbine_model.pkl'")
    print("Scaler saved as 'scaler.pkl'")

    return model, scaler, r2

if __name__ == '__main__':
    train_model()
    print("\n✓ Training completed successfully!")
```

## 3. app.py

This is the Flask server that serves predictions:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the model and scaler
try:
    model = joblib.load('wind_turbine_model.pkl')
    scaler = joblib.load('scaler.pkl')
    print("Model and scaler loaded successfully!")
except FileNotFoundError:
    print("ERROR: Model files not found!")
    print("Please run 'python train_model.py' first to train the model.")
    model = None
    scaler = None

@app.route('/')
def home():
    return jsonify({
        'message': 'Wind Turbine Energy Prediction API',
        'status': 'running',
        'model_loaded': model is not None,
        'endpoints': {
            '/predict': 'POST - Predict energy output',
            '/health': 'GET - Check API health'
        }
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({
            'error': 'Model not loaded. Please train the model first.'
        }), 500

    try:
        data = request.get_json()

        # Extract features
        features = np.array([[
            float(data['windSpeed']),
            float(data['windDirection']),
            float(data['temperature']),
            float(data['pressure']),
            float(data['humidity'])
        ]])

        # Scale features
        features_scaled = scaler.transform(features)

        # Make prediction
        prediction = model.predict(features_scaled)[0]

        # Ensure non-negative prediction
        prediction = max(0, prediction)

        return jsonify({
            'prediction': round(prediction, 2),
            'unit': 'kW',
            'input': {
                'windSpeed': data['windSpeed'],
                'windDirection': data['windDirection'],
                'temperature': data['temperature'],
                'pressure': data['pressure'],
                'humidity': data['humidity']
            }
        })

    except KeyError as e:
        return jsonify({
            'error': f'Missing required field: {str(e)}'
        }), 400

    except ValueError as e:
        return jsonify({
            'error': f'Invalid input value: {str(e)}'
        }), 400

    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    if model is None:
        print("\n" + "="*60)
        print("WARNING: Model not found!")
        print("Please run 'python train_model.py' first.")
        print("="*60 + "\n")

    print("\nStarting Flask server...")
    print("Server will run on http://localhost:5000")
    print("Press CTRL+C to stop the server\n")

    app.run(debug=True, host='0.0.0.0', port=5000)
```

## How to Set Up the Backend

1. **Create the backend folder:**
   ```bash
   mkdir backend
   cd backend
   ```

2. **Create all the Python files above** (requirements.txt, train_model.py, app.py)

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the model:**
   ```bash
   python train_model.py
   ```
   This will:
   - Create a sample dataset (or use your own if you have one)
   - Train the Random Forest model
   - Save the model as `wind_turbine_model.pkl`
   - Display performance metrics

5. **Start the Flask server:**
   ```bash
   python app.py
   ```
   The server will run on http://localhost:5000

## Using Your Own Dataset

If you have your own wind turbine dataset, replace the sample data generation in `train_model.py` with:

```python
df = pd.read_csv('your_dataset.csv')
```

Make sure your dataset has these columns:
- `wind_speed` (m/s)
- `wind_direction` (degrees)
- `temperature` (°C)
- `pressure` (hPa)
- `humidity` (%)
- `power_output` (kW)

## Testing the API

You can test the API using curl:

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "windSpeed": 12.5,
    "windDirection": 180,
    "temperature": 20,
    "pressure": 1013,
    "humidity": 65
  }'
```

Expected response:
```json
{
  "prediction": 1234.56,
  "unit": "kW",
  "input": {
    "windSpeed": 12.5,
    "windDirection": 180,
    "temperature": 20,
    "pressure": 1013,
    "humidity": 65
  }
}
```
