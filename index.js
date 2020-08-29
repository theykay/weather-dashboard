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
            newBtn.addClass('againWeather btn btn-info');
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
        $('#today').empty();
        let displayURL = weatherURL + "&lat=" + lat + "&lon=" + lon + "&appid=" + appID;
        
        $.ajax({
            type: 'GET',
            url: displayURL,
            dataType: 'json'
        }).then(function (response) {
            // div to hold today's weather info
            let currentWeather = $('<div>').addClass('card');
            currentWeather.css('padding', '10px');

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
            let windDeg = response.current.wind_deg;
            let windDir;
            if ((windDeg >= 0 && windDeg < 11.25) || (windDeg >= 348.75 && windDeg <= 360)) {
                windDir = 'E';
            } else if (windDeg >= 11.25 && windDeg < 33.75) {
                windDir = 'ENE';
            } else if (windDeg >= 33.75 && windDeg < 56.25) {
                windDir = "NE";
            } else if (windDeg >= 56.25 && windDeg < 78.75) {
                windDir = "NNE";
            } else if (windDeg >= 78.75 && windDeg < 101.25) {
                windDir = "N";
            } else if (windDeg >= 101.25 && windDeg < 123.75) {
                windDir = 'NNW';
            } else if (windDeg >= 123.75 && windDeg < 146.25) {
                windDir = 'NW';
            } else if (windDeg >= 146.25 && windDeg < 168.75) {
                windDir = 'WNW';
            } else if (windDeg >= 168.75 && windDeg < 191.25) {
                windDir = 'W';
            } else if (windDeg >= 191.25 && windDeg < 213.75) {
                windDir = "WSW";
            } else if (windDeg >= 213.75 && windDeg < 236.25) {
                windDir = "SW";
            } else if (windDeg >= 236.25 && windDeg < 258.75) {
                windDir = "SSW";
            } else if (windDeg >= 258.75 && windDeg < 281.25) {
                windDir = 'S';
            } else if (windDeg >= 281.25 && windDeg < 303.75) {
                windDir = 'SSE';
            } else if (windDeg >= 303.75 && windDeg < 326.25) {
                windDir = 'SE'
            } else if (windDeg >= 326.25 && windDeg < 348.75) {
                windDir = 'ESE';
            }
            let windEl = $('<h3>').html(`<i class='${icons.wind}'></i> ${wind} mph ${windDir}`);
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

            $('#today').append(currentWeather);

            
            // go through five days of forecast
            $('#forecast').empty();
            $('#forecast').append('<h3>Forecast:</h3>');
            // let forecast = $('<div>').addClass('row');
            let forecast = $('#forecast');
            // forecast.css('padding', '5px');
            for (let f = 1; f < 6; f++) {
                let dayEl = $('<div>').addClass('col-12 col-md-2');
                
                // day
                let day = moment.unix(response.daily[f].dt).format('dddd');
                let date = moment.unix(response.daily[f].dt).format('D MMM');
                let dayH = $('<h5>').text(day);
                let dateH = $('<h5>').text(date);

                dayEl.append(dayH);
                dayEl.append(dateH);

                // icon for conditions
                let icon = response.daily[f].weather[0].icon;
                let iconEl = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
                iconEl.attr('alt', response.daily[f].weather[0].description);
                iconEl.addClass('forecastIcon');
                dayEl.append(iconEl);

                // hi temp
                let tempH = response.daily[f].temp.max;
                tempH = (tempH - 273.15) * (9/5) + 32;
                tempH = tempH.toFixed(2);
                let tempHEl = $('<h5>').html(`<i class ="${icons.tempHi}"></i> ${tempH} F`);
                dayEl.append(tempHEl);

                // lo temp
                let tempL = response.daily[f].temp.min;
                tempL = (tempL - 273.15) * (9/5) + 32;
                tempL = tempL.toFixed(2);
                let tempLEl = $('<h5>').html(`<i class ="${icons.tempLo}"></i> ${tempL} F`);
                dayEl.append(tempLEl);

                // humidity
                let humid = response.daily[f].humidity;
                let humidEl = $('<h5>').html(`<i class ="${icons.drop}"></i> ${humid}%`);
                dayEl.append(humidEl);

                forecast.append(dayEl);
            };
            $('#forecast').append(forecast);
        });
    }
});