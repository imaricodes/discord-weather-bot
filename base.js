// Requirements for discord bot
const { Client, Intents } = require('discord.js');
const { parsed } = require('dotenv').config({ path: `.env.subot` });
const DISCORD_TOKEN = parsed['BOT_TOKEN'] || process.env.BOT_TOKEN;

const OPENAI_MODEL = "text-davinci-003"
	// "gpt-3.5-turbo"

//permissions for discord bot
const intents = [
   Intents.FLAGS.GUILDS,
   Intents.FLAGS.GUILD_MESSAGES,
]

// Create a new discord discordClient with permissions passed in (intents)
const discordClient = new Client({intents});

discordClient.login(DISCORD_TOKEN);

const startBot = ({ botName }) => {

    botName = botName || 'defaultBot';

    const OPENAI_API_KEY = parsed['OPENAI_API_KEY'] || process.env.OPENAI_API_KEY;
    console.log('OPENAI API Key', OPENAI_API_KEY);

    const onMessageHandler = async message => {
        console.log('message received 2 ' + message.content);

        // if the message is from a bot, exit
        if (message.author.bot) {
	    console.log('bot message');
            return;
	}

	   
        // if the message is a direct message, exit
        if (message.type === 'dm') {
            console.log('dm');
            return;
        }

        if (message.content.startsWith('!')) {
         
             const userMessage = message.content.slice(1);

             if (/ai/.test(userMessage)) {
                console.log(`ai message ${userMessage}`);

                const { Configuration, OpenAIApi } = require("openai");
                const configuration = new Configuration({
                    apiKey: OPENAI_API_KEY,
                });
                const prompt = userMessage.slice(3);
                const openai = new OpenAIApi(configuration);
                const response = await openai.createCompletion({
                    model: OPENAI_MODEL, 
                    prompt: prompt,
                    temperature: 0,
                    max_tokens: 124,
                });
		const answers = response['data']['choices']
                console.log('Response: ' + JSON.stringify(answers));
		answerLength = answers.length;
		console.log(`Answer had ${answerLength} choices`);
		const result =  answers.reduce((sum, x) => `${sum} ${x['text']}`);
                console.log(`Result ${JSON.stringify(result)}`); 
		     // answer = response['data']['choices'][0]['text'];
		     //console.log('Response: ' + JSON.stringify(response['data']['choices']));
	         await message.channel.send(answers[0]['text']);
	         await message.channel.send('```'+ JSON.stringify(answers[0])+'```');
	     }
	 }
     }

    discordClient.on('ready', () =>{
        console.log('discord client ready to go!')

        discordClient.on("messageCreate", async (message) => {
            console.log(JSON.stringify(message));
            try {
                await onMessageHandler(message);
            } catch (err) {
                console.error(err);
                await message.channel.send(err);
            }
        })  
    })

 }

startBot({ botName: 'subot' });

