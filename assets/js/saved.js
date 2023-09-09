const mainContent = document.getElementById('main_content');

/**
 * Function to get response from fetch request
 * @returns {Promise<string>}
 */
const getSaved = async () => {
    let html = `<!-- Saved locations current weather -->
                <h2 class="hidden_heading">Saved Locations</h2>
                    <div class="weather glassmorphism">`;

    if (localStorage.getItem('saved') && JSON.parse(localStorage.getItem('saved')).length !== 0) {

        let saved = JSON.parse(localStorage.getItem('saved'));

        const fetchPromises = saved.map(async (location, index) => {
            try {
                let res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b838b9836989433494d122402230109&q=${location}&days=3&aqi=no&alerts=no
`);
                let data = await res.json();

                if (!data.hasOwnProperty('error')) {
                    const {
                        location: {name},
                        current: {temp_c, condition: {text, icon}}
                    }  = data;

                    const itemId = `${index}`;

                    html += `<div id="${itemId}" class="saved glassmorphism">
                                <button type="button" class="delete_location" aria-label="Button to delete current location from saved">Delete</button>
                                <h3 class="saved__name">${name}</h3>
                                <div class="saved__actual">
                                    <img class="saved__icon" src="${icon}" alt="${text} icon">
                                    <p class="saved__temp">${decimalRound(temp_c)}℃</p>
                                </div>
                                <p class="saved__condition">${text}</p>
                            </div>`;
                }
            } catch (error) {
                throw error;
            }
        });
        await Promise.all(fetchPromises);
    } else {
        html += `<div class="saved glassmorphism">
                    <h2 class="saved__name">You still haven't saved any locations</h2>
                 </div>`;
    }

    html += `</div>`;

    return html;
};

/**
 * Listener to render content by using fetch request for all saved location in local storage
 */
document.addEventListener('DOMContentLoaded', async () => {
    mainContent.innerHTML = await getSaved();

    removeLocation();
});

/**
 * Function helper to rounding all decimals to integer
 * @param decimal
 * @returns {number}
 */
const decimalRound = (decimal) => Math.round(decimal);

/**
 * Function to remove location from saved in local storage by id
 */
const removeLocation = () => {

    let removeBtn = document.querySelectorAll('.delete_location');

    removeBtn.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            let savedLocations = [];
            if (localStorage.getItem('saved')) {
                savedLocations = JSON.parse(localStorage.getItem('saved'));
            }

            let savedWeather = e.target.parentElement;

            const itemId = savedWeather.id;
            let filterLocation = savedLocations.filter((saved, index) => index !== +itemId);

            localStorage.setItem('saved', JSON.stringify(filterLocation));
            mainContent.innerHTML = await getSaved();
            removeLocation();
            savedWeather.remove();
        });
    });
};