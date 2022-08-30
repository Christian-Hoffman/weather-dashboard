var appid = '692efab00ae66e9f48137e6ea4766fcd';
var search = document.querySelector('#search');
var buttonEl = document.querySelector('#button');

var toJSON = function(response) {
    return response.json();
};

// takes city and weather data from city and appends it to the page
var showWeather = function(data, city) {
    console.log(data);
    var currentEl = document.querySelector('#current');
    var h2El = document.createElement('h2');
    var pEl = document.createElement('p');
    var todaysDate = moment().format("dddd, MMMM Do YYYY");
    h2El.textContent = city.name + ' - ' + todaysDate;
    pEl.textContent = 'Temp: ' + data.current.temp;
    currentEl.appendChild(h2El);
    currentEl.appendChild(pEl);
};

// add buttons of recent searches
var recentSearches = function() {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    for (var city of cities) {
        var searchesEl = document.createElement('button');
        searchesEl.textContent = city;
        searchesEl.className = 'btn btn-secondary mb-3';
        search.appendChild(searchesEl);
    }
};

// uses the oneCall api tp gather weather data from given city
var getOneCall = function(city) {
    var oneCall = `http://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&appid=${appid}&units=imperial`;
    fetch(oneCall)
    .then(toJSON)
    .then(function(data) {
        showWeather(data, city);
    });
};

// save cities to local storage
var localSave = function(city) {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.push(city);
    var data = JSON.stringify(cities);
    localStorage.setItem('cities', data);
};

// console logs lat and lon. Calls oneCall function
var getGEO = function(locations) {
    var city = locations[0];
    console.log('LAT', city.lat);
    console.log('LON', city.lon);
    localSave(city.name);
    getOneCall(city);
};

// function for event listener to call
var citySearch = function(event) {
    event.preventDefault();
    var q = document.querySelector('#q');
    var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q.value}&appid=${appid}`;
    fetch(geoURL)
        .then(toJSON)
        .then(getGEO);
};
    
buttonEl.addEventListener('click', citySearch);
    
recentSearches();