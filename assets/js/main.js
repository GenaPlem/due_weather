const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search_btn');
const mainContent = document.getElementById('main_content');

const getCurrentWeather = () => {
    let location = searchInput.value;
    if (location === '' || location.length < 3) {
        return
    }
    try {
        fetch(`http://api.weatherapi.com/v1/forecast.json?key=b838b9836989433494d122402230109&q=${location}&days=3&aqi=no&alerts=no
`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                const {location:{name}, current:{temp_c, condition:{text, icon}}} = res
                mainContent.innerHTML = renderCurrentWeather(name, temp_c, text, icon)
            })
    } catch (error) {
        mainContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        throw error;
    }
}

const convertTemp = (temp) => Math.trunc(temp);

const renderCurrentWeather = (name, temp, condition, icon) => {

    return `<h2 class="hidden_heading">Current day weather</h2>
            <div class="current">
                <h2 class="current__name">${name}</h2>
                <div class="current__actual">
                    <img class="current__icon" src="${icon}" alt="">
                    <span class="current__temp">${convertTemp(temp)}</span>
                </div>
                <div class="current__day">
                    <p>${condition}</p>
                </div>
            </div>
            <div class="hourly">
                <div class="hour">
                    <p class="hour__time">09:00</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                </div>
                <div class="hour">
                    <p class="hour__time">10:00</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                </div>
                <div class="hour">
                    <p class="hour__time">11:00</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                </div>
                <div class="hour">
                    <p class="hour__time">12:00</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                </div>
                <div class="hour">
                    <p class="hour__time">13:00</p>
                    <img class="hour__icon" src="assets/images/weather_clouds_black.svg" alt="">
                </div>
            </div>
            <div class="details__wrapper">
                <h2 class="hidden_heading">Current weather details</h2>
                <div class="details">
                    <h3 class="details__name">Wind</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/weather_clouds_black.svg" alt="">
                        <p>25mph/s</p>
                    </div>
                </div>
                <div class="details">
                    <h3 class="details__name">Sunrise</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/weather_clouds_black.svg" alt="">
                        <p>06:21</p>
                    </div>
                </div>
                <div class="details">
                    <h3 class="details__name">Humidity</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/weather_clouds_black.svg" alt="">
                        <p>50%</p>
                    </div>
                </div>
                <div class="details">
                    <h3 class="details__name">Sunset</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/weather_clouds_black.svg" alt="">
                        <p>21:40</p>
                    </div>
                </div>
            </div>`
}

