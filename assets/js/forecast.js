const mainContent = document.getElementById('main_content');

const getForecast = () => {
    let location = localStorage.getItem('location') || 'Dublin';
    try {
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=b838b9836989433494d122402230109&q=${location}&days=3&aqi=no&alerts=no
`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                const {location:{name}, forecast:{forecastday}} = res

                mainContent.innerHTML = renderForecast(name, forecastday)
                // error.style.display = 'none'
            })
    } catch (error) {
        mainContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getForecast()
})

const renderForecast = (name, forecastday) => {
    return `<div class="weather glassmorphism">
                    <h2 class="hidden_heading">Forecast weather</h2>
                    <h3 class="forecast__name">${name}</h3>
                    <div class="forecast">
                        <div class="forecast__day glassmorphism">
                            <img class="forecast__icon" src="assets/images/weather_clouds_black.svg" alt="">
                            <span class="forecast__date">${forecastday[0].date}</span>
                            <p class="forecast__weather">${forecastday[0].day.condition.text}</p>
                            <span class="forecast__temp">H: ${forecastday[0].day.maxtemp_c}℃  L: ${forecastday[0].day.mintemp_c}℃</span>
                        </div>
                    </div>
                    <div class="forecast">
                        <div class="forecast__day glassmorphism">
                            <img class="forecast__icon" src="assets/images/weather_clouds_black.svg" alt="">
                            <span class="forecast__date">${forecastday[1].date}</span>
                            <p class="forecast__weather">${forecastday[1].day.condition.text}</p>
                            <span class="forecast__temp">H: ${forecastday[1].day.maxtemp_c}℃  L: ${forecastday[1].day.mintemp_c}℃</span>
                        </div>
                    </div>
                    <div class="forecast">
                        <div class="forecast__day glassmorphism">
                            <img class="forecast__icon" src="assets/images/weather_clouds_black.svg" alt="">
                            <span class="forecast__date">${forecastday[2].date}</span>
                            <p class="forecast__weather">${forecastday[2].day.condition.text}</p>
                            <span class="forecast__temp">H: ${forecastday[2].day.maxtemp_c}℃  L: ${forecastday[2].day.mintemp_c}℃</span>
                        </div>
                    </div>
            </div>`
}