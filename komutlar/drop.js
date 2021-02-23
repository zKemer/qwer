const Discord = require("discord.js");
const db = require('quick.db'); // creating database

const ayarlar = require("../ayarlar.json");
exports.run = async (client, message, args) => {

   
  var permissions = message.channel.permissionsFor(client.user);
  if (!permissions.has('SEND_MESSAGES')) {
  
    
    return;
    
  }

  if (!permissions.has('USE_EXTERNAL_EMOJIS')) {
  
    
    return message.channel.send(`<:pusula_x:791401835088445451> Harici sunuculardan emoji kullanma yetkim olmadığından dolayı bu komutu kullanamazsınız.`)
    
  }


    let para = db.fetch(`para_${message.author.id}`)
let miktar = args[0]
  if (!miktar) return message.channel.send('<:pusula_x:801061526463184897> Miktarını belirtmelisin!');

  if(miktar > para) return message.channel.send("<:pusula_x:801061526463184897> Paran yeterli değil!")
  
  const embed = new Discord.MessageEmbed()
  .setColor("#F0FFFF")
  .setDescription(`${message.author.username} tarafından, ${miktar} TL değerinde "drop" geldi.`)
  db.add(`para_${message.author.id}`, -(miktar))
    message.channel.send(embed).then(msg => {
        msg.react('800709096058781736')
       .then(r => {
        const kirmizi = (reaction, user) => reaction.emoji.name === 'kirmizi' 
     
    const reactk = msg.createReactionCollector(kirmizi);

       reactk.on('collect', (r, user)  => {
   
        const kirmizi = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("#F0FFFF")
        .setDescription(`${user.username}, ${miktar} para kazandı.`)
   
 db.add(`para_${user.id}`, +(miktar))

 msg.delete()
   message.channel.send(kirmizi)
   
})
})

})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["drop"],
  permLevel: 0
};

exports.help = {
  name: "drop",
  description: "Yardım Menüsünü Gösterir.",
  usage: "yardım"
};
