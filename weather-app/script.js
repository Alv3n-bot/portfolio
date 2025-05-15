const wrapper = document.querySelector(".wrapper");
const inputPart = document.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button");
const weatherPart = wrapper.querySelector(".weather-part");
const wIcon = weatherPart.querySelector("img");
const unitToggle = document.querySelector("#unit-toggle");
let api;

const apiKey = "2a1cfe814a6a4c02bee145614251801";
let isMetric = true;

inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation api");
    }
});

unitToggle.addEventListener("click", () => {
    isMetric = !isMetric;
    if(weatherPart.style.display === "block") {
        // Re-fetch weather with new unit
        const city = weatherPart.querySelector(".location span").textContent.split(",")[0];
        requestApi(city);
    }
});

function requestApi(city) {
    // Get current weather
    api = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no`;
    fetchData();
}

function onSuccess(position) {
    const {latitude, longitude} = position.coords;
    api = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3&aqi=no`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    
    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            weatherDetails(result);
        })
        .catch(error => {
            console.error('Error:', error);
            infoTxt.innerText = "Something went wrong: " + error.message;
            infoTxt.classList.replace("pending", "error");
        });
}

function weatherDetails(info) {
    if(info.error) {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = info.error.message || `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.location.name;
        const country = info.location.country;
        const current = info.current;
        const forecast = info.forecast.forecastday;

        // Update current weather
        wIcon.src = 'https:' + current.condition.icon;
        const temp = isMetric ? current.temp_c : current.temp_f;
        const feels_like = isMetric ? current.feelslike_c : current.feelslike_f;
        const unit = isMetric ? 'C' : 'F';
        const windSpeed = isMetric ? current.wind_kph + ' km/h' : (current.wind_mph + ' mph');

        weatherPart.querySelector(".temp .numb").innerText = Math.round(temp);
        weatherPart.querySelector(".temp .unit").innerText = unit;
        weatherPart.querySelector(".weather").innerText = current.condition.text;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".feels-like").innerText = `${Math.round(feels_like)}°${unit}`;
        weatherPart.querySelector(".humidity").innerText = `${current.humidity}%`;
        weatherPart.querySelector(".wind-speed").innerText = windSpeed;

        // Update forecast
        const forecastContainer = weatherPart.querySelector(".forecast-container");
        forecastContainer.innerHTML = forecast.slice(1).map(day => `
            <div class="forecast-day">
                <div class="date">${formatDate(day.date)}</div>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                <div class="temp">
                    ${Math.round(isMetric ? day.day.avgtemp_c : day.day.avgtemp_f)}°${unit}
                </div>
            </div>
        `).join('');
        
        infoTxt.classList.remove("pending", "error");
        weatherPart.style.display = "block";
        infoTxt.innerText = "";
        inputField.value = "";
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
} 