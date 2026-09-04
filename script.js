const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");

const cityName = document.getElementById("cityName");
const description = document.getElementById("description");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const weatherStatus = document.getElementById("weatherStatus");
const weatherIcon = document.getElementById("weatherIcon");


// Search button
searchBtn.addEventListener("click", getWeather);


// Enter key
cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


// Main function
async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }


    showLoading();


    try {

        // --------------------------------
        // STEP 1: Find city coordinates
        // --------------------------------

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        const geoResponse = await fetch(geoURL);


        if (!geoResponse.ok) {
            throw new Error("Location service is unavailable.");
        }


        const geoData = await geoResponse.json();


        // City not found

        if (!geoData.results ||
            geoData.results.length === 0) {

            throw new Error(
                "City not found. Please enter a valid city."
            );
        }


        const location = geoData.results[0];


        const latitude = location.latitude;
        const longitude = location.longitude;


        // --------------------------------
        // STEP 2: Get weather
        // --------------------------------

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;


        const weatherResponse =
            await fetch(weatherURL);


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to fetch weather data."
            );
        }


        const weatherData =
            await weatherResponse.json();


        // --------------------------------
        // STEP 3: Read current weather
        // --------------------------------

        const current = weatherData.current;


        // --------------------------------
        // STEP 4: Display data
        // --------------------------------

        cityName.textContent =
            `${location.name}, ${location.country}`;


        temperature.textContent =
            current.temperature_2m;


        humidity.textContent =
            `${current.relative_humidity_2m}%`;


        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;


        const weatherInfo =
            getWeatherInfo(current.weather_code);


        description.textContent =
            weatherInfo.description;


        weatherStatus.textContent =
            weatherInfo.status;


        weatherIcon.textContent =
            weatherInfo.icon;


        message.textContent = "";


    }

    catch (error) {

        console.error(error);

        showError(error.message);

    }

}


// Loading message

function showLoading() {

    message.textContent =
        "⏳ Loading weather data...";

    message.className = "loading";

}


// Error message

function showError(text) {

    message.className = "";

    message.textContent =
        "❌ " + text;

}


// Weather code function

function getWeatherInfo(code) {

    const weather = {

        0: {
            icon: "☀️",
            description: "Clear sky",
            status: "Clear"
        },

        1: {
            icon: "🌤️",
            description: "Mainly clear",
            status: "Clear"
        },

        2: {
            icon: "⛅",
            description: "Partly cloudy",
            status: "Cloudy"
        },

        3: {
            icon: "☁️",
            description: "Overcast",
            status: "Cloudy"
        },

        45: {
            icon: "🌫️",
            description: "Foggy",
            status: "Fog"
        },

        48: {
            icon: "🌫️",
            description: "Fog",
            status: "Fog"
        },

        51: {
            icon: "🌦️",
            description: "Light drizzle",
            status: "Drizzle"
        },

        53: {
            icon: "🌦️",
            description: "Moderate drizzle",
            status: "Drizzle"
        },

        55: {
            icon: "🌧️",
            description: "Heavy drizzle",
            status: "Drizzle"
        },

        61: {
            icon: "🌧️",
            description: "Slight rain",
            status: "Rain"
        },

        63: {
            icon: "🌧️",
            description: "Moderate rain",
            status: "Rain"
        },

        65: {
            icon: "🌧️",
            description: "Heavy rain",
            status: "Rain"
        },

        71: {
            icon: "🌨️",
            description: "Slight snow",
            status: "Snow"
        },

        73: {
            icon: "🌨️",
            description: "Moderate snow",
            status: "Snow"
        },

        75: {
            icon: "❄️",
            description: "Heavy snow",
            status: "Snow"
        },

        80: {
            icon: "🌦️",
            description: "Rain showers",
            status: "Rain"
        },

        81: {
            icon: "🌧️",
            description: "Moderate rain showers",
            status: "Rain"
        },

        82: {
            icon: "⛈️",
            description: "Heavy rain showers",
            status: "Rain"
        },

        95: {
            icon: "⛈️",
            description: "Thunderstorm",
            status: "Storm"
        }

    };


    return weather[code] || {

        icon: "🌤️",

        description: "Unknown weather",

        status: "Unknown"

    };

}