const mainContent = document.getElementById('main_content');

/**
 * Function to get data about forecast weather from API
 */
const getForecast = () => {
    let location = localStorage.getItem('location') || 'Dublin';
    try {
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=b838b9836989433494d122402230109&q=${location}&days=3&aqi=no&alerts=no
`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                const {location:{name}, forecast:{forecastday}} = res;

                mainContent.innerHTML = renderForecast(name, forecastday);
                // error.style.display = 'none'
            });
    } catch (error) {
        mainContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        throw error;
    }
};

/**
 * Function helper to rounding all decimals to integer
 * @param decimal
 * @returns {number}
 */
const decimalRound = (decimal) => Math.round(decimal);

/**
 * Function to convert date from YYYY-MM-DD to DD-`3 symbols MM`
 * @param date
 */
const convertDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const convertedDate = date.split('-');
    const day = convertedDate[2];
    const month = months[parseInt(convertedDate[1]) - 1];

    return `${day} ${month}`;
};

/**
 * Listener for get forecast data on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    getForecast();
});

/**
 * Function to render forecast weather
 * @param name
 * @param forecastDay
 * @returns {string}
 */
const renderForecast = (name, forecastDay) => {
    let html = `<!-- Weather forecast -->
                <div class="weather glassmorphism">
                    <h2 class="hidden_heading">Forecast weather</h2>
                    <h3 class="forecast__name">${name}</h3>`;

    console.log(forecastDay);

    forecastDay.forEach(day => {
        html += `<div class="forecast">
            <div class="forecast__day glassmorphism">
                <img class="forecast__icon" src="${day.day.condition.icon}" alt="${day.day.condition.text} icon">
                <p class="forecast__date bold">${convertDate(day.date)}</p>
                <p class="forecast__weather">${day.day.condition.text}</p>
                <p class="forecast__temp"><span class="bold">H:</span> ${decimalRound(day.day.maxtemp_c)}℃  <span class="bold">L:</span> ${decimalRound(day.day.mintemp_c)}℃</p>
                <p class="forecast__rain"><span class="bold">Rain Chanse:</span> ${day.day.daily_chance_of_rain}%</p>
                <div class="forecast__wind"><img src="assets/images/windy.svg" alt="Windy icon" width="25px">${decimalRound(day.day.maxwind_kph)} km/h</div>
            </div>`;
    });

    html += `</div>`;

    return html;
};