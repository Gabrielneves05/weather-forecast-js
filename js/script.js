const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    humidityStatus = document.querySelector(".humidity-status"),
    visibility = document.querySelector(".visibility"),
    visibilityStatus = document.querySelector(".visibility-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status");
    
let currentCity = ''
let currentUnit = 'c'
let hourlyorWeek = 'Week'

// Update Date Time
function getDateTime() {
    let now = new Date(),
        hour = now.getHours(), 
        minute = now.getMinutes()

    let days = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado'
    ];

    // 12 hour format
    hour = hour % 24;

    hour < 10 ? `0${hour}` : hour
    minute < 10 ? `0${minute}` : minute

    let dayString = days[now.getDay()]

    return `${dayString}, ${hour}:${minute}`
}

date.innerText = getDateTime()

// Update time every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000)

// function to get public ip with fetch
function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        currentCity = data.currentCity
        getWeatherData(data.city, currentUnit, hourlyorWeek)
    })
}

getPublicIp()

// function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {
    const apiKey = "PN2C72KS225P2G2DACLNJUBQ5";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        let today = data.currentConditions
        if(unit === 'c') {
            temp.innerText = today.temp.toFixed(0)
        } else {
            temp.innerText = celciusToFahrenheit(today.temp)
        }

        currentLocation.innerText = data.resolvedAddress
        condition.innerText = today.conditions
        rain.innerText = `Perc - ${today.precip}%`
        uvIndex.innerText = today.uvindex
        windSpeed.innerText = today.windspeed
        humidity.innerText = `${today.humidity}%`
        visibility.innerText = today.visibility
        airQuality.innerText = today.winddir

        measureUvIndex(today.uvindex)
        updateHumidityStatus(today.humidity)
        updateVisibilityStatus(today.visibility)
        updateAirQualityStatus(today.winddir)
        sunRise.innerText = convertTimeTo12HourFormat(today.sunrise)
        sunRise.innerText = convertTimeTo12HourFormat(today.sunrise)
        mainIcon.src = getIcon(today.icon)
    })
}

// convert celcius to fahrenheit
function celciusToFahrenheit(temp) {
    return ((temp*9)/ 5 + 32).toFixed(1)
}

// function to get uvindex status
function measureUvIndex(uvIndex) {
    if(uvIndex < 2) {
        uvText.innerText = 'Baixa'
    } else if(uvIndex < 5) {
        uvText.innerText = 'Moderada'
    } else if(uvIndex < 7) {
        uvText.innerText = 'Alta'
    } else if(uvIndex < 10) {
        uvText.innerText = 'Muito alta'
    } else {
        uvText.innerText = 'Extrema'
    }
}

function updateHumidityStatus(humidity) {
    if(humidity < 30) {
        humidityStatus.innerText = 'Baixa'
    } else if(humidity < 60) {
        humidityStatus.innerText = 'Moderada'
    } else {
        humidityStatus.innerText = 'Alta'
    }
}

function updateVisibilityStatus(visibility) {
    if(visibility < 0.3) {
        visibilityStatus.innerText = 'Nevoeiro denso'
    } else if(visibility < 0.16) {
        visibilityStatus.innerText = 'Nevoeiro moderado'
    } else if(visibility < 0.35) {
        visibilityStatus.innerText = 'Nevoeiro luminoso'
    } else if(visibility < 1.13) {
        visibilityStatus.innerText = 'Nevoeiro muito leve'
    } else if(visibility < 2.16) {
        visibilityStatus.innerText = 'Névoa clara'
    } else if(visibility < 5.4) {
        visibilityStatus.innerText = 'Névoa muito leve'
    } else if(visibility < 10.8) {
        visibilityStatus.innerText = 'Tempo limpo'
    } else {
        visibilityStatus.innerText = 'Tempo muito limpo'
    }
}

function updateAirQualityStatus(airQuality) {
    if(airQuality < 50) {
        airQualityStatus.innerText = 'Bom'
    } else if(airQuality < 100) {
        airQualityStatus.innerText = 'Moderada'
    } else if(airQuality < 150) {
        airQualityStatus.innerText = 'Pouco saudável para pessoas sensíveis'
    } else if(airQuality < 200) {
        airQualityStatus.innerText = 'Pouco saudável'
    } else if(airQuality < 250) {
        airQualityStatus.innerText = 'Muito pouco saudável'
    } else {
        airQualityStatus.innerText = 'Perigosa'
    }
}

function convertTimeTo12HourFormat(time) {
    let hour = time.split(':')[0]
    let minute = time.split(':')[1]
    let ampm = hour > 12 ? 'pm' : 'am'
    hour = hour & 12
    hour = hour ? hour : 12
    hour = hour < 10 ? '0' + hour : hour
    minute = minute < 10 ? '0' + minute : minute
    let strTime = `${hour}:${minute}: ${ampm}`
    return strTime
}

function getIcon(condition) {
    if(condition === 'partly-cloudy-day') {
        return 'icons/sun/4.png'
    } else if(condition === 'partly-cloudy-night') {
        return 'icons/moon/5.png'
    } else if(condition === 'rain') {
        return 'icons/rain/6.png'
    } else if(condition === 'clear-day') {
        return 'icons/sun/7.png'
    } else if(condition === 'clear-night') {
        return 'icons/moon/8.png'
    } else {
        return 'icons/moon/1.png'
    }
}