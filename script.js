import { initWeatherMedia, setWeatherMedia } from './weatherMedia.js';
initWeatherMedia();
let currentUnit = localStorage.getItem('currentUnit') || 'metric';
const apiKey ="30e99d20a3dce7c04582cd15b40e393a";

function setLoading(isLoading){
  const currentLoading = document.getElementById("current-loading");
  const hourlySkeleton = document.getElementById("hourly-skeleton");
  const dailySkeleton = document.getElementById("daily-skeleton");

  if (currentLoading) currentLoading.classList.toggle("hidden", !isLoading);
  if (hourlySkeleton) hourlySkeleton.classList.toggle("hidden", !isLoading);
  if (dailySkeleton) dailySkeleton.classList.toggle("hidden", !isLoading);

  const hourlyContainer = document.getElementById("forecast-hour-container");
  const dailyContainer = document.getElementById("forecast-day-container");

  if (hourlyContainer) hourlyContainer.style.display = isLoading ? "none" : "";
  if (dailyContainer) dailyContainer.style.display = isLoading ? "none" : "";
}


function searchCityWeather(city){
    setLoading(true); 

    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=${currentUnit}&q=${city}`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=${currentUnit}&q=${city}`;
    Promise.all([
        fetch(`${apiUrl}&appid=${apiKey}`).then(response => response.json()),
        fetch(`${forecastApiUrl}&appid=${apiKey}`).then(response => response.json())
    ]).then(([data, forecastData]) => {
  if (String(data.cod) === "404") {
    setLoading(false); 
    showState({
      type: "empty",
      title: "No search result found!",
      desc: "",
      showButton: false
    });
    return;
  }
  if (data.cod && String(data.cod) !== "200") {
    setLoading(false);
    showState({
      type: "error",
      title: "Something went wrong",
      desc: "We couldn't connect to the server (API error). Please try again in a few moments.",
      showButton: true
    });
    return;
  }

  hideState();
  updateWeatherUI(data);
  updateDailyForecastUI(forecastData);
  updateHourlyForecastUI(forecastData);
  setupDaysDropdown(forecastData);
  updateSearchHistory(city);
  localStorage.setItem('lastCity', city);

  setLoading(false); 

}).catch(error => {
  console.error("Error fetching weather data:", error);

  setLoading(false); 
  showState({
    type: "error",
    title: "Something went wrong",
    desc: "We couldn't connect to the server (API error). Please try again in a few moments.",
    showButton: true
  });
});
}
const appState = document.getElementById("app-state");
const appStateTitle = document.getElementById("app-state-title");
const appStateDesc = document.getElementById("app-state-desc");
const appStateBtn = document.getElementById("app-state-btn");

function showState({ type, title, desc, showButton }) {
  // type: "empty" | "error"
  appState.classList.remove("hidden", "app-state--empty", "app-state--error");
  appState.classList.add(type === "error" ? "app-state--error" : "app-state--empty");

  appStateTitle.textContent = title;
  appStateDesc.textContent = desc || "";

  appStateBtn.classList.toggle("hidden", !showButton);
}

function hideState() {
  appState.classList.add("hidden");
}
appStateBtn.addEventListener("click", () => {
  const lastCity = localStorage.getItem("lastCity") || cityInput.value.trim() || "dubai";
  searchCityWeather(lastCity);
});
function updaeAllData(){
    const saveCity = localStorage.getItem('lastCity') || 'dubai';
    searchCityWeather(saveCity);
}
const cityInput = document.querySelector('.cityInput');
const searchButton = document.querySelector('.searchButton');
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if(city){
        searchCityWeather(city);
    }
});
window.onload = updaeAllData();
const dropdown = document.getElementById('unitsDropdown');
const header = dropdown.querySelector('.dropdown-header');

header.addEventListener('click', () => {
  dropdown.classList.toggle('active');
});

window.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});
let windUnit = localStorage.getItem('windUnit') || 'kmh';  
let precipUnit = localStorage.getItem('precipUnit') || 'mm'; 

function kmhToMph(kmh) { return kmh / 1.60934; }
function mphToKmh(mph) { return mph * 1.60934; }
function mmToIn(mm) { return mm / 25.4; }
function inToMm(inches) { return inches * 25.4; }

function extractNumber(text) {
  const m = String(text).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
}


function ensureBaseForWindAndPrecip() {

  document.querySelectorAll('#wind-speed').forEach(el => {
    if (el.dataset.base != null) return;
    const n = extractNumber(el.innerText);
    if (!Number.isNaN(n)) el.dataset.base = String(n); 
  });

  document.querySelectorAll('#precipitation').forEach(el => {
    if (el.dataset.base != null) return;
    const n = extractNumber(el.innerText);
    if (!Number.isNaN(n)) el.dataset.base = String(n);
  });
}

function renderWindFromBase() {
  const windElements = document.querySelectorAll('#wind-speed');
  windElements.forEach(el => {
    const base = parseFloat(el.dataset.base);
    if (Number.isNaN(base)) return;
    const baseKmh = base;

    if (windUnit === 'kmh') {
      el.innerText = `${Math.round(baseKmh)} km/h`;
    } else {
      el.innerText = `${Math.round(kmhToMph(baseKmh))} mph`;
    }
  });
}

