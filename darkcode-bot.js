//======================================================================//

const Discord = require('discord.js');
const DataBase = require('quick.db');
const cheerio = require('cheerio');
const moment = require('moment');
const client = new Discord.Client();
const { MessageEmbed } = Discord;

//======================================================================//

const siteSettings = {
    "logChannel": "786954715866988584",
    "embedColor": "BLUE"
};

const permRoles = {
    "admin": "785057898723147794",
    "moderator": "785057929153216533",
    "certified_developer": "785057949352591421",
    "developer": "785057995473682462",
    "certified_bot": "785058025416687636",
    "bot": "785058059369578507"
};

const siteAdmins = [
    "451444721089380373",
    "796414422822289439",
    "725800411172307015",
    "724616078524940408",
    "702444949794455643",
    "680479917820870734"
];

//======================================================================//

client.db = DataBase;
client.moment = moment;
client.settings = siteSettings;
client.roles = permRoles;
client.cheerio = cheerio;
client.admins = siteAdmins;

//======================================================================//

client.on("message", message => {
    if (message.author.bot) return;
    var aliases = [ "!top", "!top10", "!darkcoin", "!sıralama" ];
    if (aliases.includes(message.content.toLowerCase())) {
        var data = DataBase.fetch(`wallet`) || [];
        var allUsers = Object.keys(data).sort((a, b) => {
            return (data[b] || 0) - (data[a] || 0);
        }).map(user => user);

        var embed = new Discord.MessageEmbed()
            .setColor('BLACK')
            .setTitle('★ DarkCoin Sıralaması')
            .setFooter('∙ www.darklists.com ∙');

        for (let i = 0; i < (allUsers.length > 10 ? 10 : allUsers.length); i++) {
            embed.addField("**→** __" + (i + 1) + ". Sıra__**:**", "```▸ " + (client.users.cache.get(allUsers[i]) ? client.users.cache.get(allUsers[i]).username : "Sunucudan ayrılmış!") + " | " + (data[allUsers[i]] ? (data[allUsers[i]].toString().split('.').join(',').slice(0, 6)) : 0) + " DarkCoin```")
        };

        message.channel.send(embed).catch(() => {});
    };
});

client.on("message", message => {
    if (message.author.bot) return;
    var aliases = [ "!topvoted", "!topvote", "!vote", "!oy" ];
    if (aliases.includes(message.content.toLowerCase())) {
        var data = DataBase.fetch(`bots`) || [];
        var allBots = Object.keys(data).sort((a, b) => {
            return (data[b].votes || 0) - (data[a].votes || 0);
        }).map(bot => bot);

        var embed = new Discord.MessageEmbed()
            .setColor('BLACK')
            .setTitle('★ Bot Sıralaması')
            .setFooter('∙ www.darklists.com ∙');

        for (let i = 0; i < (allBots.length > 12 ? 12 : allBots.length); i++) {
            embed.addField("**→** __" + (i + 1) + ". Sıra__**:**", "```▸ " + (data[allBots[i]].username + "#" + data[allBots[i]].discriminator) + "\n▸ " + (data[allBots[i]].votes) + " Oy```", true)
        };

        message.channel.send(embed).catch(() => {});
    };
});

//======================================================================//

client.on("ready", async () => {
    require('./darkcode-site.js')(client);
    client.user.setStatus('dnd');
    client.user.setActivity('Website: -[ www.darklists.com ]-');
    console.log("--> Discord botu aktif oldu, site başlatılıyor...");
});

client.on("ready", () => {
    const DCBL = require('darkcode');
    const DarkCode = new DCBL('INpNfRSHdZ-bVl6tYKD7E-wVrjAdqjlQ-tqiV0EHVz7-7aD1RCjdWN');
    setInterval(() => DarkCode.postStats(client.guilds), 600000);
});

//======================================================================//

client.on("message", message => {
    let args = message.content.split(' ').slice(1);
    let istekMesajı = args.join(" ").slice(0);
    if (!message.content.startsWith('!istek')) return;

    const embed_1 = new Discord.MessageEmbed().setColor('BLUE');
    if (istekMesajı.length <= 0) return message.channel.send(embed_1.setDescription('> İstediğiniz kodun açıklamasını yazınız!'))

    const embed_2 = new Discord.MessageEmbed()
        .setTitle("İstek Kod")
        .setColor("BLUE")
        .setThumbnail(message.author.avatarURL())
        .addField("Komutu İsteyen", message.author.tag, true)
        .addField("İstenen Komut", istekMesajı)
        .setFooter("DarkCode")
        .setTimestamp();

    message.channel.send(embed_1.setDescription('> İstediğiniz kod **#request-code** kanalına gönderildi!'))
    client.channels.cache.get('789825317132435506').send(embed_2).then(msg => {
        msg.react('780805715816218655');
        msg.react('780806317707100200');
    }).catch(() => message.channel.send(embed_1.setDescription('> Bot kanala mesaj atamıyor!')));
});

//======================================================================//

for(let i = 0; i < siteAdmins.length; i++) {
  const id = siteAdmins[i];
  DataBase.set("mods." + id, true);
};

//======================================================================//

client.login('Nzg1MDk1NDMyNTMwMjk2ODQy.X8y3GQ.0WFOTUnp8eLSMC0_rxNaNMx-0hM').catch(() => {
    console.log("--> Token hatalı geçerli bir token yazınız!");
});

//======================================================================//