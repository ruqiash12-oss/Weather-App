let bgVideo;


function setWeatherMedia(mainWeather, isNight) {
  const key = (mainWeather || '').toLowerCase();

  const map = {
    clear: {
      dayVideo: './assets/media/clear.webm',
      nightVideo: './assets/media/clear-night.webm',
    },
    clouds: {
      dayVideo: './assets/media/clouds-day.webm',
      nightVideo: './assets/media/clouds-night.webm',
    },
    rain: {
      dayVideo: './assets/media/rain.webm',
      nightVideo: './assets/media/rain-night.webm',
    },
    snow: {
      dayVideo: './assets/media/snow.webm',
      nightVideo: './assets/media/snow-night.webm',
    },
    thunderstorm: {
      dayVideo: './assets/media/storm.webm',
      nightVideo: './assets/media/storm-night.webm',
    },
    drizzle: {
      dayVideo: './assets/media/rain.webm',
      nightVideo: './assets/media/rain-night.webm',
    },
    mist: {
      dayVideo: './assets/media/mist.webm',
      nightVideo: './assets/media/mist-night.webm',
    },
    haze: {
      dayVideo: './assets/media/mist.webm',
      nightVideo: './assets/media/mist-night.webm',
    },
    fog: {
      dayVideo: './assets/media/mist.webm',
      nightVideo: './assets/media/mist-night.webm',
    },
  };

  const fallback = {
    dayVideo: './assets/media/default.webm',
    nightVideo: './assets/media/default-night.webm',
  };

  const chosen = map[key] || fallback;
  const videoSrc = isNight ? chosen.nightVideo : chosen.dayVideo;

  if (bgVideo && bgVideo.dataset.src !== videoSrc) {
    bgVideo.dataset.src = videoSrc;
    bgVideo.src = videoSrc;
    bgVideo.play().catch(() => {});
  }
  
  }
function initWeatherMedia(options = {}) {
  const {
    videoSelector = '#bg-video',
    defaultVolume = 0.35,
  } = options;

  bgVideo = document.querySelector(videoSelector);
}

export { initWeatherMedia, setWeatherMedia };