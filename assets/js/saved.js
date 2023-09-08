const mainContent = document.getElementById('main_content');

/**
 * Function to get response from fetch request
 * @returns {Promise<string>}
 */
const getSaved = async () => {
    let html = `<h2 class="hidden_heading">Saved Locations</h2>
                    <div class="weather glassmorphism">`;

    if (localStorage.getItem('saved') && JSON.parse(localStorage.getItem('saved')).length !== 0) {

        let saved = JSON.parse(localStorage.getItem('saved'));
        console.log(saved);

        const fetchPromises = saved.map(async (location, index) => {
            try {
                // startLoading();
                let res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b838b9836989433494d122402230109&q=${location}&days=3&aqi=no&alerts=no
`);
                let data = await res.json();

                console.log(data);
                if (!data.hasOwnProperty('error')) {
                    const { location: { name }, current: { temp_c, condition: { text } } } = data;

                    const itemId = `${index}`;

                    html += `<div id="${itemId}" class="saved glassmorphism">
                        <button type="button" class="delete_location glassmorphism">-</button>
                        <h3 class="saved__name">${name}</h3>
                        <img src="assets/images/weather_clouds_black.svg" alt="">
                        <span class="saved__temp">${temp_c}</span>
                        <p>${text}</p>
                    </div>`;
                }
            } catch (error) {
                console.error(error);
                throw error
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
 * Function to remove location from saved in local storage by it id
 */
const removeLocation = () => {

    let removeBtn = document.querySelectorAll('.delete_location');

    removeBtn.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            let savedLocations = [];
            if (localStorage.getItem('saved')) {
                savedLocations = JSON.parse(localStorage.getItem('saved'));
                // console.log(savedLocations);
            }
            // console.log(e.target.nextElementSibling.textContent);
            // let locationName = e.target.nextElementSibling.textContent;
            let savedWeather = e.target.parentElement;
            console.log(savedWeather.id);

            const itemId = savedWeather.id;
            let filterLocation = savedLocations.filter((saved, index) => index !== +itemId);
            console.log(filterLocation);

            localStorage.setItem('saved', JSON.stringify(filterLocation));
            mainContent.innerHTML = await getSaved();
            removeLocation();
            savedWeather.remove();
        });
    });
};