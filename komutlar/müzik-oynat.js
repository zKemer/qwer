const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const OpusScript = require('opusscript');
const youtube = new YouTube('AIzaSyCqtzG_CYhJxhk-EbWBfyXfGJir_NhzPFk');


exports.run = async (client, message, args) => {

   var permissionss = message.channel.permissionsFor(client.user);
  if (!permissionss.has('SEND_MESSAGES')) {
  
    
    return;
    
  }


    const queue = client.queue;
  
  
let tik = client.emojis.cache.get("759035318556688405")
  let carpi = client.emojis.cache.get("754599471580446810")
  let id = Number(args[0]);
  
    var searchString = args.slice(0).join(' ');
    var url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
    var serverQueue = queue.get(message.guild.id);

    var voiceChannel = message.member.voice.channel;

  
    
        if (!args[0])message.channel.send(`${carpi} **Dinlemek istediğin şarkıyı yazmalısın! (Şarkı ismi veya Youtube URLsi)**`)
   
        
 
    
       if (!voiceChannel) message.channel.send(`${carpi} **Lütfen herhangi bir sesli kanala katılınız.**`)
    
    var permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has('CONNECT')) {
    
      
      message.channel.send(`${carpi} **Herhangi bir sesli kanala katılabilmek için yeterli iznim yok.**`)
      
    }
    if (!permissions.has('SPEAK')) {

  
       message.channel.send(`${carpi} **Müzik açamıyorum veya şarkı çalamıyorum çünkü kanalda konuşma iznim yok veya mikrofonum kapalı.**`)

    }

  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      var playlist = await youtube.getPlaylist(url);
      var videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        var video2 = await youtube.getVideoByID(video.id);
        await handleVideo(video2, message.message, voiceChannel, true);
      }

      
        if (args[0])message.channel.send(`${tik} [${playlist.title}](https://www.youtube.com/watch?v=${playlist.id}) adlı şarkı oynatma listesine Eklendi!`)
      
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
      try {
          var videos = await youtube.searchVideos(searchString, 10);
          
          var r = 1
        
          var video = await youtube.getVideoByID(videos[r - 1].id);
        } catch (err) {
          console.error(err);
     
         
           message.channel.send(`${carpi} **Aradığınız isimde bir şarkı bulunamadı!**`) 
          
        }
      }
      return handleVideo(video, message, voiceChannel);
    }

    async function handleVideo(video, message, voiceChannel, playlist = false) {
        var serverQueue = queue.get(message.guild.id);
        
        var song = {
          id: video.id,
          title: video.title,
          durationh: video.duration.hours,
          durationm: video.duration.minutes,
          durations: video.duration.seconds,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
          requester: message.author.tag,
        };
           if (args[0]) {
          var queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel, 
            connection: null,
            songs: [],
            volume: 3,
            playing: true
          };
          queue.set(message.guild.id, queueConstruct);
      
             
          queueConstruct.songs.push(song);
      
          try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
          } catch (error) {
            console.error(`${carpi} **Ses kanalına giremedim HATA: ${error}**`);
            queue.delete(message.guild.id);
            return message.channel.send(`${carpi} **Ses kanalına giremedim HATA: ${error}**`);
          }
        } else {
          serverQueue.songs.push(song);
          
          if (playlist) return undefined;
      
          const songListBed = new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}) adlı şarkı kuyruğa eklendi!`)
          if (args[0]) return message.channel.send(songListBed);
        }
        return undefined;
      }
        function play(guild, song) {
        var serverQueue = queue.get(guild.id);
      
        if (!song) {
          serverQueue.voice.channel.leave();
          voiceChannel.leave();
          queue.delete(guild.id);
          return;
        }
      
        const dispatcher = serverQueue.connection.play(ytdl(song.url))
          .on('end', reason => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
          })
          .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        
        let y = ''
        if (song.durationh === 0) {
            y = `${song.durationm || 0}:${song.durations || 0}`
        } else {
            y = `${song.durationh || 0}:${song.durationm || 0}:${song.durations || 0}`
        }

        const playingBed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`Şimdi Oynatılıyor:`, song.thumbnail)
        .setDescription(`[${song.title}](${song.url})`)
        .addField("**Süre:**", `${y}`, true)
        .addField("**Oynatan:**", `${song.requester}`, true)
        .setThumbnail(song.thumbnail)
           if (args[0]) serverQueue.textChannel.send(playingBed).then(msg => {
        msg.react('⏹️')
       .then(r => {
          msg.react('🔁') 
        const kirmizi = (reaction, user) => reaction.emoji.name === '⏹️' && user.id === message.author.id
     
    const reactk = msg.createReactionCollector(kirmizi);

       reactk.on('collect', (r, user)  => {
   
        const kirmizi = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("#F0FFFF")
        .setDescription(`${message.author.username}, şarkıyı bitirdi.`)
   
  serverQueue.voice.channel.leave();
voiceChannel.leave();
queue.delete(guild.id);
 
   message.channel.send(kirmizi)
   
})
          
           const loop = (reaction, user) => reaction.emoji.name === '🔁' && user.id === message.author.id
     
    const loopk = msg.createReactionCollector(loop);

       loopk.on('collect', async(r, user)  => {
   
        const kirmizi = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("#F0FFFF")
        .setDescription(`${message.author.username}, şarkıyı döngüye aldı.`)
          message.channel.send(kirmizi)
           var u = serverQueue.songs[0]
      
  /*var pla = await youtube.getPlaylist(u);
    var v = await pla.getVideos();*/
    var vi2 = await youtube.getVideoByID(u.id);
    await handleVideo(vi2, message, voiceChannel, true);
  async function handleVideo(video, message, voiceChannel, playlist = false) {
    var serverQueue = queue.get(message.guild.id);
    
    var song = {
      id: video.id,
      title: video.title,
      durationh: video.duration.hours,
      durationm: video.duration.minutes,
      durations: video.duration.seconds,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
      requester: message.author.tag,
    };
    if (!serverQueue) {
      var queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 3,
        playing: true
      };
      queue.set(message.guild.id, queueConstruct);
  
      queueConstruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`<:Yorum_x:786578064561012746> Ses kanalına giremedim HATA: ${error}`);
        queue.delete(message.guild.id);
      return message.channel.send(`<:Yorum_x:786578064561012746> Ses kanalına giremedim HATA: ${error}`);
      }
    } else {
      serverQueue.songs.push(song);
      
      if (playlist) return undefined;
  
      const songListBed = new Messagembed()
      .setColor("RANDOM")
      .setDescription(`<:Yorum_tik:787932687754985493> [${song.title}](https://www.youtube.com/watch?v=${song.id}) adlı şarkı kuyruğa eklendi!`)
   return message.channel.send(songListBed);
    }
    return undefined;
  }
             function play(guild, song) {
    var serverQueue = queue.get(guild.id);
  
    if (!song) {
      serverQueue.voice.channel.leave();
      voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection.play(ytdl(song.url))
      .on('end', reason => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    
    let y = ''
    if (song.durationh === 0) {
        y = `${song.durationm || 0}:${song.durations || 0}`
    } else {
        y = `${song.durationh || 0}:${song.durationm || 0}:${song.durations || 0}`
    }

    const playingBed = new Messagembed()
    .setColor("RANDOM")
    .setAuthor(`Now Playing`, song.thumbnail)
    .setDescription(`[${song.title}](${song.url})`)
    .addField("**Song Time**", `${y}`, true)
    .setThumbnail(song.thumbnail)
 serverQueue.textChannel.send(playingBed);
  }
         
         
 
   
})
          
})

})
          ;
      }  
};

exports.conf = {
    enabled: true,
    aliases: ['çal', 'play'],
    permLevel: 0
};

exports.help = {
    name: 'oynat',
    description: 'Belirttiğiniz şarkıyı bulunduğunuz sesli kanalda çalar/oynatır.',
    usage: 'oynat [şarkı adı]'
};