const Discord = require('discord.js');
const ayarlar = require("../ayarlar.json");
 
exports.run = (client, message, args) => {

    const hawliyapimci = client.users.cache.get(ayarlar.sahip)
    const mesaj = new Discord.MessageEmbed()

    .setTitle(client.user.username)
    .setDescription(`**Bağlantılar**
● [Davet Linki](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) ● [Destek Sunucusu](https://discord.gg/qDtTcfA7MP)

     ** __Bilgilendirme__**


    >  Kullanıcı Sayısı: ${client.guilds.cache
        .reduce((a, b) => a + b.memberCount, 0)
        .toLocaleString()}
    >  Sunucu Sayısı: ${client.guilds.cache.size}
    >  Kanal Sayısı: ${client.channels.cache.size}
    >  Ping: ${client.ws.ping}ms
    >  Yapımcı: ${hawliyapimci.tag}
    
    `)
    

    message.channel.send(mesaj)
};
 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["i", "bb"],
  permLevel: 0
};
 
exports.help = {
  name: 'istaistik',
  description: 'Kod denemek için kullanılır.',
  usage: 'eval [kod]'
};