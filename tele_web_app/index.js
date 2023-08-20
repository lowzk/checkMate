const { urlencoded } = require('express');
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6544110821:AAGf4UPcFHrCf_i-jyaUfvEvJjADiFl_exw';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  console.log(msg);
  console.log(match);

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Define the specific text you want the bot to respond to
    const onboardText = "/onboard";
    const startText = "/start";

    // Check if the received text matches the specific text
    if (text === onboardText) {
        const response = "Welcome to our community of CheckMates! 👋🏻 We're grateful to have you on board to combat misinformation and scams. 🙇‍♀️🙇🏻 We'd love to get to know you better - could you *reply to this message* and share your name with us?";
        const replyMarkup = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text:'Yes', callback_data: 'yes'}], 
                    [{text:'No', callback_data: 'no'}]
                ]
            })
        };
        
        bot.sendMessage(chatId, response, replyMarkup);
        }
    
    else if (text === startText) {
        const response = "https://bit.ly/checkmates-wiki";
        
        bot.sendMessage(chatId, response);   
    }
});

// Listen for callback queries
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    if (action === 'yes') {
        bot.sendMessage(chatId, "Great! Please share your name with us.");
    } else if (action === 'no') {
        bot.sendMessage(chatId, "That's okay. If you change your mind, feel free to let us know!");
    }

    // Respond to the callback query
    bot.answerCallbackQuery(callbackQuery.id);
});

//set commands
bot.setMyCommands([
    {command: '/start', description: 'Start'},
    {command: '/onboard', description: 'Onboard'}
]);



// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });





// // Dependencies
// const express = require("express");
// const app = express();
// const axios = require("axios");
// const bodyParser = require("body-parser");
// const port = 80;
// const url = "https://api.telegram.org/bot";
// const apiToken = "6544110821:AAGf4UPcFHrCf_i-jyaUfvEvJjADiFl_exw";
// // Configurations
// app.use(bodyParser.json());


// // Endpoints
// app.post("/", (req, res) => {
//   // console.log(req.body);
//   const chatId = req.body.message.chat.id;
//   const sentMessage = req.body.message.text;
//   // Regex for hello
//   if (sentMessage.match(/hallo/gi)) {
//     axios
//       .post(`${url}${apiToken}/sendMessage`, {
//         chat_id: chatId,
//         text: "hello back 👋",
//       })
//       .then((response) => {
//         res.status(200).send(response);
//       })
//       .catch((error) => {
//         res.send(error);
//       });
//   } else {
//     // if no hello present, just respond with 200
//     res.status(200).send({});
//   }
// });


// // Listening
// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });
