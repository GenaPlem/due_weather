const mainContent = document.getElementById('main_content');

document.addEventListener('DOMContentLoaded', () => {
    mainContent.innerHTML = renderSaved();

    removeLocation();
})

const removeLocation = () => {

    let removeBtn = document.querySelectorAll('.delete_location');

    removeBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let savedLocations = [];
            if (localStorage.getItem('saved')) {
                savedLocations = JSON.parse(localStorage.getItem('saved'))
                console.log(savedLocations)
            }
            console.log(e.target.nextElementSibling.textContent)
            let locationName = e.target.nextElementSibling.textContent;
            let savedWeather = e.target.parentElement
            console.log(savedWeather)

            let filterLocation = savedLocations.filter(saved => saved !== locationName)
            console.log(filterLocation)

            localStorage.setItem('saved', JSON.stringify(filterLocation))
            mainContent.innerHTML = renderSaved();
            removeLocation();
        })
    })
}

const renderSaved = () => {
    let html = `<h2 class="hidden_heading">Saved Locations</h2>
                    <div class="weather glassmorphism">
`
    // let saved = ['Kiev', 'Dublin']
    // localStorage.setItem('saved', JSON.stringify(saved))

    if (localStorage.getItem('saved') && JSON.parse(localStorage.getItem('saved')).length !== 0) {
        // html += `<div class="saved glassmorphism">
        //         <h3 class="saved__name">Dublin</h3>
        //         <img src="assets/images/weather_clouds_black.svg" alt="">
        //         <span class="saved__temp">27C</span>
        //     </div>
        //     <div class="saved glassmorphism">
        //         <h3 class="saved__name">Dublin</h3>
        //         <img src="assets/images/weather_clouds_black.svg" alt="">
        //         <span>27C</span>
        //     </div>
        //     <div class="saved glassmorphism">
        //         <h3 class="saved__name">Dublin</h3>
        //         <img src="assets/images/weather_clouds_black.svg" alt="">
        //         <span>27C</span>
        //     </div>`

        let saved = JSON.parse(localStorage.getItem('saved'));
        console.log(saved)

        saved.forEach(location => {
            html += `<div class="saved glassmorphism">
                 <button type="button" class="delete_location glassmorphism">-</button>
                 <h3 class="saved__name">${location}</h3>
                 <img src="assets/images/weather_clouds_black.svg" alt="">
                 <span class="saved__temp">27C</span>
            </div>`
        })
    } else {
        html += `<div class="saved glassmorphism">
                    <h2>You still havent saved location</h2>
                 </div>`
    }

    html += `</div>`

    return html
}