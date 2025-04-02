let weatherData = {
            city1: [],
            city2: [],
            city3: []
        };

async function getWeatherData(city) {
    try {
        const response = await fetch(`http://localhost:3000/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch weather data");
        }
        // console.log(data)
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function logWeatherData() {
    const city1 = document.getElementById('city1').value.trim();
    const city2 = document.getElementById('city2').value.trim();
    const city3 = document.getElementById('city3').value.trim();

    const weatherPromises = [getWeatherData(city1), getWeatherData(city2), getWeatherData(city3)];
    const results = await Promise.all(weatherPromises);

    if (results.includes(null)) {
        alert("Some city names might be incorrect. Please check and try again.");
        return;
    }

    const [data1, data2, data3] = results;

    weatherData.city1.push(data1.main.temp, data1.main.humidity);
    weatherData.city2.push(data2.main.temp, data2.main.humidity);
    weatherData.city3.push(data3.main.temp, data3.main.humidity);

    displayWeather(data1, data2, data3);
    updateChartTemp(city1, city2, city3);
}

function displayWeather(data1, data2, data3) {
    const weatherResultDiv = document.getElementById('weatherResult');
    const timestamp = new Date().toLocaleString();

    weatherResultDiv.innerHTML = `
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
                        weatherData.city1.at(-2),
                        weatherData.city2.at(-2),
                        weatherData.city3.at(-2),
                    ],
                    borderColor: '#F29300',
                    backgroundColor: '#21a0a0',
                    borderWidth: 2,
                    pointRadius: 5
                },
                {
                    label: 'Humidity (%)',
                    data: [
                        weatherData.city1.at(-1),
                        weatherData.city2.at(-1),
                        weatherData.city3.at(-1),
                    ],
                    borderColor: '#21A0A0',
                    backgroundColor: '#21a0a0',
                    borderWidth: 2,
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}

document.getElementById('logWeatherBtn').addEventListener('click', logWeatherData);
