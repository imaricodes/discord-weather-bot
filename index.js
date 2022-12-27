  //RESOURCES
  //API used: https://openweathermap.org/
  //used for xml formatting: xmlbuilder2 https://www.npmjs.com/package/xmlbuilder2
  //lob.com for api formatting

  require("dotenv").config();

  //xmbuilder2 converts js objects to xml and back to a js object. This is needed because USPS api only works with xml
  const xmlbuilder2 = require("xmlbuilder2");
  const axios = require("axios").default;

  //usps api credentials
  const USERNAME = process.env.USPS_API_ID;
  const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

  // Requirements for discord bot
  const { Client, Intents } = require("discord.js");
  const DISCORD_TOKEN = process.env.BOT_TOKEN;

  //find the city and state from USPS api based on zip code
  const getCityState = async (userZip) => {
    let root = xmlbuilder2
      .create({ version: "1.0" })
      .ele("CityStateLookupRequest", { USERID: USERNAME })
      .ele("ZipCode")
      .ele("Zip5")
      .txt(`${userZip}`)
      .up()
      .up()
      .up();

    let xml = root.end({ prettyprint: true });

    const { data: response } = await axios.get(
      "https://secure.shippingapis.com/ShippingAPI.dll?API=CityStateLookup&xml=" +
        encodeURIComponent(xml)
    );

    const userLocation = xmlbuilder2.convert(response, { format: "object" });

    const {
      CityStateLookupResponse: {
        ZipCode: { State },
      },
      CityStateLookupResponse: {
        ZipCode: { City },
      },
    } = userLocation;

    let cityStateObj = {
      city: City,
      state: State,
    };

    return cityStateObj;
  };

  //get weather data from openweathermap.org based on zip code
  const fetchWeatherData = async ({ city, state }) => {

    const combo = `${city},${state}`.toLowerCase()
      
    if(combo === ',') {
      throw new Error('Missing location.')
    }

    const response = await axios(
      `https://api.openweathermap.org/data/2.5/weather?q=${combo},usa&units=imperial&APPID=${OPEN_WEATHER_KEY}`
    );

    /**  OPENWEATHER DATA */
    const { data: { weather: [{ description }], main: { temp: temperature } } } = (response)

    return {city, state, description, temperature };
  };

  //this function runs the getCityState, and fetchWeatherData functions
  async function getWeather(userZip) {
    let cityAndState = await getCityState(userZip);
    let currentWeather = await fetchWeatherData(cityAndState);
    // let stepThree = await getWeatherDetails(stepTwo)
    // console.log(currentWeather);
    return currentWeather;
  }

  //permissions for discord bot
  const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES];

  // Create a new discord discordClient with permissions passed in (intents)
  const discordClient = new Client({ intents });

  discordClient.login(DISCORD_TOKEN);

  discordClient.on("ready", () => {
    console.log("discord client ready to go!");
    discordClient.on("messageCreate", async (message) => {
      console.log("message received");

      //if the message is from a bot, exit
      if (message.author.bot) return;

      //if the message is a direct message, exit
      if (message.type === "dm") return;
      if(message.content.startsWith('!')) {
        try {
          const zip = message.content.slice(1).trim()
              
          if(!/^\d{5}$/.test(zip) ) {
            throw new Error('This program only accepts U.S. five digit zip  codes.')
          }
          const { city, temperature } = await getWeather(zip)
          const out = `The current temperature in ${city} is ${temperature}°F.`
          message.channel.send(out)
        } catch(error) {
          message.channel.send(`Error: ${error.message}`)
        }
      }
    });
  });
