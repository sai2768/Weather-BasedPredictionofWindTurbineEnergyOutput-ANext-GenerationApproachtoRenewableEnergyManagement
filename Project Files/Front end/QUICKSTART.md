# Quick Start Guide

Follow these steps to run the Wind Turbine Energy Prediction application locally.

## Prerequisites Checklist

- [ ] Node.js installed (v16+)
- [ ] Python installed (v3.8+)
- [ ] OpenWeather API key obtained

## Step-by-Step Setup

### Part 1: Frontend Setup (5 minutes)

1. **Open terminal in project directory**

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Get OpenWeather API Key:**
   - Visit: https://openweathermap.org/api
   - Sign up for free account
   - Get your API key from dashboard
   - Note: Key activation may take a few minutes

4. **Add API Key to project:**
   - Open `src/App.tsx`
   - Find line 15: `const API_KEY = 'YOUR_OPENWEATHER_API_KEY';`
   - Replace with: `const API_KEY = 'your_actual_api_key';`
   - Save the file

### Part 2: Backend Setup (10 minutes)

1. **Create backend folder:**
   ```bash
   mkdir backend
   cd backend
   ```

2. **Create requirements.txt:**
   ```bash
   # Copy from PYTHON_BACKEND_CODE.md or create file with:
   flask==3.0.0
   flask-cors==4.0.0
   pandas==2.1.0
   numpy==1.24.3
   scikit-learn==1.3.0
   joblib==1.3.2
   ```

3. **Create train_model.py and app.py:**
   - Copy the complete code from `PYTHON_BACKEND_CODE.md`
   - Create `train_model.py` with the training code
   - Create `app.py` with the Flask server code

4. **Install Python packages:**
   ```bash
   pip install -r requirements.txt
   ```

   Note: If you get errors, try:
   ```bash
   python -m pip install -r requirements.txt
   ```

5. **Train the model:**
   ```bash
   python train_model.py
   ```

   You should see:
   - "Creating sample dataset..."
   - "Training Random Forest Regressor..."
   - Model performance metrics (R² Score, MAE, RMSE)
   - "✓ Training completed successfully!"

   This creates:
   - `wind_turbine_model.pkl` (the trained model)
   - `scaler.pkl` (feature scaler)
   - `wind_turbine_data.csv` (sample dataset)

### Part 3: Run the Application

1. **Start the Flask backend:**
   ```bash
   # From the backend/ directory
   python app.py
   ```

   You should see:
   ```
   Model and scaler loaded successfully!
   Starting Flask server...
   Server will run on http://localhost:5000
   ```

   Keep this terminal open!

2. **Start the React frontend:**
   ```bash
   # Open NEW terminal in project root directory
   npm run dev
   ```

   You should see:
   ```
   VITE v5.x.x ready in xxx ms
   ➜ Local: http://localhost:5173/
   ```

3. **Open browser:**
   - Go to: http://localhost:5173
   - You should see the Wind Turbine Energy Predictor interface!

## Testing the Application

### Test 1: Weather Search

1. Enter a city name (e.g., "London")
2. Click "Search"
3. Weather data should appear in the left card
4. You should see: temperature, wind speed, direction, humidity, pressure

### Test 2: Energy Prediction (Using Weather Data)

1. After searching for a city, click "Use Current Weather Data"
2. The form should auto-fill with weather values
3. Click "Predict Energy Output"
4. You should see predicted power in kW

### Test 3: Manual Prediction

1. Manually enter values:
   - Wind Speed: 12.5
   - Wind Direction: 180
   - Temperature: 20
   - Pressure: 1013
   - Humidity: 65
2. Click "Predict Energy Output"
3. Check if prediction appears

## Common Issues & Solutions

### Issue 1: "Failed to fetch weather data"

**Cause:** Invalid or inactive API key

**Solution:**
- Check API key is correct in `src/App.tsx`
- Wait 10-15 minutes after creating OpenWeather account (key activation)
- Check internet connection

### Issue 2: "Failed to get prediction"

**Cause:** Flask backend not running

**Solution:**
- Check terminal running `python app.py` is still active
- Verify you see "Model and scaler loaded successfully!"
- Try accessing http://localhost:5000 in browser (should show API info)

### Issue 3: "Model not found"

**Cause:** Model files not created

**Solution:**
- Run `python train_model.py` in backend folder
- Check for `wind_turbine_model.pkl` and `scaler.pkl` files
- Restart Flask server after training

### Issue 4: Python package errors

**Cause:** Missing or incompatible packages

**Solution:**
```bash
# Try upgrading pip first
python -m pip install --upgrade pip

# Then install requirements
python -m pip install -r requirements.txt

# Or install packages individually
pip install flask flask-cors pandas numpy scikit-learn joblib
```

### Issue 5: Port already in use

**Cause:** Port 5000 or 5173 already taken

**Solution for Backend (Port 5000):**
- In `backend/app.py`, change line:
  ```python
  app.run(debug=True, host='0.0.0.0', port=5001)  # Changed to 5001
  ```
- In `src/App.tsx`, change line 16:
  ```typescript
  const BACKEND_URL = 'http://localhost:5001';  # Changed to 5001
  ```

**Solution for Frontend (Port 5173):**
- Vite will automatically use next available port
- Check terminal output for actual port number

### Issue 6: CORS errors in browser console

**Cause:** Backend not allowing frontend requests

**Solution:**
- Ensure `flask-cors` is installed
- Check `app.py` has `CORS(app)` line
- Restart Flask server

## Folder Structure After Setup

```
your-project/
├── src/                           # React frontend
│   ├── components/
│   ├── types/
│   └── App.tsx (with your API key)
│
├── backend/                       # Python backend
│   ├── app.py
│   ├── train_model.py
│   ├── requirements.txt
│   ├── wind_turbine_model.pkl    # Generated after training
│   ├── scaler.pkl                # Generated after training
│   └── wind_turbine_data.csv     # Generated after training
│
├── node_modules/                  # Installed by npm install
├── package.json
└── README.md
```

## Verification Checklist

Before running, ensure:

- [ ] OpenWeather API key added to `src/App.tsx`
- [ ] Backend folder created with all Python files
- [ ] Python packages installed (`pip install -r requirements.txt`)
- [ ] Model trained (`python train_model.py` completed successfully)
- [ ] `.pkl` files exist in backend folder
- [ ] Frontend dependencies installed (`npm install`)

## Running the App

**Terminal 1 (Backend):**
```bash
cd backend
python app.py
# Keep running
```

**Terminal 2 (Frontend):**
```bash
# From project root
npm run dev
# Keep running
```

**Browser:**
```
http://localhost:5173
```

## Next Steps

Once everything is working:

1. Try different cities
2. Test various weather conditions
3. Analyze prediction results
4. Review model performance metrics
5. Consider using your own dataset (see README.md)

## Getting Help

If you're still stuck:

1. Check all terminals for error messages
2. Review the detailed README.md file
3. Check PYTHON_BACKEND_CODE.md for complete code
4. Ensure all prerequisites are installed correctly

## Development Tips

- Keep both terminals visible to monitor for errors
- Browser DevTools Console (F12) shows frontend errors
- Flask terminal shows backend errors
- Make sure you're in correct directory when running commands

## Success Indicators

You'll know it's working when:

1. Flask terminal shows: "Model and scaler loaded successfully!"
2. Vite terminal shows: "ready in xxx ms"
3. Browser shows the application interface without errors
4. Weather search returns data
5. Predictions generate kW values

Enjoy your Wind Turbine Energy Prediction application!
