const mainContent = document.getElementById('main_content');

document.addEventListener('DOMContentLoaded', () => {
    mainContent.innerHTML = renderSaved();

    removeLocation();
})

const removeLocation = () => {
    let removeBtn = document.querySelectorAll('.delete_location');
    let savedLocations = [];
    if (localStorage.getItem('saved')) {
        savedLocations = JSON.parse(localStorage.getItem('saved'))
    }

    removeBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log(e.target.nextElementSibling.textContent)
            let locationName = e.target.nextElementSibling.textContent;
            let filterLocation = savedLocations.filter(saved => locationName)
            console.log(filterLocation)
        })
    })
}

const renderSaved = () => {
    let html = `<h2 class="hidden_heading">Saved Locations</h2>
                    <div class="weather glassmorphism">
`
    // let saved = ['Kiev', 'Dublin']
    // localStorage.setItem('saved', JSON.stringify(saved))

    if (localStorage.getItem('saved')) {
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
                 <button type="button" class="delete_location">-</button>
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