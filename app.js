document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "qWu4cJZzcUMpCe76Nt8G704Gr0PBpnYA"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchDailyForecast(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchTwelveHourForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML = `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchTwelveHourForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    displayTwelveHourForecast(data);
                } else {
                    weatherDiv.innerHTML = `<p>No 12-hour forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 12-hour forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching 12-hour forecast data.</p>`;
            });
    }

    function displayCurrentWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherIcon = data.WeatherIcon;
        const weatherContent = `
            <div class="current-weather">
                <h2>Current Weather</h2>
                <div class="weather-detail">
                    <p>${temperature}°C</p>
                    <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' : ''}${weatherIcon}-s.png" alt="${weather}" class="weather-icon">
                    <p>${weather}</p>
                </div>
            </div>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayDailyForecast(data) {
        let forecastContent = `<div class="daily-forecast"><h2>Daily Forecast</h2><div class="forecast-section">`;
        data.forEach(day => {
            const date = new Date(day.Date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
            const tempMin = day.Temperature.Minimum.Value;
            const tempMax = day.Temperature.Maximum.Value;
            const weather = day.Day.IconPhrase;
            const weatherIcon = day.Day.Icon;
            forecastContent += `
                <div class="weather-detail">
                    <p><strong>${date}</strong></p>
                    <p>${tempMax}°C / ${tempMin}°C</p>
                    <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' : ''}${weatherIcon}-s.png" alt="${weather}" class="weather-icon">
                    <p>${weather}</p>
                </div>
            `;
        });
        forecastContent += `</div></div>`;
        weatherDiv.innerHTML += forecastContent;
    }

    function displayHourlyForecast(data) {
        let forecastContent = `<div class="hourly-forecast"><h2>Hourly Forecast</h2><div class="forecast-section">`;
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            const weatherIcon = hour.WeatherIcon;
            forecastContent += `
                <div class="weather-detail">
                    <p><strong>${time}</strong></p>
                    <p>${temperature}°C</p>
                    <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' : ''}${weatherIcon}-s.png" alt="${weather}" class="weather-icon">
                    <p>${weather}</p>
                </div>
            `;
        });
        forecastContent += `</div></div>`;
        weatherDiv.innerHTML += forecastContent;
    }

    function displayTwelveHourForecast(data) {
        let forecastContent = `<div class="twelve-hour-forecast"><h2>12-Hour Forecast</h2><div class="forecast-section">`;
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            const weatherIcon = hour.WeatherIcon;
            forecastContent += `
                <div class="weather-detail">
                    <p><strong>${time}</strong></p>
                    <p>${temperature}°C</p>
                    <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' : ''}${weatherIcon}-s.png" alt="${weather}" class="weather-icon">
                    <p>${weather}</p>
                </div>
            `;
        });
        forecastContent += `</div></div>`;
        weatherDiv.innerHTML += forecastContent;
    }
});
