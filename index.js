// run current weather
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
// to get coordinates of city matching search term from text box
// then use those coordinates to run one call
// https://api.openweathermap.org/data/2.5/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={YOUR API KEY}

// 1 search for city --> see current/future conditions, add city to search history
// 2 current weather shows
    // city name
    // Date
    // icon representation of weather conditions
    // temperature
    // humidity
    // wind speed
    // UV index
// 3      show color that indicates favorable, moderate, severe
// 4 future weather conditions
    // ecah day on 5-day forecast shows:
        // date
        // icon representation of weather conditions
        // temperature (max and min)
        // humidity
// 5 click on city in search history, show all same stuff
// 6 opening page shows last searched city info

// assign  classes in quotes to call icon
const icons = {
    tempHi: "fas fa-temperature-high",
    tempLo: "fas fa-temperature-low",
    smog: "fas fa-smog",
    bolt: "fas fa-bolt",
    cloud: "fas fa-cloud",
    cloudRain: "fas fa-cloud-rain",
    cloudShower: "fas fa-cloud-showers-heavy",
    cloudSun: "fas fa-cloud-sun",
    cloudSunRain: "fas fa-cloud-sun-rain",
    snow: "fas fa-snowflake",
    sun: "fas fa-sun",
    wind: "fas fa-wind"
}

// get this from text entry field, populate drop-down menu to select correct entry
let citySearch = $('#autocomplete-input').val();
console.log(citySearch);

// to search for cities, get lat/long
// https://rapidapi.com/dev132/api/city-geo-location-lookup/endpoints
var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://devru-latitude-longitude-find-v1.p.rapidapi.com/latlon.php?location=" + citySearch,
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com",
		"x-rapidapi-key": "5573b1307dmshac7c49573ae8266p15de2ajsnf70e1968529e"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
});