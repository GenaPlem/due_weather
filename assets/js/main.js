const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search_btn');
const mainContent = document.getElementById('main_content');
const main = document.getElementById('main');
const locationBtn = document.getElementById('location');
const errorElement = document.getElementById('error');
const responseError = document.getElementById('response__error');
const successMessage = document.getElementById('success');

/**
 * Function to get weather from the API response by input value or a location that passed in params
 * @param defaultLocation
 */
const getCurrentWeather = (defaultLocation) => {
    let location = defaultLocation || searchInput.value;

    if (location.length < 3) {
        errorElement.style.display = 'inline-block';
        return;
    }

    try {
        startLoading();
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=b838b9836989433494d122402230109&q=${location}&days=3&aqi=no&alerts=no
`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                /*
                    If response object has property error, then error will show up
                 */
                if (res.hasOwnProperty('error')) {
                    stopLoading();

                    errorElement.style.display = 'none';

                    showError(res.error.message);

                } else {
                    stopLoading();

                    const {
                        location: {name},
                        current: {temp_c, humidity, wind_dir, wind_kph, condition: {text, icon}},
                        forecast: {forecastday: {0: {astro: {sunrise, sunset}, hour}}}
                    } = res;

                    mainContent.innerHTML = renderCurrentWeather(name, temp_c, humidity, wind_dir, wind_kph, text, icon, sunrise, sunset, hour);

                    storageLocation(name);

                    saveLocation();

                    errorElement.style.display = 'none';
                    responseError.style.display = 'none';

                }
            });
    } catch (error) {
        stopLoading();
        showError(error.message);
        throw error;
    }
};

/**
 * Function to show alert about some error
 * @param error
 */
const showError = (error) => {
    responseError.style.display = 'inline-block';
    responseError.innerText = `Error: ${error}`;

    setTimeout(() => {
        responseError.style.display = 'none';
    }, 2000);
};

/**
 * Function to show alert about success
 * @param success
 */
const showSuccess = (success) => {
    successMessage.style.display = 'inline-block';
    successMessage.innerText = `Success: ${success}`;

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 2000);
};

/**
 * Function helper to start loading from fetch request
 */
const startLoading = () => {
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        button.disabled = true;
    });
    main.style.opacity = '0.3';
    searchInput.disabled = true;
};

/**
 * Function helper to stop loading from fetch request
 */
const stopLoading = () => {
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        button.disabled = false;
    });

    main.style.opacity = '1';
    searchInput.disabled = false;
};

/**
 * Function to filter array of hours data to array with only 5 hours
 * @param hours
 * @returns {*[]}
 */
const filterHours = (hours) => {

    const filteredHours = [];

    for (let i = 0; i < hours.length; i++) {

        switch (hours[i].time.split(' ')[1]) {
            case '09:00': {
                filteredHours.push(hours[i]);
                break;
            }
            case '12:00': {
                filteredHours.push(hours[i]);
                break;
            }
            case '15:00': {
                filteredHours.push(hours[i]);
                break;
            }
            case '18:00': {
                filteredHours.push(hours[i]);
                break;
            }
            case '21:00': {
                filteredHours.push(hours[i]);
                break;
            }
        }
    }

    return filteredHours
};

/**
 * Function helper to convert date string to time
 * @param date
 * @returns {*}
 */
const splitDate = (date) => date.split(' ')[1];

/**
 * Function helper to convert 24h format to AM/PM
 * @param time
 * @returns string
 */
const convertTime = (time) => {

    const [hours] = time.split(':');

    if (hours <= 12) {
        return `${hours} AM`
    } else {
        return `0${hours - 12} PM`
    }
};

/**
 * Function to save location to local storage
 */
const saveLocation = () => {
    const saveBtn = document.getElementById('save_location');
    let saved = [];
    if (localStorage.getItem('saved')) {
        saved = JSON.parse(localStorage.getItem('saved'));
    }

    saveBtn.addEventListener('click', (e) => {
        console.log(e.target.nextElementSibling.textContent);
        let locationName = e.target.nextElementSibling.textContent;
        if (!saved.includes(locationName)) {
            saved.push(locationName);
            showSuccess('Your location saved!');
        } else {
            showError('This location already saved');
        }
        localStorage.setItem('saved', JSON.stringify(saved));
    });
};

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
    console.log(hours);
    let filteredHours = filterHours(hours);
    console.log(filteredHours);

    return `<h2 class="hidden_heading">Current day weather</h2>
<!--            current weather section          -->
            <div class="current glassmorphism">
                <button type="button" id="save_location">Save</button>
                <h2 class="current__name">${name}</h2>
                <div class="current__actual">
                    <img class="current__icon" src="${icon}" alt="${condition} icon">
                    <span class="current__temp">${decimalRound(temp)}</span>
                </div>
                <div class="current__day">
                    <p>${condition}</p>
                </div>
            </div>
<!--            Hourly forecast           -->
            <div class="hourly glassmorphism">
                <div class="hour">
                    <p class="hour__time">${convertTime(splitDate(filteredHours[0].time))}</p>
                    <img class="hour__icon" src="${filteredHours[0].condition.icon}" alt="${filteredHours[0].condition.text} icon">
                    <p>${decimalRound(filteredHours[0].temp_c)}℃</p>
                </div>
                <div class="hour">
                    <p class="hour__time">${convertTime(splitDate(filteredHours[1].time))}</p>
                    <img class="hour__icon" src="${filteredHours[1].condition.icon}" alt="${filteredHours[1].condition.text} icon">
                    <p>${decimalRound(filteredHours[1].temp_c)}℃</p>
                </div>
                <div class="hour">
                    <p class="hour__time">${convertTime(splitDate(filteredHours[2].time))}</p>
                    <img class="hour__icon" src="${filteredHours[2].condition.icon}" alt="${filteredHours[2].condition.text} icon">
                    <p>${decimalRound(filteredHours[2].temp_c)}℃</p>
                </div>
                <div class="hour">
                    <p class="hour__time">${convertTime(splitDate(filteredHours[3].time))}</p>
                    <img class="hour__icon" src="${filteredHours[3].condition.icon}" alt="${filteredHours[3].condition.text} icon">
                    <p>${decimalRound(filteredHours[3].temp_c)}℃</p>
                </div>
                <div class="hour">
                    <p class="hour__time">${convertTime(splitDate(filteredHours[4].time))}</p>
                    <img class="hour__icon" src="${filteredHours[4].condition.icon}" alt="${filteredHours[4].condition.text} icon">
                    <p>${decimalRound(filteredHours[4].temp_c)}℃</p>
                </div>
            </div>
<!--            Details of current weather            -->
            <div class="details__wrapper">
                <h2 class="hidden_heading">Current weather details</h2>
                <div class="details glassmorphism">
                    <h3 class="details__name">Wind</h3>
                    <span class="details__wind">${wind_dir}</span>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/windy.svg" alt="Wind icon">
                        <p>${decimalRound(wind_kph)}km/h</p>
                    </div>
                </div>
                <div class="details glassmorphism">
                    <h3 class="details__name">Sunrise</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/sunrise.svg" alt="Sunrise icon">
                        <p>${sunrise}</p>
                    </div>
                </div>
                <div class="details glassmorphism">
                    <h3 class="details__name">Humidity</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/humidity.svg" alt="Humidity icon">
                        <p>${humidity}%</p>
                    </div>
                </div>
                <div class="details glassmorphism">
                    <h3 class="details__name">Sunset</h3>
                    <div class="details__box">
                        <img class="details__icon" src="assets/images/sunset.svg" alt="Sunset icon">
                        <p>${sunset}</p>
                    </div>
                </div>
            </div>`;
};

/**
 * Function to save location name into local storage
 * @param locationName
 */
const storageLocation = (locationName) => {

    if (locationName.length < 3) {
        return;
    }
    localStorage.setItem('location', locationName);
};

/**
 * Listener event for search button by click
 */
searchBtn.addEventListener('click', () => {
    getCurrentWeather();
});

/**
 * Listener event for search input by enter keypress
 */
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getCurrentWeather();
    }
});

/**
 * Listener for render current weather by actual location
 */
locationBtn.addEventListener('click', () => {
    startLoading();

    // if (confirm('We would like to get your current location. Do you agree with it?')) {
    navigator.geolocation.getCurrentPosition(position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=b838b9836989433494d122402230109&q=${lat},${lon}&days=3&aqi=no&alerts=no
`)
            .then(res => res.json())
            .then(res => {
                stopLoading();

                const {
                    location: {name},
                    current: {temp_c, humidity, wind_dir, wind_kph, condition: {text, icon}},
                    forecast: {forecastday: {0: {astro: {sunrise, sunset}, hour}}}
                } = res;

                mainContent.innerHTML = renderCurrentWeather(name, temp_c, humidity, wind_dir, wind_kph, text, icon, sunrise, sunset, hour);
                errorElement.style.display = 'none';

                storageLocation(name);

                saveLocation();
            })
    }, (error) => {
        showError(error.message);

        stopLoading();
    })
});
//     } else {
//         showError('User denied confirm');
//         stopLoading();
//     }
// });

/**
 * Listener for DOMContentLoaded to get real data when the page is load
 */
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('location')) {
        let locationName = localStorage.getItem('location');

        getCurrentWeather(locationName);
    } else {
        getCurrentWeather('Dublin');
    }
});