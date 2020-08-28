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
    };

    var appID = 'd818490e3db0c249345d4f13e2070e69';
    var coordinateURL = "https://api.openweathermap.org/data/2.5/weather?";
    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall/timemachine?";
    // lat={lat}&lon={lon}&dt={time}&appid={YOUR API KEY}

    // when you click search...
    // $('#cityModal').on('show.bs.modal', function () {
    //     // get the value in the search bar
    //     const searchString = $('#cityInput').val();
    //     let queryURL = coordinateURL + 'q=' + searchString + '&appid=' + appID;
    //     $.ajax({
    //         url: queryURL,
    //         method: "GET"
    //     }).then(function(response) {
    //         console.log(response);
    //     }).catch(function(error) {
    //       // if something fails; error handling
    //       console.log(error);
    //     });

    $('#searchBtn').on('click', function () {
        const searchString = $('#cityInput').val();
        let queryURL = coordinateURL + 'q=' + searchString + '&appid=' + appID;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            let cityLat = response.coord.lat;
            let cityLon = response.coord.lon;
            console.log("lat: " + cityLat + "\nlon: " + cityLon);
            let coordURL = weatherURL + "lat=" + cityLat + "&lon=" + cityLon + "appid=" + appID;
            $.ajax({
                url: coordURL,
                method: 'GET'
            }).then(showWeather(response));
        }).catch(function (error) {
            // if something fails; error handling
            $('#errorModal').modal('show');
        });

    })

    // loop through local storage no more than 10 times
    // call this function each time to make a button for the most recent searches
    function buttonify(city) {
        let newBtn = $('<button>');
        newBtn.addClass('againWeather');
        newBtn.text(city);
        newBtn.attr('data-city', city);
        $('#buttons').append(newBtn);
    }

    function showWeather(data) {
        const 
    }

});