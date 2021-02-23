const Discord = require("discord.js");
const db = require('quick.db'); // creating database

const ayarlar = require("../ayarlar.json");
exports.run = async (client, message, args) => {
  var permissions = message.channel.permissionsFor(client.user);
  if (!permissions.has('SEND_MESSAGES')) {
  
    
    return;
    
  }

  let target = message.mentions.users.first() || message.author;
    let zengin = db.fetch(`para_${target.id}`)
    let bısıla = db.fetch(`pusula_${target.id}`)
    let para;
    if (zengin == null) para = '0'
      else para = zengin
    
        let pusula;
        if(bısıla == null) pusula = '0'
        else pusula = bısıla


   
    const toplampara = new Discord.MessageEmbed()
    .setTitle(`${client.user.username}`)
    .setColor("#F0FFFF")
    .setDescription(`> Toplamda ${para} TL'ye sahipsin.
    > Bir pusula almak için ${100 - para} TL'ye ihtiyacın var.
    > Şu anda toplam ${pusula} tane pusulan var.`)
    .setFooter(`${target.username}`)
   if(para < 100 ) message.channel.send(toplampara)

   const toplamparası = new Discord.MessageEmbed()
    .setTitle(`${client.user.username}`)
    .setColor("#F0FFFF")
    .setDescription(`> Toplamda ${para} TL'ye sahipsin. 
    > Toplamda ${para / 100} tane pusula alabilirsin.
    > Şu anda toplam ${pusula} tane pusulan var.`)
    .setFooter(`${target.username}`)
   if(para > 100 ) message.channel.send(toplamparası)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["para"],
  permLevel: 0
};

exports.help = {
  name: "cash",
  description: "Yardım Menüsünü Gösterir.",
  usage: "yardım"
};
