require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const Redis = require('redis');
const fetch = require("node-fetch");
const DISCORD_TOKEN = process.env.BOT_TOKEN;

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
    discordClient.on("messageCreate", message => {
       console.log('message received');

        if (message.author.bot) return;
        if (message.type === 'dm') return;

        if (message.content === '$inspire') {
                    console.log('user typed $inspire');
                    getQuote().then(quote => message.channel.send(quote))
                }
    })  
})

async function getQuote() {
    let response;
    let dataJSON;
    let data;

    try {
         response = await fetch("https://zenquotes.io/api/random")
         dataJSON = await response.json();
         data = await dataJSON[0]["q"] + " -" + dataJSON[0]["a"]
        return data;
    } catch (err) {
        console.errror(err);
    }
}


function updateEncouragements (encouragingMessage) {
    //push message to redis database

}



//  function createRedisSet () {     
//      redisClient.set('quotes', 'quute3'), (err, reply) => {
//         console.log(reply); // 3
//       });


    // redisClient.sadd(['quotes', 'quote1', 'quote2', 'quute3'], function(err, reply) {
    //     console.log(reply); // 3
    //   });
// }

// createRedisSet();



// (async () => {
//     redisClient.on('error', (err) => console.log('Redis Client Error', err));
//     await redisClient.connect();
// })


