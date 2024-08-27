const identity = document.getElementById("location-date");
const mainCelsius = document.getElementById("main-celsius");
const weatherIcon = document.getElementById("weather-icon");
const weatherType = document.getElementById("weather-type");
const mainInfo = document.getElementById("main-info");
const form = document.getElementById("form");
const input = document.getElementById("input");
const formButton = document.getElementById("button");
const favButton = document.getElementById("button-fav");
const cityList = document.getElementById("cities");
const weatherTypeDescription = document.getElementsByClassName("stats-fig");

// when user is typing in the inputfield display the favourite button and when user is not typing hide the favourite button
input.addEventListener("input", function (event) {
  event.preventDefault();

  if (input.value.length > 0) {
    favButton.style.display = "flex";
    input.style.background = "rgba(255, 255, 255, 0.10);";
  } else {
    favButton.style.display = "none";
  }
});

let citiesArray = [];

// Add this function to update the favorite button state
function updateFavButtonState(isFavorite) {
  if (isFavorite) {
    favButton.querySelector('path').setAttribute('fill', 'orange');
  } else {
    favButton.querySelector('path').setAttribute('fill', 'white');
  }
}

function checkCitiesArray() {
  if (citiesArray.length > 0) {
    cityList.style.display = 'flex';
  } else {
    cityList.style.display = 'none';
  }
}

fetchCityDataStored();
checkCitiesArray();

// Add this function to check if a city is already in favorites
function isCityFavorite(cityName, countryCode) {
  return citiesArray.some(city => city.cityName === cityName && city.cityCountry === countryCode);
}

//collect user input use it to run the fetch for the weather api, dynamically edit the main info div
form.addEventListener("submit", function (event) {
  event.preventDefault();

  let mainCity = input.value;
  let APIKEY = "ef0d7607277403f9368349363665446b";

  function weatherData() {
    let endPoint = `https://api.openweathermap.org/data/2.5/weather?q=${mainCity}&appid=${APIKEY}`;

    fetch(endPoint)
      .then((data) => {
        return data.json();
      })
      .then((weatherInfo) => {
        printMainData(weatherInfo);
        updateFavButtonState(isCityFavorite(weatherInfo.name, weatherInfo.sys.country));
      });
  }
  weatherData();

  function printMainData(weatherInfo) {
    let temperature = weatherInfo.main.temp;
    let convertTemp = (temperature - 273.25).toFixed();

    let humidity = weatherInfo.main.humidity;
    let pressure = weatherInfo.main.pressure;

    weatherType.innerText = weatherInfo.weather[0].main;
    weatherTypeDescription.innerText = weatherInfo.weather[0].description;

    // weatherIcon.innerText = "./icons/clouds.svg"

    changeIcon();
    changeImg();

    mainCelsius.innerText = `${convertTemp}°C`;

    let city = weatherInfo.name;
    let country = weatherInfo.sys.country;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const weekDay = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const date = new Date();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const dayOfWeek = weekDay[date.getDay()];

    identity.innerText = `${city}, ${country} (${month} ${day}, ${dayOfWeek})`;

    function changeIcon() {
      if (weatherType.innerText === "Rain") {
        weatherIcon.src = "./icons/rain.svg";
      } else if (weatherType.innerText === "Clouds") {
        weatherIcon.src = "./icons/cloud.svg";
      } else if (weatherType.innerText === "Snow") {
        weatherIcon.src = "./icons/snow.svg";
      } else if (weatherType.innerText === "Sunshine") {
        weatherIcon.src = "./icons/sunshine.svg";
      } else {
        weatherIcon.src = "./icons/thunder.svg";
      }
    }

    function changeImg() {
      if (weatherType.innerText === "Rain") {
        mainInfo.style.backgroundImage = "url('./images/rain.png')";
      } else if (weatherType.innerText === "Clouds") {
        mainInfo.style.backgroundImage = "url('./images/cloudy.png')";
      } else if (weatherType.innerText === "Snow") {
        mainInfo.style.backgroundImage = "url('./images/snow.png')";
      } else if (weatherType.innerText === "Sunshine") {
        mainInfo.style.backgroundImage = "url('./images/sunshine.png')";
      } else {
        mainInfo.style.backgroundImage = "url('./images/thunderstorm.png')";
      }
    }

    //when the favButton is clicked, push some data into the citiesArray[]
    favButton.addEventListener("click", function () {
      const city = document.querySelector("#location-date").innerText.split(',')[0].trim();
      const country = document.querySelector("#location-date").innerText.split(',')[1].split('(')[0].trim();
      const temp = document.querySelector("#main-celsius").innerText.split('°')[0];
      const weatherDescription = document.querySelector("#weather-type").innerText;
      const weatherIconSrc = document.querySelector("#weather-icon").src;

      if (isCityFavorite(city, country)) {
        // Remove from favorites
        citiesArray = citiesArray.filter(cityData => !(cityData.cityName === city && cityData.cityCountry === country));
        updateFavButtonState(false);
      } else {
        // Add to favorites
        const cityData = {
          cityName: city,
          cityCountry: country,
          temp: temp,
          cityHumid: "N/A", // You might want to add this data to the main display
          cityPressure: "N/A", // You might want to add this data to the main display
          weatherICON: weatherIconSrc,
          weatherDescription: weatherDescription,
          weatherType: weatherDescription,
        };

        addToFavorites(cityData);
      }

      localStorage.setItem("cityDataStored", JSON.stringify(citiesArray));
      printFavoriteCities();
      checkCitiesArray();
    });
  }

  form.reset();
  fetchCityDataStored();
  checkCitiesArray();
});

