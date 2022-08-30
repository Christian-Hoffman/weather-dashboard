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
    currentEl.innerHTML = null;
    var h2El = document.createElement('h2');
    var pEl = document.createElement('p');
    var pEl2 = document.createElement('p');
    var pEl3 = document.createElement('p');
    var pEl4 = document.createElement('p');
    var icon = data.current.weather[0].icon;
    var iconEl = document.createElement('img');
    var todaysDate = moment().format("dddd, MMMM Do YYYY");
    h2El.textContent = city.name + ' - ' + todaysDate;
    pEl.textContent = 'Temp: ' + data.current.temp + '°F';
    pEl2.textContent = 'Humidity: ' + data.current.humidity + '%';
    pEl3.textContent = 'Wind Speed: ' + data.current.wind_speed + 'mph';
    pEl4.textContent = 'UV index: ' + data.current.uvi;
    iconEl.alt = icon;
    iconEl.src = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
    iconEl.width = 100;
    iconEl.height = 100;
    currentEl.appendChild(h2El);
    currentEl.appendChild(iconEl);
    currentEl.appendChild(pEl);
    currentEl.appendChild(pEl2);
    currentEl.appendChild(pEl3);
    currentEl.appendChild(pEl4);
    if (data.current.uvi <= 2) {
        pEl4.setAttribute('style', 'background: lightgreen; width: 10%');
    }
    else if (data.current.uvi > 2 && data.current.uvi < 6) {
        pEl4.setAttribute('style', 'background: yellow; width: 10%');
    }
    else if (data.current.uvi > 5 && data.current.uvi < 8) {
        pEl4.setAttribute('style', 'background: orange; width: 10%');
    }
    else if (data.current.uvi > 7 && data.current.uvi < 11) {
        pEl4.setAttribute('style', 'background: red; width: 10%');
    }
    else {
        pEl4.setAttribute('style', 'background: purple; color: white; width: 11%');
    };
        
        var fiveDayEl = document.querySelector('#fiveDay');
        var fiveDay = data.daily.slice(1,6);
        fiveDayEl.innerHTML = null;
        for (var day of fiveDay) {
            var date = new Date(day.dt * 1000).toLocaleDateString();
            var icon = day.weather[0].icon;
            var temp = day.temp.day;
            var humidity = day.humidity;
            var windSpeed = day.wind_speed;
            var colEl = document.createElement('div');
            var cardEl = document.createElement('div');
            var pEl = document.createElement('p');
            var pEl2 = document.createElement('p');
            var pEl3 = document.createElement('p');
            var pEl4 = document.createElement('p');
            var iconEl = document.createElement('img');
            colEl.className = 'col-12 col-md';
            cardEl.className = 'card p-3 m-3';
            pEl.textContent = date;
            pEl2.textContent = 'Temp: ' + temp + '°F';
            pEl3.textContent = 'Humidity: ' + humidity + '%';
            pEl4.textContent = 'Wind Speed: ' + windSpeed + 'mph';
            iconEl.alt = icon;
            iconEl.src = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
            fiveDayEl.append(colEl);
            colEl.append(cardEl);
            cardEl.append(pEl);
            cardEl.append(iconEl);
            cardEl.append(pEl2);
            cardEl.append(pEl3);
            cardEl.append(pEl4);
        };
    };
    
    // add buttons of recent searches
    var previousSearches = document.querySelector('#previousSearches');
    var recentSearches = function() {
        var cities = JSON.parse(localStorage.getItem('cities')) || [];
        previousSearches.innerHTML = null;
        for (var city of cities) {
            var searchesEl = document.createElement('button');
            searchesEl.textContent = city;
            searchesEl.className = 'btn btn-secondary m-2';
            previousSearches.appendChild(searchesEl);
        };
    };
    
    // uses the oneCall api tp gather weather data from given city
    var getOneCall = function(city) {
        var oneCall = `https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&appid=${appid}&units=imperial`;
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
    var noRepeats = Array.from(new Set(cities));
    var data = JSON.stringify(noRepeats);
    localStorage.setItem('cities', data);
    recentSearches();
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
    var geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${q.value}&appid=${appid}`;
    fetch(geoURL)
        .then(toJSON)
        .then(getGEO);
};

// allows recent search buttons to display correct info
var selectRecentSearch = function(event) {
    event.preventDefault();
    if (event.target.matches('button')) {
        var q = event.target.textContent;
        var geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${appid}`;
        fetch(geoURL)
            .then(toJSON)
            .then(getGEO);
    }
}
    
buttonEl.addEventListener('click', citySearch);
previousSearches.addEventListener('click', selectRecentSearch);