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
