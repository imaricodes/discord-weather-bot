//API used: https://openweathermap.org/

require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const Redis = require('redis');
const fetch = require("node-fetch");
const redisClient = Redis.createClient();

const DISCORD_TOKEN = process.env.BOT_TOKEN;
// const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
// const TEST_API_REQ = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=London&aqi=no`

const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;
// const OPEN_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=las vegas&units=imperial&APPID=${OPEN_WEATHER_KEY}`;

const OPEN_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=detroit,mi,usa&units=imperial&APPID=${OPEN_WEATHER_KEY}`;




//permissions for bot
const intents = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
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

        if (message.content.startsWith('!')) {
            console.log(message.content);
            let cityState = validateCityStateFormat('detroit, mI');
            // console.log('cats', cats);
            let botMessage = 'If you\'d like to know the weather where you are, type your city and two letter state separated by a comma'
            
            //check that city state is in correct format
            cityState ? console.log('correct format') : console.log('incorrect format');

            //if format is correct, split into two strings: city and state

            //validate city and state existence with usps api

            //if city and state existence is valid (are actual locations) submit to weather api  fetchWeather() > return results

            //if format is incorrect, notify user to try again with correctly formatted city state then return from this if block

    
            

            // let textValidate = useRegex(message.content)
            // console.log('validate', textValidate);
                    let weatherInfo = await fetchWeatherData();
                   

                    //convert weather info obj to returnable string.
                    // let botMessage = `The current weather in ${weatherInfo.cityName} is ${weatherInfo.weatherDescription}.`;
                    // let botMessage = `The current temperature in ${weatherInfo.cityName} is ${weatherInfo.currentTemp} degrees Fahrenheit.`;
                    // let botMessage = `The current temperature in your zipcode is ${weatherInfo.currentTemp} degrees Fahrenheit.`;

                    // return weather info to discord
                     message.channel.send(botMessage);

                     //clear weather info
                    weatherInfo = {};
                }
    })  
})


//this regex test checks if there is a string followed by a comma (how to limit this to one?) folowed by a string of only two letters
function validateCityStateFormat(input) {
    let regex = /^[a-zA-Z\s]+,\s*[A-Z][A-Z]/; //matches city comma two cap letters for state
    return regex.test(input);
}

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
         response = await fetch(OPEN_WEATHER_URL);
         
         dataJSON =  await response.json();
     
          /**  OPENWEATHER DATA */
        // const {name, weather} = dataJSON; //destructure

        let weatherReport = getWeatherDetails(dataJSON);
        // console.log(dataJSON);

        // console.log("line 89 return to bot", weatherReport);
        return weatherReport

    } catch (err) {
        console.error(err);
    }
}






