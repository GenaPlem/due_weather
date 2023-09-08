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
}

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
 * @param forecastday
 * @returns {string}
 */
const renderForecast = (name, forecastday) => {
    let html = `<!-- Weather forecast -->
                <div class="weather glassmorphism">
                    <h2 class="hidden_heading">Forecast weather</h2>
                    <h3 class="forecast__name">${name}</h3>`;

    console.log(forecastday)

    forecastday.forEach(day => {
        html += `<div class="forecast">
            <div class="forecast__day glassmorphism">
                <img class="forecast__icon" src="assets/images/weather_clouds_black.svg" alt="">
                    <span class="forecast__date">${convertDate(day.date)}</span>
                    <p class="forecast__weather">${day.day.condition.text}</p>
                    <span class="forecast__temp">H: ${decimalRound(day.day.maxtemp_c)}℃  L: ${decimalRound(day.day.mintemp_c)}℃</span>
            </div>`;
    });

    html += `</div>`;

    return html;
};