var historyList = document.querySelector('#history');
var inputEl = document.querySelector('.form-input');
var forecastEl = document.querySelector('.forecast');
var resultPage = document.querySelector(".result");
var currentEl = $('.current');
var buttonclickEl = $('#history');
var cityName = "";
var saveList = [];

var currentTime = moment();
$(".time").text(currentTime.format("MMM Do, YYYY"));


var submitFormEl = $("#search-form");

function getData (event) 
{
    event.preventDefault();
    var searchName = inputEl.value.trim();
    if (!searchName) 
    {
        alert("Enter a city name!");
        return;
    }

    currentEl.textContent = "";
    forecastEl.textContent = "";
    inputEl.value = "";
    getLink(searchName);
}

function getLink(searchName) 
{
    weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchName + "&units=imperial&appid=416af2287105033badad2b026eeca30c"
    todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchName + "&units=imperial&appid=416af2287105033badad2b026eeca30c"
    getWeatherInfo(weatherUrl);
    gettodayweather(todayUrl);
}

function getWeatherInfo(request) 
{
    fetch(request)
    .then(function (response) {
        if (response.ok) 
        {
            response.json()
            .then(function (data) 
            {
                fivedayweather(data);
            });
        } 
        else 
        {
            alert('Error ' + response.statusText)
        }   
    })
    .catch(function (error) {
        alert('Cant connect to the data')
    });
}

function gettodayweather(request) 
{
    fetch(request)
    .then(function (response) {
        if (response.ok) 
        {
            response.json()
            .then(function (data) {
                todayweather(data);
            });
        } 
        else 
        {
            alert('Error ' + response.statusText)
        }   
    })
    .catch(function (error) {
        alert('Cant connect to the data')
    });
}

function todayweather(data) 
{
    var statename = document.querySelector(".search-current");
    statename.textContent = data.name;
    var img = document.createElement('img');
    var currentIcon = "http://openweathermap.org/img/wn/"+ data.weather[0].icon +"@2x.png";
    img.setAttribute('src', currentIcon);
    img.setAttribute('alt', data.weather[0].description);
    var currentInfo = document.querySelector(".current-info");
    currentInfo.innerHTML =`temp: ${data.main.temp} °F` + "<br>"
    currentInfo.innerHTML +=`wind: ${data.wind.speed} MPH` + "<br>"
    currentInfo.innerHTML += `humidity: ${data.main.humidity} %`
    statename.appendChild(img);
    var dataName = data.name;
    listofName(dataName);
}

function listofName(name) 
{
    cityName = name;
    console.log(cityName)
    for(var i = 1; i < saveList.length; i++) 
    {
        if (saveList[i] === name) 
        {
            return;
        }
    }
    if (saveList.length >= 8) 
    {
        saveList.push(`${name}`);
        saveList.pop();
    } 
    else 
    {
        saveList.push(`${name}`);  
    }
    console.log(saveList)
    local();
}

function fivedayweather(data) 
{
    resultPage.classList.remove("hidden");
    for (var i = 5; i < data.list.length; i+=8) 
    {
        var thread = document.createElement('thread');
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        var td = document.createElement('td')
        var img = document.createElement('img');
        tr.textContent = data.list[i].dt_txt;
        var iconLink = "http://openweathermap.org/img/wn/"+ data.list[i].weather[0].icon +"@2x.png";
        img.setAttribute('src', iconLink);
        img.setAttribute('alt', data.list[i].weather[0].main);

        td.innerHTML =`temp: ${data.list[i].main.temp} °F` + "<br>"
        td.innerHTML +=`wind: ${data.list[i].wind.speed} MPH` + "<br>"
        td.innerHTML += `humidity: ${data.list[i].main.humidity} %`
        
        tr.appendChild(img);
        tr.appendChild(td);
        tr.appendChild(th);
        thread.appendChild(tr);
        thread.setAttribute("class", "col-lg-2 col-12 five");
        forecastEl.appendChild(thread);
    }
}

function local() 
{
    localStorage.setItem("saveList",JSON.stringify(saveList)); 
    historyrender(); 
}

function historyrender() 
{ 
    var output = JSON.parse(localStorage.getItem("saveList"));
    console.log(output)
    saveList = output;
    if (saveList === null) 
    {
        saveList = [cityName];
        return;
    } 
    else 
    {
        historyList.textContent = "";
        for (var i = 1; i < saveList.length; i++) 
        {
            var historyEl = document.createElement('button');
            historyEl.setAttribute("class","recallBtn");
            historyEl.setAttribute("data-name", saveList[i]);
            historyEl.textContent = saveList[i];
            historyList.appendChild(historyEl);
        }   
    }
    
}

function getCityName(event) 
{
    var searching = event.target.getAttribute('data-name');
    currentEl.textContent = "";
    forecastEl.textContent = "";
    inputEl.value = "";
    getLink(searching);
}

console.log(saveList)
buttonclickEl.on('click', getCityName);
submitFormEl.on('submit', getData);
resultPage.classList.add("hidden");
historyrender();