// Add this function to add a city to favorites
function addToFavorites(cityData) {
  if (citiesArray.length >= 5) {
    citiesArray.pop(); // Remove the oldest city if the list is full
  }
  citiesArray.unshift(cityData); // Add new city to the beginning of the array
  localStorage.setItem('favoriteCities', JSON.stringify(citiesArray));
  printFavoriteCities();
  checkCitiesArray();
}

//grab the citydatastored and push to the array
function fetchCityDataStored() {
  if (localStorage.getItem("cityDataStored")) {
    citiesArray = JSON.parse(localStorage.getItem("cityDataStored"));
  }

  printFavoriteCities();
}

function printFavoriteCities() {
  cityList.innerHTML = ''; // Clear existing list
  citiesArray.forEach((city, index) => {
    if (index < 5) {
      let cityDataFav = document.createElement("div");
      cityDataFav.classList.add("city");

      let favCity = document.createElement("p");
      favCity.classList.add("stats-city");
      favCity.textContent = `${city.cityName}, ${city.cityCountry}`;

      let cityTemp = document.createElement("h2");
      cityTemp.textContent = `${city.temp}°C`;

      let cityCardMainDetails = document.createElement("div");
      cityCardMainDetails.classList.add("city-card-main-details");

      const weatherIcon = document.createElement("img");
      weatherIcon.src = city.weatherICON;

      const describeWeather = document.createElement("p");
      describeWeather.textContent = city.weatherDescription;

      cityCardMainDetails.append(weatherIcon, describeWeather);

      const cityCardMain = document.createElement("div");
      cityCardMain.classList.add("city-card-main");
      cityCardMain.append(cityTemp, cityCardMainDetails);

      const statsFig = document.createElement("h3");
      statsFig.classList.add("stats-fig");
      statsFig.textContent = city.cityHumid;

      const statsDetail = document.createElement("h3");
      statsDetail.classList.add("detail");
      statsDetail.textContent = "Humidity";

      const statsHumidity = document.createElement("div");
      statsHumidity.classList.add("stats-humidity");
      statsHumidity.append(statsFig, statsDetail);

      const statsFig1 = document.createElement("h3");
      statsFig1.classList.add("stats-fig1");
      statsFig1.textContent = city.cityPressure;

      const statsDetail1 = document.createElement("h3");
      statsDetail1.classList.add("detail1");
      statsDetail1.textContent = "Pressure";

      const statsPressure = document.createElement("div");
      statsPressure.classList.add("stats-pressure");
      statsPressure.append(statsFig1, statsDetail1);

      const stats = document.createElement("div");
      stats.classList.add("stats");
      stats.append(statsHumidity, statsPressure);
  
      const statsMobile = document.createElement("p");
      statsMobile.classList.add("stats-mobile");
      statsMobile.textContent = city.cityName;

      cityDataFav.append(favCity, cityCardMain, stats, statsMobile);
      cityList.appendChild(cityDataFav);
    }
  });

  checkCitiesArray();
}

fetchCityDataStored()