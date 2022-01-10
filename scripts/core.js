$( function() {

    // let xmlContent = '';
    // fetch('./assets/indian_states.xml').then((response)=>{
    //     response.text().then((xml) => {
    //         xmlContent = xml;
    //         let parser = new DOMParser();
    //         let xmlDOM = parser.parseFromString(xmlContent, 'application/xml');
    //         let items = xmlDOM.querySelectorAll('item');
    //         items.forEach(item => {
    //             availableCity.push(item.innerHTML);
    //         });
    //     });
    // });

    // Parsing the xml file and storing names in availableCity array
    var client = new XMLHttpRequest();
    client.open('GET', './assets/indian_states.xml');
    client.onreadystatechange = function() {
        var response = client.responseText,
        parser = new DOMParser(),
        xmlDoc = parser.parseFromString(response,"text/xml");
        let items = xmlDoc.querySelectorAll('item');
        items.forEach(item => {
            availableCity.push(item.innerHTML);
        });
    }
    client.send();
    
    // jQuery ui autocomplete
    var availableCity = [];
    $( "#city" ).autocomplete({
      source: availableCity
    });
});


// Check if localStorage contain any data while entering the page and if it contain then call the fetchAPI function which will update the page
if(localStorage.getItem("city")){
    fetchAPI(localStorage.getItem("city"));
}
else {
    fetchAPI("Ranchi");
}

//  Validate city name as it should only contain alphabets using regex
function validateCityName(city){
    var alph = /^[A-Za-z ]+$/;
    if(city.match(alph)){
        return true;
    } 
    else {
        return false;
    }
}

// Triggered by button click
function searchWeather(){ 
    let city = document.getElementById('city').value;
    validateCityName(city);
    if(!validateCityName(city)){
        alert("Enter Valid City Name");
    }
    else {
        fetchAPI(city);
        localStorage.setItem("city", city);
    }
}

// FetchAPI function will make a GET request to the the OpenWeather API
function fetchAPI(city){
    const apiKey = config.SECRET_API_KEY_DEFAULT;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // let request = new XMLHttpRequest();
    // request.open("GET", url);
    // request.send();

    // request.onload = () => {
    //     if(request.status === 200) {
    //         var response = JSON.parse(request.response);
    //         console.log(response.weather[0].main);
    //         var weather = response.weather[0].main;

    //         changeBackground(weather);      //It will change the backgroud color of the page and update weather name according to the weather of the city
    //         document.getElementById('city-name').innerText = response.name;
    //     } else {
            // console.log(`Error ${request.status} & ${request.statusText}`);
            // alert(city + " " + request.statusText);
    //     }
    // }

    fetch(url).then(response => {
        console.log(response);
        return response.json();
    }).then(data => {
        console.log(data.weather[0].main);
        var weather = data.weather[0].main;

        changeBackground(weather);
        document.getElementById('city-name').innerText = data.name;
    }).catch(error => {
        // console.log(data);
        console.error(error);
        alert(city + " Not found");
    });
}

// It will change the backgroud color of the page and update weather name according to the weather of the city
function changeBackground(weather){
    var body = document.getElementsByTagName("body")[0];
    var weatherName = document.getElementById('city-weather');

    if('clear' === weather.toLowerCase()){
        body.style.backgroundColor = '#FFEA00';
        weatherName.innerText = weather;
    } else if('clouds' === weather.toLowerCase()){
        body.style.backgroundColor = '#FF5733';
        weatherName.innerText = "Cloudy";
    } else if('snow' === weather.toLowerCase() || 'rain' === weather.toLowerCase()) {
        body.style.backgroundColor = '#FF5733';
        if('snow' === weather.toLowerCase()){
            weatherName.innerText = "Snowy";
        }
        else {
            weatherName.innerText = "Rainy";
        }
    } else {
        body.style.backgroundColor = '#F0F0F0';
        weatherName.innerText = weather;
    }
}


