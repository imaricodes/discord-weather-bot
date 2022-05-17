require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');


/** one way to reference permissions using flags */

// const intents = [
//     Intents.FLAGS.GUILDS,
//     Intents.FLAGS.GUILD_MESSAGES
// ]

/** another way to reference permissions using bitfield generated on developer page */

const intentsBitfield = new Intents(32509);


 // Create a new client instance with intents option
const client = new Client({intents: intentsBitfield});



// const client = new Discord.Client();

// When the client is ready, run this code (only once)
// client.once('ready', () => {
// 	console.log('Ready!');
// });

client.on('ready', () =>{
    console.log('ready to go!')
})

client.on('message', msg => {
    if (msg.content === 'ping'){
        msg.reply("pong");
    }
})

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
