import fetch from "node-fetch";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(cors());
app.use(express.json());

async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        return { error: error.message };
    }
}

app.get("/weather", async (req, res) => {
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: "City name is required" });
    }

    const weatherData = await getWeatherData(city);
    res.json(weatherData);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
