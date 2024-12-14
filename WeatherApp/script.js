const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const searchCitySection = document.querySelector('.search-city')
const notFoundSection = document.querySelector('.not-found')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const forecastItemsContainer = document.querySelector('.forecast-items-container')

const apiKey = 'aea33453eb08a7233c294bd4be6b5793'

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (e)=> {
    if(e.key=='Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})

function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm'
    if(id<=321) return 'drizzle'
    if(id<=531) return 'rain'
    if(id<=622) return 'snow'
    if(id<=781) return 'atmosphere'
    if(id<=800) return 'clear'
    else return 'clouds'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
}

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()
}
async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather',city)
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    showDisplaySection(weatherInfoSection)
    const {
        name: country,
        main: {temp,humidity},
        weather: [{id,main}],
        wind: {speed}
    } = weatherData
    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}.svg`
    currentDateTxt.textContent = getCurrentDate()
    await updateForecastsInfo(city)
}
async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast',city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForeCastItems(forecastWeather)
        }
    })
}
function updateForeCastItems(weatherData){
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData
    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)
    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}.svg" alt="thunder storm" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} &deg;C</h5>
        </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem)
}

function showDisplaySection(section){
    [weatherInfoSection,searchCitySection,notFoundSection]
    .forEach(sec => sec.style.display='none')
    section.style.display='flex'
}