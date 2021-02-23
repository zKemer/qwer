const Discord = require("discord.js");
const db = require('quick.db'); // creating database

const ayarlar = require("../ayarlar.json");
exports.run = async (client, message, args) => {
  var permissions = message.channel.permissionsFor(client.user);
  if (!permissions.has('SEND_MESSAGES')) {
  
    
    return;
    
  }

  if (!permissions.has('USE_EXTERNAL_EMOJIS')) {
  
    
    return message.channel.send(`Harici sunuculardan emoji kullanma yetkim olmadığından dolayı bu komutu kullanamazsınız.`)
    
  }

  let prefix = await db.fetch(`prefix_${message.guild.id}`);
  if (prefix == null) prefix = ayarlar.prefix;
  
  const yardım = new Discord.MessageEmbed()
    .setTimestamp()
    .setTitle(`${client.user.username}`)
    .setColor("#F0FFFF")
    .setDescription(`

**Menü Başlıkları**
> <:kirmizi:800709096058781736> **botlist**
> <:sarikitap:800709087251398677> **moderasyon**
> <:mavi:800709091210559508> **ekonomi**
`)
    
.setThumbnail("https://cdn.discordapp.com/attachments/795930062833582090/800706801468833802/pusula_star.png")
.setFooter(`${prefix}yardım <komut>`)
  if(!args[0])message.channel.send(yardım).then(msg => {
    msg.react('800709096058781736')
   .then(r => {
    msg.react('800709087251398677')
    .then(r => {
      msg.react('800709091210559508')

   const kirmizi = (reaction, user) => reaction.emoji.name === 'kirmizi' && user.id === message.author.id;
     
      
   const reactk = msg.createReactionCollector(kirmizi,);

       reactk.on('collect', r => {
        const kirmizi = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`${client.user.username}`)
        .setColor("#F0FFFF")
        .setDescription(`
    
    **Menü Başlıkları**
    > **${prefix}botekle**
    > **${prefix}log-kanal**
    > **${prefix}onaylama-kanalı**
    > **${prefix}bot-ekleme-kanalı**

    `)
        
    .setThumbnail("https://cdn.discordapp.com/attachments/795930062833582090/800706801468833802/pusula_star.png")
    .setFooter(`Pusula'nın eşsiz BotList komutları, emojiyle bot reddetme bile var!`)
 
   msg.edit(kirmizi)
   r.users.remove(message.author.id);
  })

  
  const mavi = (reaction, user) => reaction.emoji.name === 'mavi' && user.id === message.author.id;
     
      
  const reactm = msg.createReactionCollector(mavi,);

      reactm.on('collect', r => {
       const maviembed = new Discord.MessageEmbed()
       .setTimestamp()
       .setTitle(`${client.user.username}`)
       .setColor("#F0FFFF")
       .setDescription(`
   
   **Ekonomi Komutları**
   > **${prefix}para**
   > **${prefix}yarışma**
   > **${prefix}market**
   > **${prefix}drop**
   > **${prefix}adamasmaca**
   `)
       
   .setThumbnail("https://cdn.discordapp.com/attachments/795930062833582090/800706801468833802/pusula_star.png")
   .setFooter(`${prefix}yardım <komut>`)

  msg.edit(maviembed)
  r.users.remove(message.author.id);
 })

  const sari = (reaction, user) => reaction.emoji.name === 'sarikitap' && user.id === message.author.id;
     
      
   const reacts = msg.createReactionCollector(sari,);

       reacts.on('collect', r => {
        const sariembed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(`${client.user.username}`)
        .setColor("#F0FFFF")
        .setDescription(`
    
    **Menü Başlıkları**
    > **${prefix}reactionrole**
    > **${prefix}sayaç**
    > **${prefix}prefix**
    `)
        
    .setThumbnail("https://cdn.discordapp.com/attachments/795930062833582090/800706801468833802/pusula_star.png")
    .setFooter(`${prefix}yardım <komut>`)

   msg.edit(sariembed)
   r.users.remove(message.author.id);
  })


  })

})
 })  

 if (args[0] == "para") {

  const paratanımı = new Discord.MessageEmbed()
  .setTimestamp()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Bu komut ile paranıza bakarsınız.`)
 message.channel.send(paratanımı)
} 

if (args[0] == "drop") {

  const paratanımı = new Discord.MessageEmbed()
  .setTimestamp()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Bu komut ile bulunduğunuz kanala "drop" bırakırsınız. 
  Emojiye ilk tıklayan ödülü alır.`)
 message.channel.send(paratanımı)
} 


if (args[0] == "reactionrole") {

  const paratanımı = new Discord.MessageEmbed()
  .setTimestamp()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Bu komut ile emojiye basınca rol verme sistemi yapabilirsiniz.`)
 message.channel.send(paratanımı)
} 

if (args[0] == "yarışma") {

  const paratanımı = new Discord.MessageEmbed()
  .setTimestamp()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Bu komutun mesajını doğru yazarsanız 10TL kazanabilirsiniz. 
  > Eğer yanlış kullanırsanız hiç bir şey olmaz.`)
 message.channel.send(paratanımı)
} 


if (args[0] == "market") {

  const paratanımı = new Discord.MessageEmbed()
  .setTimestamp()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Pusula Marketi'nden alış-veriş yaparsınız.
`)
 message.channel.send(paratanımı)
} 
if (args[0] == "adamasmaca") {

  const paratanımı = new Discord.MessageEmbed()
  .setTimestamp()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Bu komut ile adam asmaca oynarsınız.`)
 message.channel.send(paratanımı)
} 

if (args[0] == "sayaç") {

  const paratanımı = new Discord.MessageEmbed()
  .setTimestamp()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Bu komut ile sunucunuza sayaç ayarlarsınız.`)
 message.channel.send(paratanımı)
} 

if (args[0] == "prefix") {

  const paratanımı = new Discord.MessageEmbed()
  .setTimestamp()
  .setTitle(`${client.user.username}`)
  .setColor("#F0FFFF")
  .setDescription(`> Bu komut ile sunucunuza özel prefix ayarlarsınız.`)
 message.channel.send(paratanımı)
} 

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["yardım2", "help", "h"],
  permLevel: 0
};

exports.help = {
  name: "yardım",
  description: "Yardım Menüsünü Gösterir.",
  usage: "yardım"
};
