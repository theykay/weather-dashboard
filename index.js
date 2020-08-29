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
    // 3 show color that indicates favorable, moderate, severe
    // 4 future weather conditions
    // each day on 5-day forecast shows:
    // date
    // icon representation of weather conditions
    // temperature (max and min)
    // humidity
    // 5 click on city in search history, show all same stuff
    // DONE 6 opening page shows last searched city info



    // assign classes in quotes to call icon
    const icons = {
        temp: "fas fa-thermometer-half",
        tempHi: "fas fa-temperature-high",
        tempLo: "fas fa-temperature-low",
        smog: "fas fa-smog",
        wind: "fas fa-wind",
        drop: "fas fa-tint",
        sun: "fas fa-sun"
    };

    // array to hold searched cities
    let history = [];

    var appID = 'd818490e3db0c249345d4f13e2070e69';
    var coordinateURL = "https://api.openweathermap.org/data/2.5/weather?";
    // one-call API
    var weatherURL = 'https://api.openweathermap.org/data/2.5/onecall?exclude=minutely,hourly';

    initialize();

    $('#searchBtn').on('click', function () {
        let searchString = $('#cityInput').val();
        let queryURL = coordinateURL + 'q=' + searchString + '&appid=' + appID;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let cityName = response.name;
            let cityLat = response.coord.lat;
            let cityLon = response.coord.lon;
            storeCity(cityName, cityLat, cityLon);
            buttonify();
            showWeather(response);
        }).catch(function () {
            // if something fails; error handling
            $('#errorModal').modal('show');
        });
    })

    function initialize() {
        history = JSON.parse(localStorage.getItem('history'));
        if (history != null && history.length > 0) {
            buttonify();
            showWeather(history[0].city, history[0].lat, history[0].lon);
        }
    }

    // add city name and coordinates to local storage
    function storeCity(city, lat, lon) {
        let info = { 'city': city, 'lat': lat, 'lon': lon };
        if (history === null) {
            history = ['ew'];
            history[0] = info;
        } else {
            history.splice(0, 0, info);
            if (history.length > 8) {
                for (let j = 8; j < history.length; j++) {
                    history.splice(j, 1);
                };
            };
        }
        localStorage.setItem('history', JSON.stringify(history));
    }

    function buttonify() {
        $('#buttons').empty();

        for (let b = 0; b < history.length; b++) {
            let newBtn = $('<button>');
            // add more classes to style buttons with bootstrap
            newBtn.addClass('againWeather btn ');
            newBtn.text(history[b].city);
            newBtn.attr('id', history[b].city);
            newBtn.attr('data-lat', history[b].lat);
            newBtn.attr('data-lon', history[b].lon);
            $('#buttons').append(newBtn);
        };

    };

    $('.againWeather').on('click', function (event) {
        let btnName = event.currentTarget.getAttribute('id');
        let btnLat = event.currentTarget.getAttribute('data-lat');
        let btnLon = event.currentTarget.getAttribute('data-lon');
        let dataObject = {
            name: btnName,
            lat: btnLat,
            lon: btnLon
        };
        showWeather(dataObject.name, dataObject.lat, dataObject.lon);
    })

    function showWeather(name, lat, lon) {
        $('#display').empty();
        let displayURL = weatherURL + "&lat=" + lat + "&lon=" + lon + "&appid=" + appID;
        console.log(displayURL);

        $.ajax({
            type: 'GET',
            url: displayURL,
            dataType: 'json'
        }).then(function (response) {
            console.log(response);
            // div to hold today's weather info
            let currentWeather = $('<div>');
            
            // city name
            let cityName = $('<h2>');
            cityName.text(name);
            currentWeather.append(cityName);
            
            // today's day and date (day, month)
            let today = moment.unix(response.current.dt).format('dddd, D MMMM');
            let todayEl = $('<h4>');
            todayEl.text(today);
            currentWeather.append(todayEl);
            
            // icon reflecting conditions
            let conditions = response.current.weather[0].icon;
            let description = response.current.weather[0].description
            let conditionEl = $('<div>').attr('id', 'conditions');
            let iconEl = $('<img>');
            let descripEl = $('<h5>').text(description);
            iconEl.attr('src', 'http://openweathermap.org/img/wn/' + conditions + '@2x.png');
            iconEl.attr('alt', description);
            conditionEl.append(iconEl).append(descripEl);
            currentWeather.append(conditionEl);

            // temperature
            let temp = response.current.temp;
            temp = (temp - 273.15) * (9/5) + 32;
            temp = temp.toFixed(2);
            let tempEl = $('<h3>').html(`<i class='${icons.temp}'></i> ${temp} F`);
            currentWeather.append(tempEl);
            
            // humidity
            let humidity = response.current.humidity;
            let humidEl = $('<h3>').html(`<i class='${icons.drop}'></i> ${humidity}%`);
            currentWeather.append(humidEl);
            
            // wind speed
            let wind = response.current.wind_speed;
            let windEl = $('<h3>').html(`<i class='${icons.wind}'></i> ${wind} mph`);
            currentWeather.append(windEl);
            
            // uv index
            let uvi = response.current.uvi;
            let uviEl = $('<h3>');
            let uviIcon = $('<span>').html(`${uvi} <i class='${icons.sun}'></i>`);
            uviIcon.css('text-shadow', '0 0 3px grey');
            if (uvi > 0 && uvi < 3) {
                uviIcon.css('color', 'MediumSeaGreen');
            } else if (uvi >= 3 && uvi < 5) {
                uviIcon.css('color', 'Gold');
            } else if (uvi >= 5 && uvi < 7) {
                uviIcon.css('color', 'Orange');
            } else if (uvi >= 7 && uvi < 10) {
                uviIcon.css('color', 'Red');
            } else if (uvi >= 10) {
                uviIcon.css('color', 'Purple');
            }
            uviEl.append(uviIcon);
            currentWeather.append(uviEl);

            $('#display').append(currentWeather);

            
            // go through five days of forecast
            const forecast = $('<div>');
            forecast.html('<h3>5-Day forecast:</h3>');
            for (let f = 0; f < 5; f++) {
                // day
                const dayX = $('<div>');

                // icon for conditions

                // hi temp

                // lo temp

                // humidity

            };
            $('#display').append(forecast);
        });
    }
});