function renderPrecipFromBase() {
  const precipitationElements = document.querySelectorAll('#precipitation');
  precipitationElements.forEach(el => {
    const base = parseFloat(el.dataset.base);
    if (Number.isNaN(base)) return;

    const baseMm = base;

    if (precipUnit === 'mm') {
      el.innerText = `${Math.round(baseMm)} mm`;
    } else {
      el.innerText = `${mmToIn(baseMm).toFixed(2)} inches`;
    }
  });
}

function updateCheckmarksAndActive() {
  dropdown.querySelectorAll('.option[data-type]').forEach(opt => {
    const type = opt.getAttribute('data-type');   
    const unit = opt.getAttribute('data-unit');

    let isActive = false;

    if (type === 'temperature') isActive = (unit === currentUnit);
    if (type === 'wind') isActive = (unit === windUnit);
    if (type === 'precipitation') isActive = (unit === precipUnit);

    opt.classList.toggle('active', isActive);

    const check = opt.querySelector('.checkmark');
    if (check) check.classList.toggle('active', isActive);
  });
}

function updateSwitchAllText() {
  const switchAllOption = dropdown.querySelector('.dropdown-list .option'); 
  if (!switchAllOption) return;

  const allImperial =
    currentUnit === 'imperial' &&
    windUnit === 'mph' &&
    precipUnit === 'inches';

  switchAllOption.textContent = allImperial ? 'Switch to Metric' : 'Switch to Imperial';
}

function updateUnitsUIOnly() {
  ensureBaseForWindAndPrecip();
  renderWindFromBase();
  renderPrecipFromBase();
  updateCheckmarksAndActive();
  updateSwitchAllText();
}

function switchAllUnits() {
  const allImperial =
    currentUnit === 'imperial' &&
    windUnit === 'mph' &&
    precipUnit === 'inches';

  if (allImperial) {
    currentUnit = 'metric';
    windUnit = 'kmh';
    precipUnit = 'mm';
  } else {
    currentUnit = 'imperial';
    windUnit = 'mph';
    precipUnit = 'inches';
  }

  localStorage.setItem('currentUnit', currentUnit);
  localStorage.setItem('windUnit', windUnit);
  localStorage.setItem('precipUnit', precipUnit);


  updaeAllData();

  updateUnitsUIOnly();
}

dropdown.querySelectorAll('.option').forEach(opt => {
  opt.addEventListener('click', () => {
    const type = opt.getAttribute('data-type');
    const unit = opt.getAttribute('data-unit');
    if (!type && !unit) {
      switchAllUnits();
      dropdown.classList.remove('active');
      return;
    }

    if (type === 'temperature') {
      currentUnit = unit; 
      localStorage.setItem('currentUnit', currentUnit);
      updaeAllData();   
      updateUnitsUIOnly(); 
    } else if (type === 'wind') {
      windUnit = unit; 
      localStorage.setItem('windUnit', windUnit);
      updateUnitsUIOnly();
    } else if (type === 'precipitation') {
      precipUnit = unit; 
      localStorage.setItem('precipUnit', precipUnit);
      updateUnitsUIOnly();
    }

    dropdown.classList.remove('active');
  });
});

setTimeout(() => {
  updateUnitsUIOnly();
}, 0);

//js section search history
const searchHistoryContainer = document.getElementById('search-history');
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function updateSearchHistory(city){
  const normalizedCity = city.trim();
  if (!normalizedCity) return;

  const existingIndex = searchHistory.findIndex(
    item => item.toLowerCase() === normalizedCity.toLowerCase()
  );
  if (existingIndex !== -1) {
    const existingCity = searchHistory.splice(existingIndex, 1)[0];
    searchHistory.unshift(existingCity);
  } else {
    searchHistory.unshift(normalizedCity);
    if(searchHistory.length > 5){
      searchHistory.pop();
    }
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  renderSearchHistory();
}

function renderSearchHistory(){
  const cityInput = document.querySelector('.cityInput');
  searchHistoryContainer.innerHTML = '';

  searchHistory.forEach(city => {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.innerText = city;
    historyItem.addEventListener('click', () => {
      searchCityWeather(city);
      cityInput.value = '';
      searchHistoryContainer.classList.remove('active');
    });
    searchHistoryContainer.appendChild(historyItem);
  });
}

cityInput.addEventListener('input', () => {
  if (searchHistory.length > 0) searchHistoryContainer.classList.add('active');
});

document.addEventListener('click', (e) => {
  if (!searchHistoryContainer.contains(e.target) && e.target !== cityInput) {
    searchHistoryContainer.classList.remove('active');
  }
});
function doSearch(){
  const city = cityInput.value.trim();
  if(city){
    searchCityWeather(city);
    updateSearchHistory(city);
    cityInput.value = '';
    searchHistoryContainer.classList.remove('active');
  }
}

searchButton.addEventListener('click', doSearch);

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});
// js section weather current
function updateWeatherUI(data){
    const cityNameElement = document.getElementById('city-name');
    const dateElement = document.getElementById('date');
    const currentTempElement = document.getElementById('current-temp');
    const iconWeatherElement = document.getElementById('current-weather-icon');

    const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
    const countryCode = data.sys.country;
    const fullCountryName = regionName.of(data.sys.country);
    cityNameElement.innerText = `${data.name}, ${fullCountryName}`;
    const options = 
    {
        weekday : 'long',
        year : 'numeric',
        month : 'long',
        day : 'numeric'
    };
    const today = new Date();
    dateElement.innerText = today.toLocaleDateString('en-US',options);
    currentTempElement.innerText = `${Math.round(data.main.temp)}°`;
    const iconCode = data.weather[0].icon;
    iconWeatherElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconWeatherElement.alt = data.weather[0].description;
    iconWeatherElement.style.display = 'block';
    additonalWeatherInfo(data);
    const isNight = iconCode.includes('n');
    setWeatherMedia(data.weather[0].main, isNight);
}
function additonalWeatherInfo(data){
    const feelsLikeElement = document.getElementById('feels-like-temp');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');
    const precipitationElement = document.getElementById('precipitation');
    feelsLikeElement.innerText = `${Math.round(data.main.feels_like)}°`;
    humidityElement.innerText =`${ data.main.humidity}%`;
    windSpeedElement.innerText = `${data.wind.speed}km/h`;
    const rainValue = data.rain ? data.rain['1h'] : 0;
    precipitationElement.innerText =`${rainValue} mm`;
    windSpeedElement.dataset.base = String(extractNumber(windSpeedElement.innerText));
    precipitationElement.dataset.base = String(extractNumber(precipitationElement.innerText));

    updateUnitsUIOnly();
}
function updateDailyForecastUI(forecastData){
    const dailyForecastContainer = document.getElementById('forecast-day-container');
    dailyForecastContainer.innerHTML = ''; 
    const dailyData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const shortDayName = dayName.slice(0, 3);
        const selectedDay = day.dt_txt.split(' ')[0];
        const dayHours = forecastData.list.filter(item => item.dt_txt.startsWith(selectedDay));
        const allTemps = dayHours.map(item => item.main.temp);
        const maxTemp = Math.max(...allTemps);
        const minTemp = Math.min(...allTemps);
        const max = `${Math.round(maxTemp)}`;
        const min = `${Math.round(minTemp)}`;
        const iconCode = day.weather[0].icon;
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
        <div class="daily-weather">
            <div class="forecast-day">${shortDayName}</div>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${day.weather[0].description}" class="forecast-icon">
            <div class="forecast-temp">
                <span class="temp-max">${max}°</span>
                <span class="temp-min">${min}°</span>
            </div>
        </div>
        `;
        dailyForecastContainer.appendChild(forecastItem);       
        
    });  

}

function updateHourlyForecastUI(forecastData){
    const hourlyForecastContainer = document.getElementById('forecast-hour-container');
    hourlyForecastContainer.innerHTML = '';
    const hourlyData = forecastData.list.slice(0, 8);
    hourlyData.forEach(hour => {
        const date = new Date(hour.dt * 1000);
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric'});
        const temp = `${Math.round(hour.main.temp)}`;
        const iconCode = hour.weather[0].icon;
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
        <div class="hourly-weather">
            <div class="forecast-time-icon">
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${hour.weather[0].description}" class="forecast-icon">
                <div class="forecast-time">${time}</div>
            </div>
            
            <div class="forecast-temp">${temp}°</div>
        </div>
        `;
        hourlyForecastContainer.appendChild(forecastItem);
    });
}

let globalForecastData = [];
function setupDaysDropdown(forecastData){
    globalForecastData = forecastData.list;
    const daysList = document.getElementById('daysList');
    const dropdownHeader = document.querySelector('.dropdown-day-header');
    daysList.innerHTML = '';
    const uniqueDays =[];
    const seenDates = new Set();
    forecastData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!seenDates.has(date)) {
            seenDates.add(date);
            uniqueDays.push(date);
        }
    });
    uniqueDays.forEach(day => {
        const date = new Date(day);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dropdownItem = document.createElement('div');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.innerText = dayName;
        dropdownItem.addEventListener('click', () => {
            const selectedDay = day;
            const dropdownHeader = document.querySelector('.dropdown-day-header');
            dropdownHeader.innerText = dayName;
            const dayHours = forecastData.list.filter(item => item.dt_txt.startsWith(selectedDay));
            updateHourlyForecastUI({ list: dayHours });
        });
        daysList.appendChild(dropdownItem);
    });
    document.getElementById('daysDropdown').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('daysDropdown').classList.toggle('active');
    });
    window.addEventListener('click', (e) => {
        if (!document.getElementById('daysDropdown').contains(e.target)) {
            document.getElementById('daysDropdown').classList.remove('active');
        }
    });

}
function filtreHourlyByDay(selectedDay){
    const filtered = globalForecastData.filter(item => {
        const itemDay = new Date(item.dt * 1000).toLocaleDateString('en-US',{
            weekday: 'long',
        });
        return itemDay === selectedDay;
    });
    updateHourlyForecastUI({ list: filtered });
}