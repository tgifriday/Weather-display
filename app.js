const OPEN_METEO_GEO = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_WEATHER = 'https://api.open-meteo.com/v1/forecast';

let state = {
  lat: null,
  lon: null,
  locationName: 'Detecting...',
  outdoorTemp: null,
  outdoorHumidity: null,
  pressure: null,
  pressureHistory: [],
  weatherCode: null,
  weatherCodeNext: null,
  indoorTemp: 74,
  indoorHumidity: 21,
};

// --- Weather Icon SVG Generators ---

function drawSun(svg) {
  svg.innerHTML = `
    <circle cx="50" cy="40" r="14" fill="none" stroke="currentColor" stroke-width="3"/>
    <line x1="50" y1="16" x2="50" y2="22" stroke="currentColor" stroke-width="3"/>
    <line x1="50" y1="58" x2="50" y2="64" stroke="currentColor" stroke-width="3"/>
    <line x1="26" y1="40" x2="32" y2="40" stroke="currentColor" stroke-width="3"/>
    <line x1="68" y1="40" x2="74" y2="40" stroke="currentColor" stroke-width="3"/>
    <line x1="33" y1="23" x2="37" y2="27" stroke="currentColor" stroke-width="3"/>
    <line x1="63" y1="53" x2="67" y2="57" stroke="currentColor" stroke-width="3"/>
    <line x1="67" y1="23" x2="63" y2="27" stroke="currentColor" stroke-width="3"/>
    <line x1="37" y1="53" x2="33" y2="57" stroke="currentColor" stroke-width="3"/>
  `;
}

function drawCloud(svg, offsetX = 0, offsetY = 0) {
  svg.innerHTML = `
    <path d="M${25 + offsetX} ${50 + offsetY}
      a 16 16 0 0 1 -4 -30
      a 20 20 0 0 1 38 -4
      a 14 14 0 0 1 10 24
      z"
      fill="none" stroke="currentColor" stroke-width="3"/>
  `;
}

function drawPartlyCloudy(svg) {
  svg.innerHTML = `
    <circle cx="62" cy="24" r="11" fill="none" stroke="currentColor" stroke-width="2.5"/>
    <line x1="62" y1="8" x2="62" y2="12" stroke="currentColor" stroke-width="2"/>
    <line x1="62" y1="36" x2="62" y2="40" stroke="currentColor" stroke-width="2"/>
    <line x1="46" y1="24" x2="50" y2="24" stroke="currentColor" stroke-width="2"/>
    <line x1="74" y1="24" x2="78" y2="24" stroke="currentColor" stroke-width="2"/>
    <path d="M20 58
      a 13 13 0 0 1 -3 -24
      a 16 16 0 0 1 30 -3
      a 11 11 0 0 1 8 19
      z"
      fill="none" stroke="currentColor" stroke-width="3"/>
  `;
}

function drawRain(svg) {
  svg.innerHTML = `
    <path d="M22 40
      a 12 12 0 0 1 -3 -22
      a 15 15 0 0 1 28 -3
      a 10 10 0 0 1 7 18
      z"
      fill="none" stroke="currentColor" stroke-width="3"/>
    <line x1="28" y1="48" x2="24" y2="58" stroke="currentColor" stroke-width="2.5"/>
    <line x1="40" y1="48" x2="36" y2="58" stroke="currentColor" stroke-width="2.5"/>
    <line x1="52" y1="48" x2="48" y2="58" stroke="currentColor" stroke-width="2.5"/>
  `;
}

function drawSnow(svg) {
  svg.innerHTML = `
    <path d="M22 38
      a 12 12 0 0 1 -3 -22
      a 15 15 0 0 1 28 -3
      a 10 10 0 0 1 7 18
      z"
      fill="none" stroke="currentColor" stroke-width="3"/>
    <circle cx="28" cy="52" r="2.5" fill="currentColor"/>
    <circle cx="40" cy="56" r="2.5" fill="currentColor"/>
    <circle cx="52" cy="52" r="2.5" fill="currentColor"/>
    <circle cx="34" cy="46" r="2" fill="currentColor"/>
    <circle cx="46" cy="46" r="2" fill="currentColor"/>
  `;
}

