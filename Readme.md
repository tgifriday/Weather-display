# Weather Station Display

A web application that emulates a **La Crosse Technology** weather station LCD display, showing real-time weather data from the [Open-Meteo API](https://open-meteo.com/).

## Features

- **Outdoor Temperature** in °F with live data from Open-Meteo
- **Outdoor Humidity Level** percentage display
- **Barometric Pressure** in inHg with 24-hour pressure history bar chart
- **Weather Forecast Icons** (sun, clouds, rain, snow, thunderstorm, fog) based on WMO weather codes
- **Real-Time Clock** with AM/PM, date, and day of week
- **Indoor Temperature & Humidity** (user-configurable)
- **Signal Strength** and battery indicator decorations
- **Location Controls** — set by city name, coordinates, or browser geolocation
- **Auto-refresh** every 5 minutes
- **Responsive** layout for mobile and desktop

## How to Use

1. Open `index.html` in a browser
2. Allow location access when prompted (or it falls back to IP-based geolocation)
3. Use the controls below the station to:
   - Search any city or enter `lat,lon` coordinates
   - Adjust simulated indoor temperature and humidity

## Tech Stack

- Pure HTML, CSS, JavaScript (no build tools or frameworks)
- [Open-Meteo API](https://open-meteo.com/) for weather data (free, no API key)
- [Orbitron](https://fonts.google.com/specimen/Orbitron) font for LCD-style digits
- SVG weather icons drawn programmatically

## Design Method
- Cursor request:
- "Create a web app to display the information in this mock up image. Use services to accurately display the information and emulates this display correctly"
<img width="585" height="526" alt="image" src="https://github.com/user-attachments/assets/d5585edc-41d6-42b3-88c8-9a1ca4e81245" />

- Result:
<img width="585" height="567" alt="image" src="https://github.com/user-attachments/assets/54e25a11-8953-44ef-a153-1c3dac4c0959" />
