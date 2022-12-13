const { createClient } = require('redis');

const client = createClient();

// Redis schema, key => value
// username (str) => score (number as str)
const initPlusPlus = async () => {

   await client.connect();

}

// !++ @username
const plusPlus = async (username) => {
   const currentScoreStr = await client.get(username);
   const newScore = (currentScoreStr) ? Number.parseInt(currentScoreStr) + 1 : 1;
   await client.set(username, newScore);
   return newScore;
}

module.exports = {
   plusPlus,
   initPlusPlus,
}