function drawThunder(svg) {
  svg.innerHTML = `
    <path d="M22 36
      a 12 12 0 0 1 -3 -22
      a 15 15 0 0 1 28 -3
      a 10 10 0 0 1 7 18
      z"
      fill="none" stroke="currentColor" stroke-width="3"/>
    <polyline points="38,40 32,54 42,54 36,68" fill="none" stroke="currentColor" stroke-width="3"/>
  `;
}

function drawFog(svg) {
  svg.innerHTML = `
    <line x1="15" y1="28" x2="85" y2="28" stroke="currentColor" stroke-width="3"/>
    <line x1="20" y1="38" x2="80" y2="38" stroke="currentColor" stroke-width="3"/>
    <line x1="15" y1="48" x2="85" y2="48" stroke="currentColor" stroke-width="3"/>
    <line x1="25" y1="58" x2="75" y2="58" stroke="currentColor" stroke-width="3"/>
  `;
}

function drawCloudSmall(svg) {
  svg.innerHTML = `
    <path d="M18 44
      a 11 11 0 0 1 -3 -20
      a 14 14 0 0 1 26 -3
      a 9 9 0 0 1 7 16
      z"
      fill="none" stroke="currentColor" stroke-width="3"/>
  `;
}

function drawSunSmall(svg) {
  svg.innerHTML = `
    <circle cx="40" cy="32" r="11" fill="none" stroke="currentColor" stroke-width="2.5"/>
    <line x1="40" y1="14" x2="40" y2="18" stroke="currentColor" stroke-width="2"/>
    <line x1="40" y1="46" x2="40" y2="50" stroke="currentColor" stroke-width="2"/>
    <line x1="22" y1="32" x2="26" y2="32" stroke="currentColor" stroke-width="2"/>
    <line x1="54" y1="32" x2="58" y2="32" stroke="currentColor" stroke-width="2"/>
    <line x1="27" y1="19" x2="30" y2="22" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="42" x2="53" y2="45" stroke="currentColor" stroke-width="2"/>
    <line x1="53" y1="19" x2="50" y2="22" stroke="currentColor" stroke-width="2"/>
    <line x1="30" y1="42" x2="27" y2="45" stroke="currentColor" stroke-width="2"/>
  `;
}

function drawPartlyCloudySmall(svg) {
  svg.innerHTML = `
    <circle cx="50" cy="18" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="5" x2="50" y2="8" stroke="currentColor" stroke-width="1.5"/>
    <line x1="38" y1="18" x2="41" y2="18" stroke="currentColor" stroke-width="1.5"/>
    <line x1="59" y1="18" x2="62" y2="18" stroke="currentColor" stroke-width="1.5"/>
    <path d="M16 46
      a 10 10 0 0 1 -2 -19
      a 13 13 0 0 1 24 -2
      a 8 8 0 0 1 6 15
      z"
      fill="none" stroke="currentColor" stroke-width="2.5"/>
  `;
}

// Map WMO weather codes to icon drawing functions
function getWeatherIconFn(code) {
  if (code === 0) return drawSun;
  if (code === 1) return drawPartlyCloudy;
  if (code === 2) return drawPartlyCloudy;
  if (code === 3) return drawCloud;
  if (code === 45 || code === 48) return drawFog;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return drawRain;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return drawSnow;
  if ([95, 96, 99].includes(code)) return drawThunder;
  return drawCloud;
}

function getWeatherIconFnSmall(code) {
  if (code === 0) return drawSunSmall;
  if (code === 1 || code === 2) return drawPartlyCloudySmall;
  if (code === 3) return drawCloudSmall;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return drawCloudSmall;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return drawCloudSmall;
  return drawCloudSmall;
}

