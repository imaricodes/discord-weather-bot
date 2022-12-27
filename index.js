//RESOURCES
//API used: https://openweathermap.org/
//used for xml formatting: xmlbuilder2 https://www.npmjs.com/package/xmlbuilder2 
//lob.com for api formatting


require('dotenv').config();

//xmbuilder2 converts js objects to xml and back to a js object. This is needed because USPS api only works with xml
const xmlbuilder2 = require('xmlbuilder2');
const axios = require('axios').default

//usps api credentials
const USERNAME = process.env.USPS_API_ID
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

// Requirements for discord bot
const { Client, Intents } = require('discord.js');
const DISCORD_TOKEN = process.env.BOT_TOKEN;



//find the city and state from USPS api based on zip code
const getCityState = async (userZip) => {
    
    let root = xmlbuilder2.create({version: '1.0'})
    .ele('CityStateLookupRequest', {USERID: USERNAME})
        .ele('ZipCode')
            .ele('Zip5').txt(`${userZip}`).up()
        .up()
    .up();

    let xml=root.end({prettyprint: true});


    const {data:response} = await axios.get('https://secure.shippingapis.com/ShippingAPI.dll?API=CityStateLookup&xml=' + encodeURIComponent(xml))

    const userLocation = xmlbuilder2.convert(response, {format: 'object'});

    const {CityStateLookupResponse:{ZipCode:{State}}, CityStateLookupResponse:{ZipCode:{City}}} = userLocation;

        let cityStateObj = {
            city: City,
            state: State
        }

    return cityStateObj

}

//get weather data from openweathermap.org based on zip code
const fetchWeatherData = async ({ city, state }) => {
    let response;

    try {
        let city = cityStateObj.city?.toLowerCase()
        let state = cityStateObj.state?.toLowerCase()

        response = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},usa&units=imperial&APPID=${OPEN_WEATHER_KEY}`);

          /**  OPENWEATHER DATA */
        const {data:weatherData} = response; //destructure

        cityStateObj.description = weatherData.weather[0].description
        cityStateObj.temperature = weatherData.main.temp
        // console.log('new object  ', cityStateObj);
        return cityStateObj

    } catch (err) {
        console.error(err);
    }
}

//this function runs the getCityState, and fetchWeatherData functions 
async function getWeather(userZip) {
    let cityAndState =  await getCityState(userZip)
    let currentWeather = await fetchWeatherData(cityAndState)
    // let stepThree = await getWeatherDetails(stepTwo)
    // console.log(currentWeather);
    return currentWeather
  
  }
  

//permissions for discord bot
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

        //if the message is from a bot, exit
        if (message.author.bot) return;

        //if the message is a direct message, exit
        if (message.type === 'dm') return;

        if (message.content.startsWith('!')) {
             
                let userMessage = message.content.substring(1)
                let userInputRegex = /^\d{5}$/
                
                if (userInputRegex.test(userMessage) ) {
                    let weatherInfo = await getWeather(userMessage)
                    let botMessage = `The current temperature in ${weatherInfo.city} is ${weatherInfo.temperature} degrees Fahrenheit.`;
                    message.channel.send(botMessage);
                }
                else {
                    message.channel.send("U.S. ZIP code not detected (5 digits)")
                    return
                }
                
        }
    })  
})



