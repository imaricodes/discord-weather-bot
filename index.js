//RESOURCES
//API used: https://openweathermap.org/
//used for xml formatting: xmlbuilder2 https://www.npmjs.com/package/xmlbuilder2 
//lob.com for api formatting


require('dotenv').config();
const xmlbuilder2 = require('xmlbuilder2');
const axios = require('axios').default

//usps credentials
const USERNAME = process.env.USPS_API_ID

let userZip = '44118'
let cityStateObj = {
    "city": '',
    "state": ''
}

/** START ZIP CODE API*/
let root = xmlbuilder2.create({version: '1.0'})
.ele('CityStateLookupRequest', {USERID: USERNAME})
    .ele('ZipCode')
        .ele('Zip5').txt(`${userZip}`).up()
    .up()
.up();

let xml=root.end({prettyprint: true});

/** 
 * Look up city and state based on zip code
 */
let ZIPLOOKUP_URL ='https://secure.shippingapis.com/ShippingAPI.dll?API=CityStateLookup&xml=' + encodeURIComponent(xml);

//TODO: How to handle nonexistent or incorrectly formatted zip code
axios.get(ZIPLOOKUP_URL)
.then(function(response){
    const obj = xmlbuilder2.convert(response.data, {format: 'object'});
    // console.log(obj.CityStateLookupResponse.ZipCode.City);
    let userLocation = obj;
    const {CityStateLookupResponse:{ZipCode:{State}}, CityStateLookupResponse:{ZipCode:{City}}} = userLocation;
    cityStateObj.city = City
    cityStateObj.state = State
    console.log('city state obj: ', cityStateObj);
    console.log('City and state are ', City, State);
})
.catch (function(error){
    console.log(error);
});

/** END ZIP CODE API*/



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

//TODO: replace city and state with template literal from usps api resuts (return city and state from axios fetch as an object?)
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



// this detructures weatherReport obj (NOT REALLY DESTRUCTURING??)
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






