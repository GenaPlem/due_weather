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

