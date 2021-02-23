const Discord = require("discord.js");
const db = require('quick.db'); // creating database

const ayarlar = require("../ayarlar.json");
const rCaptcha = require('rcaptcha')
exports.run = async (client, message, args) => {
   var permissions = message.channel.permissionsFor(client.user);
  if (!permissions.has('SEND_MESSAGES')) {
  
    
    return;
    
  }

  
    const newCaptcha = new rCaptcha({
        language: "TR", // TR or EN is available...
        difficulty: "HARD", // EASY, MEDIUM, HARD, VERYHARD is available...
        length: 8, // Length is must me between 4 and 12...
    })
const xe = new Discord.MessageEmbed()

.setTitle(`${client.user.username}`)
.setColor("#F0FFFF")
.setDescription(`Az sonra atacağım kodu **20 saniye** içerisinde yazarsan **10 TL** kazanacaksın.`)

    const x = new Discord.MessageAttachment(newCaptcha.resim.buffer)
    message.channel.send(xe)
message.channel.send(x).then(() => {
    message.channel.awaitMessages(response => response.content === newCaptcha.kod, {
    max: 1,
    time: 5000,
    errors: ['time'],
    
}) .then((collected) => { 
  const başardı = new Discord.MessageEmbed()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Kodu 5 saniyeden daha hızlı bir şekilde girerek **40TL** kazandın.
 `)
message.channel.send(başardı)
 db.add(`para_${message.author.id}`,40)
    
})

message.channel.awaitMessages(response => response.content === newCaptcha.kod, {
    max: 1,
    time: 20000,
    errors: ['time'],
    
})  .then((collected) => { 
  
  const başardı = new Discord.MessageEmbed()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Kodu 20 saniyeden daha hızlı bir şekilde girerek **10TL** kazandın.
  `)
  db.add(`para_${message.author.id}`,10)
  message.channel.send(başardı) 

    
})



}

) 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["yarışma"],
  permLevel: 0
};

exports.help = {
  name: "yazanalır",
  description: "Yardım Menüsünü Gösterir.",
  usage: "yardım"
};
