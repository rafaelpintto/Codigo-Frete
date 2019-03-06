require('dotenv').load();

const bot = { token : process.env.BOT_TOKEN, chatId : process.env.BOT_CHATID};
const { TelegramClient } = require('messaging-api-telegram');
const client = TelegramClient.connect(bot.token);

module.exports = {
  time: function (){
    let today=new Date();
    let h=today.getHours();
    let m=today.getMinutes();
    let s=today.getSeconds();
    let hora = h + ':' + m
    return hora;
  },
  debug: async function (msg) {
    msg = '[DEBUG] ' + msg
    await client.sendMessage(bot.chatId, msg, { disable_web_page_preview: true, disable_notification: true, });
    await console.log(msg) 
  }
}