const { stripIndents } = require('common-tags');
const db = require('quick.db'); // creating database

let oyndurum = new Set();
const kelime = [`pusula`, `yorum`, `arkadaş`, `bal`];

module.exports.run = async (bot, message, args) => {

    
        if (oyndurum.has(message.channel.id)) return message.reply('<:pusula_x:791401835088445451> Kanal başına sadece bir adam asmaca oyunu meydana gelebilir.');

        try {
            const cevap = kelime[Math.floor(Math.random() * kelime.length)].toLowerCase();
            let point = 0;
            let displayText = null;
            let tahmin = false;
            const confirmation = [];
            const yanlış = [];
            const display = new Array(cevap.length).fill('_');
            while (cevap.length !== confirmation.length && point < 6) {
                await message.channel.send(stripIndents`
                    ${displayText === null ? '**'+bot.user.username+ '**' : displayText ? '**Harikasın!**' : '**Yanlış Harf!**'}
                         **Kelime:**    \`${display.join(' ')}\`
                    **Yanlış Harfler:** ${yanlış.join(', ') || 'Yok'}
                    \`\`\`
                    _________
                    |    |
                    |    ${point > 0 ? '😵' : ''}
                    |   ${point > 2 ? '┌' : ' '}${point > 1 ? '()' : ''}${point > 3 ? '┐' : ''}
                    |    ${point > 4 ? '/' : ''} ${point > 5 ? '\\' : ''}
                    |
                    \`\`\`
                `);
                const filter = res => {
                    const choice = res.content.toLowerCase();
                    return res.author.id === message.author.id && !confirmation.includes(choice) && !yanlış.includes(choice);
                };
                const guess = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 300000
                });
                if (!guess.size) {
                    await message.channel.send('<:pusula_x:791401835088445451> Zamanın doldu!');
                    break;
                }
                const choice = guess.first().content.toLowerCase();
                if (choice === 'end') break;
                if (choice.length > 1 && choice === cevap) {
                    tahmin = true;
                    break;
                } else if (cevap.includes(choice)) {
                    displayText = true;
                    for (let i = 0; i < cevap.length; i++) {
                        if (cevap.charAt(i) !== choice) continue; 
                        confirmation.push(cevap.charAt(i));
                        display[i] = cevap.charAt(i);
                    }
                } else {
                    displayText = false;
                    if (choice.length === 1) yanlış.push(choice);
                    point++;
                }
            }
            oyndurum.delete(message.channel.id);
            if (cevap.length === confirmation.length || tahmin) message.channel.send(`**Tebrikler, kelimeyi buldun ve **10TL** kazandın! **` )
            if (cevap.length === confirmation.length || tahmin) return    db.add(`para_${message.author.id}`, 10);
            return message.channel.send(`<:pusula_x:791401835088445451> Maalesef bilemedin kelime buydu: **${cevap}**`);
        } catch (err) {
            oyndurum.delete(message.channel.id);
            return message.reply(`<:pusula_x:791401835088445451> Olamaz! Bir Hata Verdi: \`${err.message}\``);
        }
    

};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permlevel: 0
};

exports.help = {
  name: 'adamasmaca',
  description: 'Bir kullanÄ±cÄ±ya Ã¶zel mesaj yollar.',
  usage: 'adamasmaca'
};