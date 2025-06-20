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


// it Fetch Weather Data 
async function getWeatherData(cityName) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        console.log('Fetched Weather Data:', data); // 👈 This logs the full data object
        updateWeatherUI(data);
    } catch (error) {
        alert(error.message);
    }

}


// it displays all the data ,  Update both UIs
function updateWeatherUI(data) {
    const iconCode = data.weather[0].icon;

    //  Mobile Update 
    if (temperatureMobile) {
        // weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIconMobile.src = `../asset/icons/${iconCode}@2x.png`;
        temperatureMobile.textContent = `${Math.round(data.main.temp)}°C`;
        cityMobile.textContent = data.name;
        descriptionMobile.textContent = data.weather[0].description;
        windMobile.textContent = `Wind: ${Math.round(data.wind.speed * 3.6)} km/h`;
        humidityMobile.textContent = `Humidity: ${data.main.humidity}%`;
        pressureMobile.textContent = `Pressure: ${data.main.pressure} hPa`;

    }

    //  Tab Update 
    if (weatherCard) {
        cityTab.textContent = data.name;
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
            seaLevel,
            groundLevel
        ] = tabDetails;

        windSpeed.textContent = `${data.wind.speed} m/s`;
        cloudiness.textContent = `${data.clouds.all}%`;
        gust.textContent = data.wind.gust ? `${data.wind.gust} m/s` : '—';
        visibility.textContent = `${data.visibility} m`;
        humidity.textContent = `${data.main.humidity}%`;
        pressure.textContent = `${data.main.pressure} hPa`;
        seaLevel.textContent = data.main.sea_level ? `${data.main.sea_level} ` : '—';
        groundLevel.textContent = data.main.grnd_level ? `${data.main.grnd_level} ` : '—';


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

// // To prevent a broken UI if image fails to load
// weatherIcon.onerror = () => {
//     weatherIcon.src = './asset/icons/default.png';
// };

//  const dummyData = {
//         weather: [{ icon: '01d', description: 'clear sky' }],
//         main: { temp: 25, humidity: 40, pressure: 1012 },
//         wind: { speed: 3 },
//         name: 'Mock City'
//     };

//     updateWeatherUI(dummyData);
