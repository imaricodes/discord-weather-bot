# Discord Weather Bot

The purpose of this bot is to retrieve the current weather conditions based on a zip code.

# Resources
**APIs:**

openweathermap.org

usps.com/business/web-tools-apis

**NPM packages:**

xmlbuilder2

Axios

discord.js

# Future Plans
* Add more detailed error handling throughout app.
* Add welcome message to discord bot.
* Add images to bot responses based on weather conditions. (Is this possible?)
* Add forecast? (Possible with openweathermap?)
Make forecast descriptions more detailed and natural sounding
* Add link to discord server in this ReadMe


# Project Story

This project started as my initial foray into using APIs. What I quickly discovered is that sending a request to an API is not very complicated. What challenged me the most was understanding asynchronous functions. Asynchronous functions! And Promises! Why were you so hard to understand? Honestly, for weeks, it felt like a very unhappy relationship.

Now, however, my grip on asynchronous functions is pretty firm. I'm eternally grateful that Await/Async was incorporated into the javascript specs by the time I started my journey.

Another objective of this project was to use FREE api's. There are of course api's that will do everything I wanted, but they were either not free or limited to a very small number of requests per day. No bueno. 

There were two important factors - 1) Openweathermap,org requires a city and state to return the current weather. Typing in a city and state however, presents many opportunities for bad input. I went through several ideas of how to parse that input (regex, for one) but no solution seemed foolproof. Further, I don't think most users would want to enter their specific city and state on a public facing website. This is when I had to idea use zip codes. While zip codes reveal some personal information, it's very general. I'm more comfortable with that.

Now, what (free!) API could I use to take a zip code and return a city and state? Pretty much none without the restrictions mentioned above. It turned out one did - The United States Postal Service's web tools. The downside of this service is that - like many government institutions - is kind of in the dark ages in that it still relies on xml for receiving and sending data.

I surely could format my request into XML, but the response data also needed to be converted back into a usable javascript object. Mastering XML was not part of my plan so I found this tool: xmlbuilder2. Now that that issue solved, the hardest hurdle for me presented itself: asynchronous functions. 

I won't go into great detail about my asynchronous function learning. The main problem I had was with handling the response data, using them outside of the asynchronous function, and making my asynchronous functions run in the correct order (awaiting promises). I can't tell you how many times I threw my hands up when the console.log returned <promise pending>! Nightmares for weeks!

So, to make a short story a little longer, I finally joyously arrived at this commit message: 'Working version complete'.. or something to that effect.

## Code Review / Feedback
If you'd like to offer constructive criticism or random praise, I'll take it all with the spirit in which it is offered. Thank you!

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.