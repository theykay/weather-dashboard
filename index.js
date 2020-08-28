$(document).ready(function () {
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
    // each day on 5-day forecast shows:
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
    };

    // array to hold searched cities
    let history = [];

    let pageLoad = true;

    var appID = 'd818490e3db0c249345d4f13e2070e69';
    var coordinateURL = "https://api.openweathermap.org/data/2.5/weather?";
    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall/timemachine?";
    // lat={lat}&lon={lon}&dt={time}&appid={YOUR API KEY}

    initialize();

    $('#searchBtn').on('click', function () {
        pageLoad = false;
        const searchString = $('#cityInput').val();
        let queryURL = coordinateURL + 'q=' + searchString + '&appid=' + appID;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let cityLat = response.coord.lat;
            let cityLon = response.coord.lon;
            storeCity(searchString, cityLat, cityLon);
            buttonify();
            let coordURL = weatherURL + "lat=" + cityLat + "&lon=" + cityLon + "&appid=" + appID;
            // $.ajax({
            //     url: coordURL,
            //     method: 'GET'
            // }).then(showWeather(response));
        }).catch(function () {
            // if something fails; error handling
            $('#errorModal').modal('show');
        });

    })

    // initialize();
    function initialize() {
        history = JSON.parse(localStorage.getItem('history'));
        pageLoad = true;
        buttonify();
        showWeather(history[0]);
    }

    // add city name and coordinates to local storage
    function storeCity(city, lat, lon) {
        let info = { 'city': city, 'lat': lat, 'lon': lon };
        history.splice(0, 0, info);
        if (history.length > 8) {
            for (let j = 8; j < history.length; j++) {
                history.splice(j, 1);
            };
        };
        localStorage.setItem('history', JSON.stringify(history));
    }
    
    function buttonify() {
        $('#buttons').empty();
        let b;
        // this makes it so the first city 
        if (pageLoad) {
            b = 0;
        } else {
            b = 1;
        }
        for (b < history.length; b++) {
            let newBtn = $('<button>');
            newBtn.addClass('againWeather btn ');
            newBtn.text(history[b].city);
            newBtn.attr('data-lat', history[b].lat);
            newBtn.attr('data-lon', history[b].lon);
            $('#buttons').append(newBtn);
        }

    }

    function showWeather(data) {
        data.
    }

});