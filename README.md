# Weather Now — Frontend Mentor Weather App

A weather application built for the Frontend Mentor challenge. Search for a city, view current conditions, hourly forecast, and daily forecast. Includes unit switching and UI states (loading, empty results, API error).


## Live Site

- Live URL: https://ruqiash12-oss.github.io/Weather-App/

## Features

- Search weather by city name
- Current weather card (temperature + icon + country name)
- Additional info: feels like, humidity, wind, precipitation
- Hourly forecast (with day selector)
- Daily forecast
- Units dropdown:
  - Switch all to **Imperial/Metric**
  - Or switch **Temperature / Wind / Precipitation** individually
- App states:
  - **Loading skeleton** while fetching data
  - **No search result found** when city doesn’t exist
  - **Something went wrong + Retry** for API/network errors
- Animated background video based on weather (day/night)

## Built With

- HTML / CSS / JavaScript (ES Modules)
- [OpenWeather API](https://openweathermap.org/api)
- Google Fonts:
  - Bricolage Grotesque
  - DM Sans


## Project Structure 

```text
.
├─ index.html
├─ style.css
├─ script.js
├─ weatherMedia.js
└─ assets/
   ├─ images/
   └─ media/
```

## UI States

### Loading
When a city is searched (or on page load), skeleton placeholders are shown until the API responds.

### Empty results
If the API returns `404` for a city, the UI shows:

- "No search result found!"

### Error
If the API/network fails, the UI shows:

- "Something went wrong"
- A **Retry** button that re-fetches the last city (or default).

## Notes / Common Issues

- If the day dropdown throws an error:
  - Ensure `#daysDropdown` exists in the HTML.
  - Avoid binding click listeners repeatedly inside update functions.
- For production:
  - Consider hiding the API key (use a proxy / backend).

## Credits

Challenge by https://www.frontendmentor.io/profile/ruqiash12-oss

Coded by Ruqia Al sheikha.
