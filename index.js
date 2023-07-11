// let API_KEY = "1a88bad1187ec4b382d7cef114365e79"
// let city = "Jabalpur";
// async function apiWeatherCall() {
    // let apidata = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
//     let data = await apidata.json()
//     console.log(data);
//     let newPara = document.createElement('p')
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} degC`
//     document.body.appendChild(newPara)
// }

const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")
// by default current tab will be user tab when page is reloaded
let currentTab = userTab
currentTab.classList.add("current-tab")
const API_KEY = "7f87e635de64b0dd6904bcb35452a777"
getfromSessionStorage(); 

function switchTab(clickedTab) {

    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active")) {
        //  if search form container is invisible if yes make it visible
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")
        }
        else {
            // it means we're on search tab close make it invisible and make weather tab visible to switch between tabs
            searchForm.classList.remove("active")
            userInfoContainer.classList.remove("active")

            // we're now in weather tab,  make weather visible check local storage first
            // in local storage if we have stored coords we can display weather of user on tab switch
            getfromSessionStorage()

        }
    }

}
userTab.addEventListener("click", () => {

    switchTab(userTab);

})

searchTab.addEventListener("click", () => {

        switchTab(searchTab)
})
// check if coordinates are already present in local storage
function getfromSessionStorage() {
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        // if local coordinates not found, which means coordinates arent stored in system
        grantAccessContainer.classList.add("active")
    }
    else {
        // if they are
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}
async function fetchUserWeatherInfo(coordinates) {

    const {lat, lon} = coordinates;
    // const part = {
    // current
    // ,minutely
    // ,hourly
    // ,daily
    // ,alerts};
    // make grant access container invisible
    grantAccessContainer.classList.remove("active")
    // make loading screeen visible
    loadingScreen.classList.add("active")
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        let data = await response.json()
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherData(data)

    }
    catch(err) {
        loadingScreen.classList.remove("active")
        
    }

}

function renderWeatherData(data) {
    // fetch all dynamic elements
    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]")
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp =document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windspeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")

    // chaining operator - used to target json property
    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w//${data?.weather?.[0]?.icon}.png`
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudiness.innerText = `${data?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}



function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}



const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})




async function fetchSearchWeatherInfo(cityName) {
    let city = cityName;
    // console.log(city);
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        //   console.log(response);
        const data = await response.json();
        // console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherData(data);
    }
    catch(err) {
        //hW
    }
}
