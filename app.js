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

function checkCitiesArray() {
  if (citiesArray === 0) {
    cityList.style.display = "none";
  } else {
    cityList.style.display = "flex";
  }
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
        mainInfo.style.backgroundImage = "url('./images/sunshine.png)";
      } else {
        mainInfo.style.backgroundImage = "url('./images/thunderstorm.png')";
      }
    }

    //when the favButton is clicked, push some data into the citiesArray[]
    favButton.addEventListener("click", function () {
      // let temperature = weatherInfo.main.temp
      // let convertTemp = (temperature - 273.25).toFixed()
      // let humidity = weatherInfo.main.humidity
      // let pressure = weatherInfo.main.pressure
      const cityData = {
        cityName: city,
        cityCountry: country,
        temp: convertTemp,
        cityHumid: humidity,
        cityPressure: pressure,
        weatherICON: weatherIcon.src,
        weatherDescription: weatherTypeDescription,
        weatherType: weatherType, //calling this information, to identify the right weather icon
      };

      citiesArray.push(cityData);

      localStorage.setItem("cityDataStored", JSON.stringify(citiesArray));
    });
  }

  form.reset();
  fetchCityDataStored();
  checkCitiesArray();
});

//grab the citydatastored and push to the array
function fetchCityDataStored() {
  if (localStorage.getItem("cityDataStored")) {
    citiesArray = JSON.parse(localStorage.getItem("cityDataStored"));
  }

  printFavoriteCities();
}

function printFavoriteCities() {
  cityList.classList.add("cities");

  checkCitiesArray();

  let cityDataFav = document.createElement("div");
  cityDataFav.classList.add("city");

  cityList.append(cityDataFav);

  let favCity = document.createElement("p");
  favCity.classList.add("stats-city");
  favCity.textContent = "cityName";

  let cityTemp = document.createElement("h2");
  cityTemp.textContent = "temp";

  let cityCardMainDetails = document.createElement("div");
  cityCardMainDetails.classList.add("city-card-main-details");

  //using weather type here so as to help identify the weather icon
  let typeOfWeather = document.createElement("p");
  typeOfWeather.textContent = "weatherType";

  const weatherIcon = document.createElement("img");
  weatherIcon.src = "weatherICON";

  const describeWeather = document.createElement("p");
  describeWeather.textContent = "weatherDescription";

  cityCardMainDetails.append(weatherIcon, describeWeather);

  const cityCardMain = document.createElement("div");
  cityCardMain.classList.add("city-card-main");
  cityCardMain.append(cityTemp, cityCardMainDetails);

  const statsFig = document.createElement("h3");
  statsFig.classList.add("stats-fig");
  statsFig.textContent = "cityHumid"

  const statsDetail = document.createElement("h3");
  statsDetail.classList.add("detail");
  statsDetail.textContent = "Humidity";

  const statsHumidity = document.createElement("div");
  statsHumidity.classList.add("stats-humidity");

  statsHumidity.append(statsFig, statsDetail)


  /////////////
  const statsFig1 = document.createElement("h3");
  statsFig.classList.add("stats-fig1");
  statsFig.textContent = "cityHumid"

  const statsDetail1 = document.createElement("h3");
  statsDetail.classList.add("detail1");
  statsDetail.textContent = "Pressure";

  const statsPressure = document.createElement("div");
  statsPressure.classList.add("stats-Pressure");

  statsPressure.append(statsFig1, statsDetail1)
  /////////////


  const stats = document.createElement("div");
  stats.classList.add("stats");
  stats.append(statsHumidity, statsPressure)
  
  const statsMobile = document.createElement("p");
  statsMobile.classList.add("stats-mobile");

  cityDataFav.append(favCity, cityCardMain, stats, statsMobile)
}


fetchCityDataStored()
