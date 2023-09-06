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
    let html = `<div class="weather glassmorphism">
                    <h2 class="hidden_heading">Forecast weather</h2>
                    <h3 class="forecast__name">${name}</h3>`

    console.log(forecastday)

    forecastday.forEach(day => {
        html += `<div class="forecast">
            <div class="forecast__day glassmorphism">
                <img class="forecast__icon" src="assets/images/weather_clouds_black.svg" alt="">
                    <span class="forecast__date">${day.date}</span>
                    <p class="forecast__weather">${day.day.condition.text}</p>
                    <span
                        class="forecast__temp">H: ${day.day.maxtemp_c}℃  L: ${day.day.mintemp_c}℃</span>
            </div>`
    })

    html += `</div>`

    return html
}