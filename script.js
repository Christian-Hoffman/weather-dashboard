var appid = '692efab00ae66e9f48137e6ea4766fcd';
var q = 'Chicago';
var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${appid}`

var toJSON = function(response) {
    return response.json();
};

var showWeather = function(data, city) {
    console.log(data);
    var currentEl = document.querySelector('#current');
    var h2El = document.createElement('h2');
    var pEl = document.createElement('p');
    h2El.textContent = city.name;
    pEl.textContent = 'Temp: ' + data.current.temp;
    currentEl.appendChild(h2El);
    currentEl.appendChild(pEl);
};

var getOneCall = function(city) {
    var oneCall = `http://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&appid=${appid}&units=imperial`
    fetch(oneCall)
    .then(toJSON)
    .then(function(data) {
        showWeather(data, city)
    });
};

var getGEO = function(locations) {
    var city = locations[0];
    console.log('Lat', city.lat);
    console.log('Lon', city.lon);
    getOneCall(city);
};

fetch(geoURL)
    .then(toJSON)
    .then(getGEO);