// --- Clock ---

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const timeStr = `${hours}:${String(minutes).padStart(2, '0')}`;
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  document.getElementById('ampm').textContent = ampm;
  document.getElementById('time-display').textContent = timeStr;
  document.getElementById('date-month').textContent = months[now.getMonth()];
  document.getElementById('date-day').textContent = now.getDate();
  document.getElementById('day-name').textContent = days[now.getDay()];
}

// --- Pressure History Chart ---

function updatePressureChart(history) {
  if (!history || history.length === 0) return;

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 0.5;

  const bars = document.querySelectorAll('.chart-bar .bar-fill');
  const count = bars.length;

  const step = Math.max(1, Math.floor(history.length / count));
  const sampled = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.min(i * step, history.length - 1);
    sampled.push(history[idx]);
  }

  bars.forEach((bar, i) => {
    if (i < sampled.length) {
      const pct = ((sampled[i] - min) / range) * 80 + 20;
      bar.style.height = pct + '%';
    }
  });
}

// --- Weather Data Fetching ---

async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,surface_pressure,weather_code',
    hourly: 'surface_pressure,weather_code',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    forecast_days: 1,
    past_days: 1,
    timezone: 'auto',
  });

  const url = `${OPEN_METEO_WEATHER}?${params}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Weather API request failed');
  return response.json();
}

async function geocodeCity(name) {
  const params = new URLSearchParams({ name, count: 1, language: 'en' });
  const url = `${OPEN_METEO_GEO}?${params}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Geocoding request failed');
  const data = await response.json();
  if (!data.results || data.results.length === 0) throw new Error('Location not found');
  return data.results[0];
}

function celsiusToFahrenheit(c) {
  return Math.round(c * 9 / 5 + 32);
}

function hPaToInHg(hpa) {
  return (hpa * 0.02953).toFixed(2);
}

function processWeatherData(data) {
  const current = data.current;

  state.outdoorTemp = Math.round(current.temperature_2m);
  state.outdoorHumidity = Math.round(current.relative_humidity_2m);
  state.pressure = hPaToInHg(current.surface_pressure);
  state.weatherCode = current.weather_code;

  if (data.hourly && data.hourly.surface_pressure) {
    const pressures = data.hourly.surface_pressure;
    const now = new Date();
    const times = data.hourly.time.map(t => new Date(t));

    const pastPressures = [];
    for (let i = 0; i < times.length; i++) {
      if (times[i] <= now) {
        pastPressures.push(pressures[i]);
      }
    }

    state.pressureHistory = pastPressures.slice(-24);

    const futureCodes = [];
    for (let i = 0; i < times.length; i++) {
      if (times[i] > now) {
        futureCodes.push(data.hourly.weather_code[i]);
      }
    }
    state.weatherCodeNext = futureCodes.length > 0 ? futureCodes[0] : state.weatherCode;
  }

  updateDisplay();
}

// --- UI Update ---

function updateDisplay() {
  if (state.outdoorTemp !== null) {
    document.getElementById('outdoor-temp').textContent = state.outdoorTemp;
  }
  if (state.outdoorHumidity !== null) {
    document.getElementById('outdoor-humidity').textContent = state.outdoorHumidity;
  }
  if (state.pressure !== null) {
    document.getElementById('pressure-value').textContent = state.pressure;
  }

  document.getElementById('indoor-temp').textContent = state.indoorTemp;
  document.getElementById('indoor-humidity').textContent = state.indoorHumidity;

  const mainIcon = document.getElementById('forecast-icon-main');
  const trendIcon = document.getElementById('forecast-icon-trend');

  if (state.weatherCode !== null) {
    const drawMain = getWeatherIconFn(state.weatherCode);
    drawMain(mainIcon);
  }

  const nextCode = state.weatherCodeNext !== null ? state.weatherCodeNext : state.weatherCode;
  if (nextCode !== null) {
    const drawSmall = getWeatherIconFnSmall(nextCode);
    drawSmall(trendIcon);
  }

  if (state.pressureHistory.length > 0) {
    updatePressureChart(state.pressureHistory);
  }

  document.getElementById('location-name').textContent = state.locationName;
}

// --- Geolocation ---

async function initWithGeolocation() {
  if (!navigator.geolocation) {
    await initWithFallback();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      state.lat = pos.coords.latitude;
      state.lon = pos.coords.longitude;
      state.locationName = `${state.lat.toFixed(2)}°, ${state.lon.toFixed(2)}°`;
      updateDisplay();
      try {
        const data = await fetchWeather(state.lat, state.lon);
        processWeatherData(data);
        await reverseGeocode(state.lat, state.lon);
      } catch (e) {
        console.error('Weather fetch failed:', e);
      }
    },
    async () => {
      await initWithFallback();
    },
    { timeout: 8000 }
  );
}

async function reverseGeocode(lat, lon) {
  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
    });
    const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`);
    const data = await resp.json();
    if (data.timezone) {
      state.locationName = data.timezone.replace(/_/g, ' ').replace(/\//g, ', ');
      updateDisplay();
    }
  } catch (e) {
    // Keep coordinate-based name
  }
}

async function initWithFallback() {
  try {
    const ipResp = await fetch('https://ipapi.co/json/');
    const ipData = await ipResp.json();
    if (ipData.latitude && ipData.longitude) {
      state.lat = ipData.latitude;
      state.lon = ipData.longitude;
      state.locationName = `${ipData.city || ''}, ${ipData.region || ''}`.replace(/^, |, $/g, '') || 'Unknown';
    } else {
      throw new Error('No coordinates from IP');
    }
  } catch (e) {
    state.lat = 40.71;
    state.lon = -74.01;
    state.locationName = 'New York, NY (default)';
  }

  updateDisplay();
  try {
    const data = await fetchWeather(state.lat, state.lon);
    processWeatherData(data);
  } catch (e) {
    console.error('Weather fetch failed:', e);
  }
}

// --- Location Search ---

async function setLocationByName(name) {
  const coordMatch = name.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    state.lat = parseFloat(coordMatch[1]);
    state.lon = parseFloat(coordMatch[2]);
    state.locationName = `${state.lat.toFixed(2)}°, ${state.lon.toFixed(2)}°`;
  } else {
    try {
      const result = await geocodeCity(name);
      state.lat = result.latitude;
      state.lon = result.longitude;
      state.locationName = `${result.name}, ${result.admin1 || result.country || ''}`;
    } catch (e) {
      alert('Location not found. Try "City, Country" or "lat,lon".');
      return;
    }
  }

  updateDisplay();
  try {
    const data = await fetchWeather(state.lat, state.lon);
    processWeatherData(data);
  } catch (e) {
    console.error('Weather fetch failed:', e);
  }
}

// --- Event Listeners ---

document.getElementById('location-btn').addEventListener('click', () => {
  const val = document.getElementById('location-input').value.trim();
  if (val) setLocationByName(val);
});

document.getElementById('location-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (val) setLocationByName(val);
  }
});

document.getElementById('geolocate-btn').addEventListener('click', () => {
  initWithGeolocation();
});

document.getElementById('indoor-temp-input').addEventListener('change', (e) => {
  state.indoorTemp = parseInt(e.target.value) || 72;
  updateDisplay();
});

document.getElementById('indoor-hum-input').addEventListener('change', (e) => {
  state.indoorHumidity = parseInt(e.target.value) || 40;
  updateDisplay();
});

// --- Auto Refresh ---

function startAutoRefresh() {
  updateClock();
  setInterval(updateClock, 1000);

  setInterval(async () => {
    if (state.lat && state.lon) {
      try {
        const data = await fetchWeather(state.lat, state.lon);
        processWeatherData(data);
      } catch (e) {
        console.error('Auto-refresh failed:', e);
      }
    }
  }, 5 * 60 * 1000);
}

// --- Init ---

startAutoRefresh();
initWithGeolocation();
