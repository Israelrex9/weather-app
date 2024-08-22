const identity = document.getElementById("location-date")
const mainCelsius = document.getElementById("main-celsius")
const weatherIcon = document.getElementById("weather-icon")
const weatherType = document.getElementById("weather-type")
const mainInfo = document.getElementById("main-info")
const form = document.getElementById("form")
const input = document.getElementById("input")
const formButton = document.getElementById("button")
const favButton = document.getElementById("button-fav")


// when user is typing in the inputfield display the favourite button and when user is not typing hide the favourite button
input.addEventListener("input", function(event){
    event.preventDefault()

    if (input.value.length > 0){
        favButton.style.display = "flex"
        input.style.background = "rgba(255, 255, 255, 0.10);"
    }else{
        favButton.style.display = "none"
    }

})


//collect user input use it to run the fetch for the weather api, dynamically edit the main info div

form.addEventListener("submit", function(event){
    event.preventDefault()


    let mainCity = input.value
    let APIKEY = "ef0d7607277403f9368349363665446b"

    function weatherData(){
        let endPoint = `https://api.openweathermap.org/data/2.5/weather?q=${mainCity}&appid=${APIKEY}`

        fetch(endPoint).then((data)=>{
            return data.json()
        }).then((weatherInfo)=>{
            printMainData(weatherInfo)
            console.log(weatherInfo)
        })

        
    }
    weatherData()
    

    function printMainData(weatherInfo){
        let temperature = weatherInfo.main.temp
        let convertTemp = (temperature - 273.25).toFixed()

        weatherType.innerText = weatherInfo.weather[0].main

        // weatherIcon.innerText = "./icons/clouds.svg"

        changeIcon()
        changeImg()

        mainCelsius.innerText = `${convertTemp}°C`

        let city = weatherInfo.name
        let country = weatherInfo.sys.country

        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

        const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const date = new Date();
        const month = months[date.getMonth()];
        const day = date.getDate();
        const dayOfWeek = weekDay[date.getDay()];


        identity.innerText = `${city}, ${country} (${month} ${day}, ${dayOfWeek})`

        function changeIcon(){
            if(weatherType.innerText === "Rain"){
                weatherIcon.src = "./icons/rain.svg"
            }else if(weatherType.innerText === "Clouds"){
                weatherIcon.src = "./icons/cloud.svg"
            }else if(weatherType.innerText === "Snow"){
                weatherIcon.src = "./icons/snow.svg"
            }else if(weatherType.innerText === "Sunshine"){
                weatherIcon.src = "./icons/sunshine.svg"
            }else{
                weatherIcon.src = "./icons/thunder.svg"
            }
        }

        function changeImg(){
            if(weatherType.innerText === "Rain"){
                mainInfo.style.backgroundImage = "url('./images/rain.png')"
            }else if(weatherType.innerText === "Clouds"){
                mainInfo.style.backgroundImage = "url('./images/cloudy.png')"
            }else if(weatherType.innerText === "Snow"){
                mainInfo.style.backgroundImage = "url('./images/snow.png')"
            }else if(weatherType.innerText === "Sunshine"){
                mainInfo.style.backgroundImage = "url('./images/sunshine.png)"
            }else{
                mainInfo.style.backgroundImage = "url('./images/thunderstorm.png')"
            }
        }
    }
    

    form.reset()
})