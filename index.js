//RESOURCES
//API used: https://openweathermap.org/
//used for xml formatting: xmlbuilder2 https://www.npmjs.com/package/xmlbuilder2 
//lob.com for api formatting


require('dotenv').config();
const xmlbuilder2 = require('xmlbuilder2');
const axios = require('axios').default

//usps credentials
const USERNAME = process.env.USPS_API_ID

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const Redis = require('redis');
const fetch = require("node-fetch");

const DISCORD_TOKEN = process.env.BOT_TOKEN;
// const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
// const TEST_API_REQ = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=London&aqi=no`

const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;
// const OPEN_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=las vegas&units=imperial&APPID=${OPEN_WEATHER_KEY}`;



//TODO: How to handle nonexistent or incorrectly formatted zip code



const getCityState = async (userZip) => {
    
    let root = xmlbuilder2.create({version: '1.0'})
    .ele('CityStateLookupRequest', {USERID: USERNAME})
        .ele('ZipCode')
            .ele('Zip5').txt(`${userZip}`).up()
        .up()
    .up();

    let xml=root.end({prettyprint: true});


    const output = await axios.get('https://secure.shippingapis.com/ShippingAPI.dll?API=CityStateLookup&xml=' + encodeURIComponent(xml))
    .then(response => {
        const userLocation = xmlbuilder2.convert(response.data, {format: 'object'});
        // console.log('1 geCityState():',userLocation.CityStateLookupResponse.ZipCode.City);

        const {CityStateLookupResponse:{ZipCode:{State}}, CityStateLookupResponse:{ZipCode:{City}}} = userLocation;

        let cityStateObj = {
            city: City,
            state: State
        }
        console.log('city state obj: ', cityStateObj);
        // console.log('City and state are ', City, State);
        return cityStateObj;
    })
    
    // .then((location) => {
    //     console.log('zipzip: ', location);
    //     fetchWeatherData(location)
    // })
    // .then ((cityStateObj)=>{
    //     console.log('made it: ', cityStateObj);

    // })
    .catch (function(error){
        console.log(error);
    });
}


async function getWeather(userZip) {
  await getCityState(userZip)
  .then((data)=>{
        
        // fetchWeatherData(data)
        console.log('get weather data: ', data);
    })
//    await fetchWeatherData(test);
//    console.log('second');
     
    // .then((cityStateObj) => {
    //     // console.log(cityStateObj);
    //     fetchWeatherData(cityStateObj)
    //    }) 
    // .then((dataJSON) => {getWeatherDetails(dataJSON)}) //return weather details as object
    // .then((data) => {
    //     let weatherReport = data;
    //     return weatherReport;
    // })
}

getWeather('44118');

// getCityState('44118')




//TODO: replace city and state with template literal from usps api resuts (return city and state from axios fetch as an object?)
// const OPEN_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=detroit,mi,usa&units=imperial&APPID=${OPEN_WEATHER_KEY}`;


// this detructures weatherReport obj (NOT REALLY DESTRUCTURING??)
async function getWeatherDetails ({name, weather, main}) {
    let cityName = name;
    let weatherDescription = weather[0].description
    let currentTemp = main.temp
    console.log('current temp', currentTemp);
    // console.log(conditions);
    return {cityName, weatherDescription, currentTemp}
}

async function fetchWeatherData(test) {
    // console.log('2 fetchWeatherData() why undefined: ', test);
    let response;
    let dataJSON;
    // let city = test.city.toLowerCase()
    // let state = test.state.toLowerCase()
    // console.log(city, state);

    try {

        console.log('test success: ', test);
        
        //  response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},usa&units=imperial&APPID=${OPEN_WEATHER_KEY}`);
         response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=denver,co,usa&units=imperial&APPID=${OPEN_WEATHER_KEY}`);
         
         
         dataJSON =  await response.json();
         console.log(dataJSON);
     
          /**  OPENWEATHER DATA */
        // const {name, weather} = dataJSON; //destructure

        // let weatherReport = await getWeatherDetails(dataJSON);
        // console.log(dataJSON);

        // console.log("line 89 return to bot", weatherReport);
        // return dataJSON

    } catch (err) {
        console.error(err);
    }
}


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
                // let cityState = validateCityStateFormat('detroit, mi');
                // console.log('cats', cats);
                let botMessage = 'If you\'d like to know the weather where you are, enter your 5 digit US zip code'
                // let weatherInfo = await fetchWeatherData();
                    
                //convert weather info obj to returnable string.
                // let botMessage = `The current weather in ${weatherInfo.cityName} is ${weatherInfo.weatherDescription}.`;
                // let botMessage = `The current temperature in ${weatherInfo.cityName} is ${weatherInfo.currentTemp} degrees Fahrenheit.`;
                // let botMessage = `The current temperature in your zipcode is ${weatherInfo.currentTemp} degrees Fahrenheit.`;

                // return weather info to discord
                message.channel.send(botMessage);

                //clear weather info
                // weatherInfo = {};
        }
    })  
})



