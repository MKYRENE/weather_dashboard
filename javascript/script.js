var apiKey = '801932c060e8adb0376ca14620291753'; // OpenWeatherMap API key

// DOM elements
var searchForm = document.getElementById('search-form');
var cityInput = document.getElementById('city-input');
var searchHistory = document.getElementById('search-history');
var currentWeather = document.getElementById('current-weather');
var forecast = document.getElementById('forecast');

// Event listener for form submission
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var city = cityInput.value.trim();
  console.log(city);
localStorage.setItem('value', city);
  if (city) {
    getWeatherData(city);
    cityInput.value = '';
  }
});

// Event listener for search history clicks
searchHistory.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    var city = e.target.textContent;
    getWeatherData(city);
  }
});

// Retrieve weather data from the API
function getWeatherData(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Make API request
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Display current weather
      var current = data.list[0];
      displayCurrentWeather(current, city);

      // Display forecast
      const forecastData = data.list.slice(1, 6);
      displayForecast(forecastData);

      // Update search history
      updateSearchHistory(city);
    })
    .catch(error => {
      console.log('Error:', error);
      alert('Failed to fetch weather data. Please try again.');
    });
}

// Display the current weather data
function displayCurrentWeather(data, city) {
    var date = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    var icon = `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">`;
    var temperature = Math.round(data.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;

    var html = `
    <h2>${city} (${date}) ${icon}</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;

  currentWeather.innerHTML = html;
}

// Display the 5-day forecast
function displayForecast(data) {
    var html = '';
  data.forEach(item => {
    var date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    var icon = `<img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="${item.weather[0].description}">`;
    var temperature = Math.round(item.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
    var windSpeed = item.wind.speed;
    var humidity = item.main.humidity;

    html += `
      <div>
        <h3>${date}</h3>
        ${icon}
        <p>Temperature: ${temperature}°C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;
  });

  forecast.innerHTML = html;
}
// Update the search history
function updateSearchHistory(city) {
    var li = document.createElement('li');
  li.textContent = city;
  searchHistory.appendChild(li);
}