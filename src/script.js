let cityTempC;

let apiKey = '3c9531b76267799b3c856843d5e623c0';
let baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

let weatherInfo = document.querySelector('#weatherInfo');
let searchCityForm = document.querySelector('#searchCityForm');
let currentBtn = document.querySelector('#current_btn');
let currentLocation = document.querySelector('#current_location');
let city = document.querySelector('#city');
let currentIcon = document.querySelector('#current_icon');
let currentTemp = document.querySelector('#currentTemp');
let degreeF = document.querySelector('#degreeF');
let degreeC = document.querySelector('#degreeC');
// let precipitation = document.querySelector('#precipitation');
// let feelsLike = document.querySelector('#feels_like');
let humidity = document.querySelector('#humidity');
let wind = document.querySelector('#wind');
let currentDescription = document.querySelector('#currentDescription');
let todayDate = document.querySelector('#today_day');
let currentTime = document.querySelector('#current_time');

let days = ['sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'saturday'];

weatherInfo.style.display = "none";
currentLocation.style.display = "none";


searchCityForm.addEventListener('submit', getWeather);
function getWeather(event){
  event.preventDefault();
  currentLocation.style.display = "none";
  let cityName =  document.querySelector('#searchCityForm [type="search"]').value.trim().toLocaleLowerCase();
  if(cityName){
    let weatherApi = `${baseUrl}?q=${cityName}&units=metric&appid=${apiKey}`;
    axios.get(weatherApi).then(processResponse).catch(function (error) {
      // handle error
      console.log(error);
      alert(error.message);
    });
  }
}

degreeC.addEventListener('click', activateCentigrade);
function activateCentigrade() {
  currentTemp.innerHTML = cityTempC;
  degreeF.classList.remove('fw-bold', 'text-dark');
  degreeF.classList.add('text-primary', 'opacity-75');
  degreeC.classList.remove('text-primary');
  degreeC.classList.add('fw-bold', 'text-dark', 'opacity-100');
}

degreeF.addEventListener('click', activateFahrenheit);
function activateFahrenheit() {
  let cityTempF = convertToFahrenheit(cityTempC);
  currentTemp.innerHTML = cityTempF;
  degreeC.classList.remove('fw-bold', 'text-dark');
  degreeC.classList.add('text-primary', 'opacity-75');
  degreeF.classList.remove('text-primary');
  degreeF.classList.add('fw-bold', 'text-dark', 'opacity-100');
  
}

// converts the temperature unit
function convertToFahrenheit(c) {
  return Math.round(9/5 * c + 32);
}

// gets weather response from a weather api
function processResponse(response){
  cityTempC = Math.round(response.data.main.temp);
  currentTemp.innerHTML = cityTempC;
  let systemDateObj = new Date(response.data.dt);
  let timezoneOffset = systemDateObj.getTimezoneOffset() * 60; //*1 --> 'UTC' relative to 'system'
  setDateTime((response.data.dt + timezoneOffset + response.data.timezone) * 1000); //*2
  // precipitation.innerHTML = response.data.main;
  // feelsLike.innerHTML = response.data.main.feels_like;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = response.data.wind.speed;
  currentDescription.innerHTML = response.data.weather[0].description;
  city.innerHTML = response.data.name;
  currentIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="weather icon">`;
  weatherInfo.style.display = "block";
}

// --------------------------------------------------------------
// on pressing 'Current' button
currentBtn.addEventListener('click', getCurrentLocationData);

function getCurrentLocationData(){
  navigator.geolocation.getCurrentPosition(getCurrentLocationWeather);
}

// gets data from api for current location
function getCurrentLocationWeather(position){
  let currentLat = position.coords.latitude;
  let currentLong = position.coords.longitude;
  if(typeof currentLat !== 'undefined' && typeof currentLong !== 'undefined'){
    let weatherApi = `${baseUrl}?lat=${currentLat}&lon=${currentLong}&units=metric&appid=${apiKey}`;
    axios.get(weatherApi).then(processResponse).catch(function (error) {
      // handle error
      console.log(error);
      alert(error.message);
    });;
  }
  populateCurrentLocationElem(currentLat, currentLong);
}

// populates the elements related to the current location
function populateCurrentLocationElem(latP, longP){
  let currentLatElem = document.getElementById('current_lat');
  let currentLongElem = document.getElementById('current_long');
  currentLatElem.innerHTML = latP;
  currentLongElem.innerHTML = longP;
  currentLocation.style.display = "block";
}

// --------------------------------------------------------------
// populates the elements related to the current time & date
function setDateTime(timeStamp){
  let dateObj = new Date(timeStamp); 
  todayDate.innerHTML = days[dateObj.getDay()];
  let minutes = dateObj.getMinutes();
  currentTime.innerHTML = dateObj.getHours() + ':' + (minutes >= 10 ? minutes : `0${minutes}`);
}


//1-  getTimezoneOffset() returns the difference between UTC time and local time. It returns the difference in minutes.
//2-  timezone: Shift in seconds from UTC
