require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const Redis = require('redis');
const fetch = require("node-fetch");
const DISCORD_TOKEN = process.env.BOT_TOKEN;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TEST_API_REQ = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=London&aqi=no`

const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;
const OPEN_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=las vegas&units=imperial&APPID=${OPEN_WEATHER_KEY}`;

const QUOTE_URL = "https://zenquotes.io/api/random";

const redisClient = Redis.createClient();

//permissions for bot
const intents = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
]

let sadWords = ["sad", 
    "depressed", 
    "unhappy", 
    "angry",
     "miserable"]

let encouragements = [
    "Cheer up!",
    "Hang in there.",
    "You are a great person / bot!"
  ]

// Create a new discord discordClient with permissions passed in (intents)
const discordClient = new Client({intents});

discordClient.login(DISCORD_TOKEN);

discordClient.on('ready', () =>{
    console.log('discord client ready to go!')
    discordClient.on("messageCreate", async message => {
       console.log('message received');

        if (message.author.bot) return;
        if (message.type === 'dm') return;

        if (message.content === 's') {
                    console.log('user typed $inspire');
                    // console.log(fetchWeatherData());
                    let weatherInfo = await fetchWeatherData();
                    // console.log("line 53 weather info ", weatherInfo);

                    //convert weather info obj to returnable string.
                    // let botMessage = `The current weather in ${weatherInfo.cityName} is ${weatherInfo.weatherDescription}.`;
                    let botMessage = `The current temperature in ${weatherInfo.cityName} is ${weatherInfo.currentTemp} degrees Fahrenheit.`;

                    // return weather info to discord
                     message.channel.send(botMessage);

                    weatherInfo = {};
                }
    })  
})

// this detructures weatherReport obj
function getWeatherDetails ({name, weather, main}) {
    let cityName = name;
    let weatherDescription = weather[0].description
    let currentTemp = main.temp
    console.log('current temp', currentTemp);
    // console.log(conditions);
    return {cityName, weatherDescription, currentTemp}
}

async function fetchWeatherData() {
    let response;
    let dataJSON;

    try {
        //  response = await fetch("https://zenquotes.io/api/random")
         response = await fetch(OPEN_WEATHER_URL);
         
         dataJSON =  await response.json();
     
          /**  OPENWEATHER DATA */
        // const {name, weather} = dataJSON; //destructure

        let weatherReport = getWeatherDetails(dataJSON);
        // console.log(dataJSON);

        console.log("line 89 return to bot", weatherReport);
        return weatherReport

    } catch (err) {
        console.error(err);
    }
}







function updateEncouragements (encouragingMessage) {
    //push message to redis database
}



