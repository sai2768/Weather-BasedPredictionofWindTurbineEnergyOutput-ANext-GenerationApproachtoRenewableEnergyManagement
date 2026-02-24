import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

def train_model():
    print("Loading dataset...")

    if not os.path.exists('wind_turbine_data.csv'):
        print("Creating sample dataset...")
        np.random.seed(42)
        n_samples = 1000

        wind_speed = np.random.uniform(0, 25, n_samples)
        wind_direction = np.random.uniform(0, 360, n_samples)
        temperature = np.random.uniform(-10, 35, n_samples)
        pressure = np.random.uniform(980, 1040, n_samples)
        humidity = np.random.uniform(20, 100, n_samples)

        power = (0.5 * 1.225 * np.pi * (50**2) * (wind_speed**3) / 1000)
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

    X = df[['wind_speed', 'wind_direction', 'temperature', 'pressure', 'humidity']]
    y = df['power_output']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    model = RandomForestRegressor()
    model.fit(X_train_scaled, y_train)

    joblib.dump(model, 'wind_turbine_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')

    print("Model trained and saved successfully!")

if __name__ == '__main__':
    train_model()