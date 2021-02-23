const Discord = require("discord.js");
const db = require('quick.db'); // creating database

const ayarlar = require("../ayarlar.json");
exports.run = async (client, message, args) => {
  var permissions = message.channel.permissionsFor(client.user);
  if (!permissions.has('SEND_MESSAGES')) {
  
    
    return;
    
  }

  
  if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send('<:pusula_x:801061526463184897> Bu komutu kullanmak için gerekli yetkiye sahip değilsin')

    let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[0])
    const emoji = message.guild.emojis.cache.find(r => r == args[1]) || message.guild.emojis.cache.find(r => r.id == args[1]) || client.emojis.cache.find(r => r.name == args[1])
let miktar = args[0]
  if (!miktar) return message.channel.send('<:pusula_x:801061526463184897> Bir rol belirtmelisin!');

  if(!role) return message.channel.send("<:pusula_x:801061526463184897> Bir rol belirtmelisin!")
  if(!args[1]) return message.channel.send("<:pusula_x:801061526463184897> Bir emoji **ismi** belirtmelisin.")
if(!emoji) return message.channel.send("<:pusula_x:801061526463184897> Bu sunucuda böyle bir emoji bulunamadı.")

const embed = new Discord.MessageEmbed()
  .setColor("#F0FFFF")
  .setDescription(`${miktar} rolü için aşağıdaki ${emoji} emojisine tıkla.`)
    message.channel.send(embed).then(msg => {
  
        msg.react(emoji)
       .then(r => {
        const kirmizi = (reaction, user) => reaction.emoji.name === (emoji.name)
     
    const reactk = msg.createReactionCollector(kirmizi);

       reactk.on('collect', (r, member)  => {

    message.member.roles.add(role.id)
})
})
})


};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rr"],
  permLevel: 0
};

exports.help = {
  name: "reactionrole",
  description: "Yardım Menüsünü Gösterir.",
  usage: "yardım"
};
