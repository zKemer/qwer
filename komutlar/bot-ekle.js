const Discord = require("discord.js")
const Db = require('quick.db'); // creating database
const db = require('quick.db'); // creating database
module.exports.run = async(client,message,args)=> {

if(!Db.fetch(`onay-red-kanalı_${message.guild.id}`)) return message.channel.send(`Bu sunucuda BotList sistemi tamamıyla açık değil.`)
  if(!Db.fetch(`onay-red-kanalıs_${message.guild.id}`))return message.channel.send(`Bu sunucuda BotList sistemi tamamıyla açık değil.`)
  if(!db.fetch(`bot-ekleme-kanalı_${message.guild.id}`))return message.channel.send(`Bu sunucuda BotList sistemi tamamıyla açık değil.`)
    if(message.channel.id === db.fetch(`bot-ekleme-kanalı_${message.guild.id}`)){      

    }else return message.channel.send(`Bot ekleme sadece <#${db.fetch(`bot-ekleme-kanalı_${message.guild.id}`)}> adlı kanalda yapılabilir.`)

  

var kisi = message.mentions.users.first()
let kelimeilk = args[0];
let kelimeiki = args[1];

 let kanal = client.channels.cache.get(Db.fetch(`onay-red-kanalı_${message.guild.id}`));
message.delete();

if (!kelimeilk) return message.channel.send("Botunuzun ID'sini bilmezsek onu ekleyemeyiz.")
if(!kelimeiki) return message.channel.send("Botunuzun prefixini bilmezsek onu ekleyemeyiz.")

message.channel.send("Bot ekleme isteğiniz başarıyla alındı.")

const evomed = new Discord.MessageEmbed()

.setColor("ORANGE") 
.setTitle("Link")
.setFooter(`<@${kelimeilk}> \n Prefix: ${kelimeiki} \n Owner: <@${message.author.id}>`)

.setURL(`https://discord.com/oauth2/authorize?client_id=${kelimeilk}&scope=bot&permissions=0`)
kanal.send(evomed).then(msg => {

msg.react('✔️')
  .then(r => {
    msg.react('❌')
 

   
      //Filter
      const backwardsFilter = (reaction, user) => reaction.emoji.name === '❌' 
      const forwardsFilter = (reaction, user) => reaction.emoji.name === '✔️'  

  
const backwards = msg.createReactionCollector(backwardsFilter, );
     const forwards = msg.createReactionCollector(forwardsFilter, );




      forwards.on('collect', (r, user)  => {
        if(user.id === "777852808081833994") return;
   const evomedd = new Discord.MessageEmbed()

.setColor("GREEN") 
.setTitle("Link")
.setFooter(`<@${kelimeilk}>, <@${user.id}> adlı yetkili tarafından kabul edildi.`)
.setURL(`https://discord.com/oauth2/authorize?client_id=${kelimeilk}&scope=bot&permissions=0`)

let kana = client.channels.cache.find(r => r.id == (Db.fetch(`onay-red-kanalıs_${message.guild.id}`)))
msg.edit(evomedd)
kana.send(" <@"+message.author.id+"> adlı kullanıcının <@" +kelimeilk+"> (`"+kelimeilk+"`) adlı botu, "+ user.username+" adlı yetkili tarafından kabul edildi")

      })

 
   
  
  backwards.on('collect', (r, user)  => {
    if(user.id === "777852808081833994") return;
    const evomeddd = new Discord.MessageEmbed()

.setColor("RED") 
.setTitle("Davet Linki")
.setFooter(`<@${kelimeilk}>, <@${user.id}> adlı yetkili tarafından reddedildi.`)
.setURL(`https://discord.com/oauth2/authorize?client_id=${kelimeilk}&scope=bot&permissions=0`)
msg.edit(evomeddd)

let kana = client.channels.cache.find(r => r.id == (Db.fetch(`onay-red-kanalıs_${message.guild.id}`)))
kana.send(" <@"+message.author.id+"> adlı kullanıcının <@" +kelimeilk+"> (`"+kelimeilk+"`) adlı botu, "+ user.username+" adlı yetkili tarafından reddedildi")
   })

    })
  })

}



exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['addbot', 'bot-ekle'],
  permLevel: 0
};

exports.help = {
  name: 'botekle',
  description: 'Espri yapar.',
  usage: 'espri'
};