const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search_btn');
const mainContent = document.getElementById('main_content');
const main = document.getElementById('main');
const locationBtn = document.getElementById('location');
const error = document.getElementById('error');

const getCurrentWeather = () => {
    let location = searchInput.value;
    if (location === '' || location.length < 3) {
        error.style.display = 'inline-block'
        return
    }
    try {
        startLoading();
        fetch(`http://api.weatherapi.com/v1/forecast.json?key=b838b9836989433494d122402230109&q=${location}&days=3&aqi=no&alerts=no
`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                stopLoading()
                const {location:{name}, current:{temp_c, humidity, wind_dir, wind_kph, condition:{text, icon}}, forecast:{forecastday:{0:{astro:{sunrise, sunset}, hour}}}} = res
                mainContent.innerHTML = renderCurrentWeather(name, temp_c, humidity, wind_dir, wind_kph, text, icon, sunrise, sunset, hour)
                error.style.display = 'none'
            })
    } catch (error) {
        mainContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        throw error;
    }
}

const startLoading = () => {
    main.style.opacity = '0.3';
    locationBtn.disabled = true;
    searchInput.disabled = true;
    searchBtn.disabled = true;
}

const stopLoading = () => {
    main.style.opacity = '1';
    locationBtn.disabled = false;
    searchInput.disabled = false;
    searchBtn.disabled = false;
}
/**
 * Function helper to convert date string to time
 * @param date
 * @returns {*}
 */
const splitDate = (date) => date.split(' ')[1];

/**
 * Function helper to rounding all decimals to integer
 * @param decimal
 * @returns {number}
 */
const decimalRound = (decimal) => Math.round(decimal);
/**
 * Function to render data about weather from fetch request
 * param: weather data
 * @returns rendered html
 */
const renderCurrentWeather = (name, temp, humidity, wind_dir, wind_kph, condition, icon, sunrise, sunset, hours) => {
    console.log(hours)
    let filteredHours = hours.filter(({time_epoch}) => time_epoch.toString().endsWith('600'))
    console.log(filteredHours)

    return `<h2 class="hidden_heading">Current day weather</h2>
            <div class="current">
                <h2 class="current__name">${name}</h2>
                <div class="current__actual">
                    <img class="current__icon" src="${icon}" alt="">
                    <span class="current__temp">${decimalRound(temp)}</span>
                </div>
                <div class="current__day">
                    <p>${condition}</p>
                </div>
            </div>
            <div class="hourly">
                <div class="hour">
                    <p class="hour__time">${splitDate(filteredHours[0].time)}</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                    <p>${decimalRound(filteredHours[0].temp_c)}℃</p>
                </div>
                <div class="hour">
                    <p class="hour__time">${splitDate(filteredHours[1].time)}</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                    <p>${decimalRound(filteredHours[1].temp_c)}℃</p>
                </div>
                <div class="hour">
                    <p class="hour__time">${splitDate(filteredHours[2].time)}</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                    <p>${decimalRound(filteredHours[2].temp_c)}℃</p>
                </div>
                <div class="hour">
                    <p class="hour__time">${splitDate(filteredHours[3].time)}</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                    <p>${decimalRound(filteredHours[3].temp_c)}℃</p>
                </div>
                <div class="hour">
                    <p class="hour__time">${splitDate(filteredHours[4].time)}</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                    <p>${decimalRound(filteredHours[4].temp_c)}℃</p>
                </div>
            </div>
            <div class="details__wrapper">
                <h2 class="hidden_heading">Current weather details</h2>
                <div class="details">
                    <h3 class="details__name">Wind</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/weather_clouds_black.svg" alt="">
                        <p>${wind_dir}, ${decimalRound(wind_kph)}km/h</p>
                    </div>
                </div>
                <div class="details">
                    <h3 class="details__name">Sunrise</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/weather_clouds_black.svg" alt="">
                        <p>${sunrise}</p>
                    </div>
                </div>
                <div class="details">
                    <h3 class="details__name">Humidity</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/weather_clouds_black.svg" alt="">
                        <p>${humidity}%</p>
                    </div>
                </div>
                <div class="details">
                    <h3 class="details__name">Sunset</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/weather_clouds_black.svg" alt="">
                        <p>${sunset}</p>
                    </div>
                </div>
            </div>`
}
/**
 * Listener event for search button by click
 */
searchBtn.addEventListener('click', getCurrentWeather);

/**
 * Listener event for search input by enter keypress
 */
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getCurrentWeather()
    }
})

/**
 * Listener for render current weather by actual location
 */
locationBtn.addEventListener('click', () => {
    startLoading();

    if (confirm('We would like to get your current location. Do you agree with it?')) {
        navigator.geolocation.getCurrentPosition(position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(lat, lon)

            fetch(`http://api.weatherapi.com/v1/forecast.json?key=b838b9836989433494d122402230109&q=${lat},${lon}&days=3&aqi=no&alerts=no
`)
                .then(res => res.json())
                .then(res => {
                    stopLoading();

                    const {location:{name}, current:{temp_c, humidity, wind_dir, wind_kph, condition:{text, icon}}, forecast:{forecastday:{0:{astro:{sunrise, sunset}, hour}}}} = res
                    mainContent.innerHTML = renderCurrentWeather(name, temp_c, humidity, wind_dir, wind_kph, text, icon, sunrise, sunset, hour)
                    error.style.display = 'none'
                })
        })
    } else {
        alert('You didn`t accept the confirm')
    }
})
