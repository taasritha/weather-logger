require("dotenv").config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

let weatherData = {
    city1: [],
    city2: [],
    city3: []
};

async function getWeatherData(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`);
    const data = await response.json();
    // console.log(data)
    return data;
}

async function logWeatherData() {
    const city1 = document.getElementById('city1').value;
    const city2 = document.getElementById('city2').value;
    const city3 = document.getElementById('city3').value;

    const weatherPromises = [
        getWeatherData(city1),
        getWeatherData(city2),
        getWeatherData(city3)
    ];

    const [data1, data2, data3] = await Promise.all(weatherPromises);

    weatherData.city1.push(data1.main.temp);
    weatherData.city1.push(data1.main.humidity);

    weatherData.city2.push(data2.main.temp);
    weatherData.city2.push(data2.main.humidity);

    weatherData.city3.push(data3.main.temp);
    weatherData.city3.push(data3.main.humidity);

    displayWeather(data1, data2, data3);

    updateChartTemp(city1, city2, city3);
}

function displayWeather(data1, data2, data3) {
    const weatherResultDiv = document.getElementById('weatherResult');
    
    const timestamp = new Date().toLocaleString();
    
    weatherResultDiv.innerHTML = `
        <br>
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>City</th>
                    <th>Temperature (°C)</th>
                    <th>Humidity (%)</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${data1.name}</td>
                    <td>${data1.main.temp}</td>
                    <td>${data1.main.humidity}</td>
                    <td>${timestamp}</td>
                </tr>
                <tr>
                    <td>${data2.name}</td>
                    <td>${data2.main.temp}</td>
                    <td>${data2.main.humidity}</td>
                    <td>${timestamp}</td>
                </tr>
                <tr>
                    <td>${data3.name}</td>
                    <td>${data3.main.temp}</td>
                    <td>${data3.main.humidity}</td>
                    <td>${timestamp}</td>
                </tr>
            </tbody>
        </table>
        <br>
    `;
}


let weatherChart;

function updateChartTemp(city1, city2, city3) {
    const ctx = document.getElementById('weatherChart').getContext('2d');

    if (weatherChart) {
        weatherChart.destroy();
    }

    weatherChart = new Chart(ctx, {
        type: 'line',  
        data: {
            labels: [city1, city2, city3], 
            datasets: [
                {
                    label: 'Temperature (°C)',  
                    data: [
                        weatherData.city1[weatherData.city1.length - 2],  
                        weatherData.city2[weatherData.city2.length - 2],  
                        weatherData.city3[weatherData.city3.length - 2],  
                    ],
                    backgroundColor: ['#F29300', '#F29300', '#F29300'],  
                    borderWidth: 5,
                    pointRadius: 7
                },
                {
                    label: 'Humidity (%)',  
                    data: [
                        weatherData.city1[weatherData.city1.length - 1],  
                        weatherData.city2[weatherData.city2.length - 1],  
                        weatherData.city3[weatherData.city3.length - 1],  
                    ],
                    backgroundColor: ['#21A0A0', '#21A0A0', '#21A0A0'],  
                    borderWidth: 5,
                    pointRadius: 7  
                }
            ]
        }
    });
}

document.getElementById('logWeatherBtn').addEventListener('click', logWeatherData);
