const Discord = require("discord.js");
const db = require('quick.db'); // creating database

const ayarlar = require("../ayarlar.json");
exports.run = async (client, message, args) => {
  var permissions = message.channel.permissionsFor(client.user);
  if (!permissions.has('SEND_MESSAGES')) {
  
    
    return;
    
  }
  let prefix = await db.fetch(`prefix_${message.guild.id}`);
  if (prefix == null) prefix = ayarlar.prefix;
  
  let para = db.fetch(`para_${message.author.id}`)
  let pusula = db.fetch(`pusula_${message.author.id}`)

  const embed = new Discord.MessageEmbed()
  .setTitle(`Pusula Marketi`)
  .setColor("#F0FFFF")
  .setFooter(`${message.author.tag} ● Sahip olunan para: ${para || "0"}TL ● Sahip olunan Pusula: ${pusula || "0"} `)
  .setThumbnail(`https://cdn.discordapp.com/attachments/791231792543301642/811589757489381396/depositphotos_97606556-stock-photo-grocery-store-raster.jpg`)
.setDescription(`Market Kategorileri

----------------------------------------------------------

Raf-1

**${prefix}market pusula-al**: 100TL

Bu komutlar Pusula alabilirsiniz. İleride 10 tane pusulanız olursa oy vermeden **bazı komutları**mı kullanabilirsiniz.

----------------------------------------------------------

Raf-2

**${prefix}market oy-verme**: 10 Pusula

Beni kullanırken oy verme zorunluluğunuz olmaz.

----------------------------------------------------------

Raf-3

**${prefix}market pusula-sat**: 1 Pusula

Pusulalarınız fazlaysa bu komut ile satabilirsiniz.

----------------------------------------------------------
`)

  if(!args[0]) return message.channel.send(embed)
 
  if(args[0] == "pusula-al") {
let para = db.fetch(`para_${message.author.id}`)
    let miktar = args[1];
    if(!miktar) return message.channel.send(`<:pusula_x:801061526463184897> Alacağın pusulayı belirtmeden pusula alamazsın.`)

    if(!miktar > para) return message.channel.send(`<:pusula_x:801061526463184897> Alacağın pusula, parandan daha fazla olamaz.`)
    if(para < miktar*100 ) return message.channel.send(`<:pusula_x:801061526463184897> Pusula almak için yeterli paran yok.`)
    
db.add(`para_${message.author.id}`,- (miktar * 100))
    db.add(`pusula_${message.author.id}`,+ miktar)
    const başarı = new Discord.MessageEmbed()
    .setTitle(`${client.user.username}`)
    .setColor("#F0FFFF")
    .setDescription(`Başarıyla ${miktar} pusula aldınız.`)
   message.channel.send(başarı)
  }

if(args[0] == "pusula-sat") {
  let pusula = db.fetch(`pusula_${message.author.id}`)
  let miktar = args[1];
  if(!miktar) return message.channel.send(`<:pusula_x:801061526463184897> Satacağın pusulayı belirtmeden pusula alamazsın.`)
  if(!miktar > pusula) return message.channel.send(`<:pusula_x:801061526463184897> Belirttiğin miktar kadar pusulan yok.`)
   
  db.add(`para_${message.author.id}`,+ (miktar * 100))
    db.add(`pusula_${message.author.id}`,- miktar)
    const başarı = new Discord.MessageEmbed()
    .setTitle(`${client.user.username}`)
    .setColor("#F0FFFF")
    .setDescription(`Başarıyla ${miktar} pusula sattınız.`)
   message.channel.send(başarı)
}

if(args[0] == "oy-verme") {
  let oyşeysi = db.fetch(`oyşeysi_${message.author.id}`)
  
  if(oyşeysi) return message.channel.send(`<:pusula_x:801061526463184897> Zaten Premium üyesin.`)
 
  db.set(`oyşeysi_${message.author.id}`, 'old' )

    const başarı = new Discord.MessageEmbed()
    .setTitle(`${client.user.username}`)
    .setColor("#F0FFFF")
    .setDescription(`Başarıyla Premium üye oldunuz.`)
   message.channel.send(başarı)
}

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["market"],
  permLevel: 0
};

exports.help = {
  name: "pusula-marketi",
  description: "Yardım Menüsünü Gösterir.",
  usage: "yardım"
};
