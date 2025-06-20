const apiKey = '6ca4cdf82b2ecae9b043ddf339c8daad'; // Replace with your OpenWeatherMap API key

// Mobile DOM elements
const cityInputMobile = document.getElementById('city-input');
const searchBtnMobile = document.getElementById('search-btn');
const weatherIconMobile = document.getElementById('weather-icon');
const temperatureMobile = document.getElementById('temperature');
const cityMobile = document.getElementById('city');
const descriptionMobile = document.getElementById('description');
const windMobile = document.getElementById('wind');
const humidityMobile = document.getElementById('humidity');
const pressureMobile = document.getElementById('pressure');


// tab DOM elements
const cityInputTab = document.getElementById('tab-city');
const searchBtnTab = document.querySelector('.search-btn');
const weatherIconTab = document.querySelector('.weather-icon-tab');
const tempTab = document.querySelector('.temp');
const cityTab = document.querySelector('.city_name');
const feelsLikeTab = document.querySelector('.feels-like');
const weatherCard = document.querySelector('.weather-card');
const tabDetails = document.querySelectorAll('.tab-weather-details div span:last-child')



// loading screen
// Show loading overlay
function showLoading() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);
}
// Hide loading overlay
function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) overlay.remove();
}


// it Fetch Weather Data 
async function getWeatherData(cityName) {
    showLoading(); // Show loading before fetch
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        console.log('Fetched Weather Data:', data); //  This logs the full data object
        updateWeatherUI(data);
    } catch (error) {
        alert(error.message);
    } finally {
        hideLoading(); // 👉 Always hide loading, success or fail
    }
}
// dummy data
//  const dummyData = {
//         weather: [{ icon: '01d', description: 'clear sky' }],
//         main: { temp: 25, humidity: 40, pressure: 1012 },
//         wind: { speed: 3 },
//         name: 'Mock City'
//     };
//     updateWeatherUI(dummyData);

// it displays all the data ,  Update both UIs
function updateWeatherUI(data) {
    const iconCode = data.weather[0].icon;

    //  Mobile Update 
    if (temperatureMobile) {
        // weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIconMobile.src = `../asset/icons/${iconCode}@2x.png`;
        temperatureMobile.textContent = `${Math.round(data.main.temp)}°C`;
        const countryName = countryMap[data.sys.country] || data.sys.country;
        cityMobile.textContent = `${data.name}, ${countryName}`;
        descriptionMobile.textContent = data.weather[0].description;
        windMobile.textContent = `Wind: ${Math.round(data.wind.speed * 3.6)} km/h`;
        humidityMobile.textContent = `Humidity: ${data.main.humidity}%`;
        pressureMobile.textContent = `Pressure: ${data.main.pressure} hPa`;

    }

    //  Tab Update 
    if (weatherCard) {
        const countryName = countryMap[data.sys.country] || data.sys.country;
        cityTab.textContent = `${data.name}, ${countryName}`;
        tempTab.textContent = `+${Math.round((data.main.temp))}°C`;
        weatherIconTab.src = `../asset/icons/${iconCode}@2x.png`;
        feelsLikeTab.textContent = `${data.weather[0].description},feels like +${Math.round(data.main.feels_like)}°C`;

        const [
            windSpeed,
            cloudiness,
            gust,
            visibility,
            humidity,
            pressure,
            sunrise,
            sunset
        ] = tabDetails;

        windSpeed.textContent = `${data.wind.speed} m/s`;
        cloudiness.textContent = `${data.clouds.all}%`;
        gust.textContent = data.wind.gust ? `${data.wind.gust} m/s` : '—';
        visibility.textContent = `${data.visibility} m`;
        humidity.textContent = `${data.main.humidity}%`;
        pressure.textContent = `${data.main.pressure} hPa`;


        // for sun set ans sun rise 
        const formatTime = (unixTime, timezoneOffset) => {
            const localUnix = unixTime + timezoneOffset; // Adjust UTC by city's offset
            const localDate = new Date(localUnix * 1000); // Convert to JS Date
            const hours = localDate.getUTCHours();
            const minutes = localDate.getUTCMinutes();
            const formattedHours = hours % 12 || 12;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        };

        sunrise.textContent = formatTime(data.sys.sunrise, data.timezone);
        sunset.textContent = formatTime(data.sys.sunset, data.timezone);

        //for local location time   
        function updateCityLocalTime(timezoneOffsetInSeconds) {
            const nowUTC = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000); // Convert current time to UTC
            const cityTime = new Date(nowUTC.getTime() + timezoneOffsetInSeconds * 1000);

            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const day = days[cityTime.getDay()];
            const hours = cityTime.getHours().toString().padStart(2, '0');
            const minutes = cityTime.getMinutes().toString().padStart(2, '0');

            const formattedTime = `Local time: ${day}, ${hours}:${minutes}`;
            const localTimeEl = document.querySelector('.time');
            if (localTimeEl) {
                localTimeEl.textContent = formattedTime;
            }
        }
        // calling function 
        updateCityLocalTime(data.timezone);

    }
}

// ---Event Listeners---

// if  user clicks the button it will trigger and pass the city name to the getWeatherData function
// Mobile
searchBtnMobile?.addEventListener('click', () => {
    const cityName = cityInputMobile.value.trim();
    if (cityName) {
        getWeatherData(cityName);
    }
});

// Tab
searchBtnTab?.addEventListener('click', () => {
    const cityName = cityInputTab.value.trim();
    if (cityName) getWeatherData(cityName);
});


// if  user presses Enter in the input field it will trigger and pass the city name to the getWeatherData function
// Mobile
cityInputMobile?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cityName = cityInputMobile.value.trim();
        if (cityName) {
            getWeatherData(cityName);
        }
    }
});

//tab
cityInputTab?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cityName = cityInputTab.value.trim();
        if (cityName) getWeatherData(cityName);
    }
});


// time function
function updateLocalTime() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[now.getDay()];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const formattedTime = `Local time: ${day}, ${hours}:${minutes}`;
    const localTimeEl = document.querySelector('.local-time');
    if (localTimeEl) {
        localTimeEl.textContent = formattedTime;
    }
}

// Run once at load , calling it 
updateLocalTime();

// Then sync to start of next full minute
setTimeout(() => {
    updateLocalTime();
    setInterval(updateLocalTime, 60000);
}, (60 - new Date().getSeconds()) * 1000);
