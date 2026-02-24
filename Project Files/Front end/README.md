# Wind Turbine Energy Output Prediction System

A full-stack machine learning application that predicts wind turbine energy output based on weather conditions. This project combines a React frontend with a Python Flask backend using Random Forest Regression.

## Project Overview

This application helps energy companies and grid operators:
- **Forecast energy production** for better grid management
- **Plan maintenance schedules** during low wind periods
- **Integrate renewable energy** efficiently into the power grid

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)

### Backend
- Python 3.8+
- Flask (web framework)
- Scikit-learn (machine learning)
- Pandas & NumPy (data processing)
- Random Forest Regressor (ML model)

### External APIs
- OpenWeather API (real-time weather data)

## Project Structure

```
wind-turbine-predictor/
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── WeatherCard.tsx      # Weather display component
│   │   └── PredictionForm.tsx   # Energy prediction form
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
│
├── backend/                      # Python Flask backend
│   ├── app.py                   # Flask server
│   ├── train_model.py           # Model training script
│   ├── requirements.txt         # Python dependencies
│   ├── wind_turbine_model.pkl   # Trained ML model (generated)
│   └── scaler.pkl               # Feature scaler (generated)
│
└── README.md                     # This file
```

## Setup Instructions

### Prerequisites

1. **Node.js** (v16 or higher) - for React frontend
2. **Python** (v3.8 or higher) - for Flask backend
3. **OpenWeather API Key** - Get free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Step 1: Clone and Install Frontend Dependencies

```bash
# Install frontend dependencies
npm install
```

### Step 2: Configure OpenWeather API Key

1. Sign up for a free API key at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)
2. Open `src/App.tsx` and replace `YOUR_OPENWEATHER_API_KEY` with your actual API key:

```typescript
const API_KEY = 'your_actual_api_key_here';
```

### Step 3: Set Up Python Backend

1. **Create backend directory:**
   ```bash
   mkdir backend
   cd backend
   ```

2. **Create Python files** (see PYTHON_BACKEND_CODE.md for complete code):
   - `requirements.txt`
   - `train_model.py`
   - `app.py`

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the ML model:**
   ```bash
   python train_model.py
   ```

   This will:
   - Generate a sample dataset (or use your own)
   - Train a Random Forest model
   - Save the model and scaler files
   - Display performance metrics

5. **Start the Flask server:**
   ```bash
   python app.py
   ```

   The backend will run on http://localhost:5000

### Step 4: Start the Frontend

In a new terminal (from the project root):

```bash
npm run dev
```

The frontend will run on http://localhost:5173 (or another port if 5173 is busy)

## Usage Guide

### 1. Weather-Based Prediction

1. **Enter a city name** (e.g., "London", "New York") in the search box
2. **Click "Search"** to fetch current weather data
3. Weather information will display including:
   - Temperature
   - Wind speed and direction
   - Humidity
   - Atmospheric pressure
4. **Click "Use Current Weather Data"** to auto-fill the prediction form
5. **Click "Predict Energy Output"** to get the prediction

### 2. Manual Prediction

1. **Manually enter** weather parameters:
   - Wind Speed (m/s)
   - Wind Direction (0-360 degrees)
   - Temperature (°C)
   - Pressure (hPa)
   - Humidity (%)
2. **Click "Predict Energy Output"**
3. View the predicted power output in kilowatts (kW)

## Machine Learning Model

### Algorithm: Random Forest Regressor

The model uses Random Forest Regression with the following configuration:
- **Estimators:** 100 decision trees
- **Max Depth:** 20
- **Features:** wind_speed, wind_direction, temperature, pressure, humidity
- **Target:** power_output (kW)

### Model Performance

After training, you'll see metrics like:
- **R² Score:** Indicates model accuracy (closer to 1.0 is better)
- **Mean Absolute Error (MAE):** Average prediction error in kW
- **Root Mean Squared Error (RMSE):** Penalizes large errors

### Feature Importance

The model considers these factors:
1. **Wind Speed** - Most important factor (directly proportional to power)
2. **Temperature** - Affects air density
3. **Pressure** - Influences air density
4. **Humidity** - Minor effect on air density
5. **Wind Direction** - Turbine orientation factor

## Using Your Own Dataset

If you have real wind turbine data:

1. Prepare a CSV file with these columns:
   - `wind_speed` (m/s)
   - `wind_direction` (degrees)
   - `temperature` (°C)
   - `pressure` (hPa)
   - `humidity` (%)
   - `power_output` (kW)

2. Place the CSV in the `backend/` folder

3. Modify `train_model.py` to load your dataset:
   ```python
   df = pd.read_csv('your_dataset.csv')
   ```

4. Retrain the model:
   ```bash
   python train_model.py
   ```

## API Endpoints

### Backend API (Flask)

#### GET /
- **Description:** API information and status
- **Response:** JSON with API details

#### GET /health
- **Description:** Health check endpoint
- **Response:** `{"status": "healthy", "model_loaded": true}`

#### POST /predict
- **Description:** Predict energy output
- **Request Body:**
  ```json
  {
    "windSpeed": 12.5,
    "windDirection": 180,
    "temperature": 20,
    "pressure": 1013,
    "humidity": 65
  }
  ```
- **Response:**
  ```json
  {
    "prediction": 1234.56,
    "unit": "kW"
  }
  ```

## Troubleshooting

### Frontend Issues

**Problem:** "Failed to fetch weather data"
- **Solution:** Check your OpenWeather API key is correct and activated

**Problem:** "Failed to get prediction"
- **Solution:** Ensure Flask backend is running on port 5000

### Backend Issues

**Problem:** "Model not found"
- **Solution:** Run `python train_model.py` first

**Problem:** "Port 5000 already in use"
- **Solution:** Change the port in `app.py`:
  ```python
  app.run(debug=True, host='0.0.0.0', port=5001)
  ```
  Then update `BACKEND_URL` in `src/App.tsx`

**Problem:** Import errors
- **Solution:** Ensure all dependencies are installed:
  ```bash
  pip install -r requirements.txt
  ```

## Deployment

### Frontend Deployment (Netlify/Vercel)

1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to Netlify or Vercel

3. Update the `BACKEND_URL` to your deployed backend URL

### Backend Deployment (Heroku/Railway/Render)

1. Add a `Procfile`:
   ```
   web: python app.py
   ```

2. Deploy to your chosen platform

3. Update CORS settings if needed

## Features

- Real-time weather data integration
- Interactive prediction form
- Responsive design for mobile and desktop
- Clean, modern UI with Tailwind CSS
- Error handling and validation
- Loading states and user feedback

## Future Enhancements

- Historical prediction data storage
- Multiple turbine support
- Advanced visualization (charts/graphs)
- Weather forecast integration for multi-day predictions
- User authentication
- API rate limiting
- Batch predictions
- Export predictions to CSV

## Learning Outcomes

Through this project, you'll learn:
- Building full-stack ML applications
- React with TypeScript
- Flask API development
- Machine Learning with Scikit-learn
- Data preprocessing and feature engineering
- Model training and evaluation
- API integration
- Responsive web design

## License

This project is for educational purposes as part of the SmartInternz AI/ML internship program.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the PYTHON_BACKEND_CODE.md file
3. Ensure all dependencies are correctly installed

## Acknowledgments

- **SmartInternz** - Internship platform
- **OpenWeatherMap** - Weather data API
- **Scikit-learn** - Machine learning library
- **React & Vite** - Frontend framework and tooling
