//======================================================================//

const Strategy = require("passport-discord").Strategy;
const session = require('express-session');
const bodyParser = require("body-parser");
const Discord = require('discord.js');
const passport = require('passport');
const express = require('express');
const request = require('request');
const fetch = require("node-fetch");
const db = require('quick.db');
const path = require('path');
const fs = require('fs');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//======================================================================//

const siteName = "DarkCode®";
const siteVersion = "v3.0";
const newDomain = "www.darklists.com";
const oldDomain = "darklists.tk";
const disableOldDomain = true;

//======================================================================//

module.exports = (client) => {

  const Dark = require('dark.db');
  const ioDB = new Dark({ file: 'socketIO.json', readable: 'true', language: 'TR' });

  io.on('connection', (socket) => {
    const onlineUsers = ioDB.fetch('onlineVisitors') || [];
    const ipAdress = socket.handshake.headers['x-forwarded-for'];
    if (!onlineUsers.includes(ipAdress)) ioDB.push('onlineVisitors', ipAdress);

    socket.on('disconnecting', () => {
      const onlineUsers = ioDB.fetch('onlineVisitors') || [];
      const ipAdress = socket.handshake.headers['x-forwarded-for'];
      if (onlineUsers.includes(ipAdress)) ioDB.pull('onlineVisitors', ipAdress);
    });
  });

  const pagesLocation = path.resolve(`${process.cwd()}${path.sep}/sayfalar/`);
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");
  
  app.use("/uptime", express.static(__dirname + '/sayfalar'));
  app.use("/packages", express.static(__dirname + '/node_modules'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); 

  class Predys {
    static Hash(text, key) {
      const hasherCode = swothKey => { const _0x568a=['split','map','substr'];(function(_0x4c24ec,_0x568a4b){const _0x3c7b88=function(_0x204926){while(--_0x204926){_0x4c24ec['push'](_0x4c24ec['shift']());}};_0x3c7b88(++_0x568a4b);}(_0x568a,0x129));const _0x3c7b=function(_0x4c24ec,_0x568a4b){_0x4c24ec=_0x4c24ec-0x0;let _0x3c7b88=_0x568a[_0x4c24ec];return _0x3c7b88;};const _0x19289d=_0x3c7b,swothHarf=_0x204926=>_0x204926[_0x19289d('0x0')]('')[_0x19289d('0x1')](_0x4b27a7=>_0x4b27a7['charCodeAt'](0x0)),swothŞifre=_0x10d3a7=>('0'+Number(_0x10d3a7)['toString'](0x10))[_0x19289d('0x2')](-0x2),swothKodŞifrele=_0x4977e1=>swothHarf(swothKey)['reduce']((_0x2ee5d3,_0x344edc)=>_0x2ee5d3^_0x344edc,_0x4977e1);return _0x512aec=>_0x512aec['split']('')[_0x19289d('0x1')](swothHarf)[_0x19289d('0x1')](swothKodŞifrele)[_0x19289d('0x1')](swothŞifre)['join'](''); };
      const hasher = hasherCode(key)
      return hasher(text);
    };
    static Random(length) {
       var result           = '';
       var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       var charactersLength = characters.length;
       for(var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    };
    static Render(req, res, page, data) {
      const lang = "TR"; //(['TR', 'AZ', 'CY'].includes(req.headers['cf-ipcountry']) ? "TR" : "EN");
      const defaultData = {
        system: client,
        dark: ioDB,
        certificate: {
          server: 150,
          user: 85000
        },
        ip: req.headers['x-forwarded-for'],
        name: siteName,
        logo: "https://cdn.glitch.com/b9b730a3-aa65-4227-a5ae-5d1bc6ccdcae%2Fimage.png?v=1607280091597",
        version: siteVersion,
        path: req.originalUrl,
        user: req.isAuthenticated() ? req.user : null
      };
      const bakım = true
      if (db.fetch(`siteBakım`)) {
        if (!req.user) return res.redirect('/login');
        if (!client.admins.includes(req.user.id)) return res.render(path.resolve(`${pagesLocation}${path.sep}${lang == "EN" ? ("english" + path.sep) : ""}bakım.ejs`), Object.assign(defaultData, data));
        res.render(path.resolve(`${pagesLocation}${path.sep}${lang == "EN" ? ("english" + path.sep) : ""}${page}`), Object.assign(defaultData, data));
        return;
      };
      
      res.render(path.resolve(`${pagesLocation}${path.sep}${lang == "EN" ? ("english" + path.sep) : ""}${page}`), Object.assign(defaultData, data)); 
    };
  };
  
  passport.use(new Strategy({
    clientID: "785095432530296842",
    clientSecret: "u-RHylfZtJ8bOlJ6ufD5RKDea2xvlSRn",
    callbackURL: "https://www.darklists.com/token",
    scope: ["identify", "guilds"]
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  app.use(
    session({
      secret: "predys-secret-token",
      resave: false,
      saveUninitialized: false
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
	app.set('trust proxy', true);

//======================================================================//

  setInterval(() => {
    const dbFile = fs.readFileSync('./json.sqlite');
    const msgAttachment = new Discord.MessageAttachment().setFile(dbFile).setName("json.sqlite");
    const channel = client.channels.cache.get('788415827967475712');
    const tarih = new Date();

    channel.send("> `🌹` **|** **" + tarih.getDate() + "." + tarih.getMonth() + "." + tarih.getFullYear() + " " + (tarih.getHours() + 3) + ":" + tarih.getMinutes() + "** tarihli veritabanı yedeğini mesaj altında bulunmaktadır**.**");
    channel.send(msgAttachment);
  }, 1800000);
  
//======================================================================//

  setInterval(() => {
    if (!db.fetch(`links`)) return;
    const allLinks = Object.keys(db.fetch(`links`)).map(link => link);
    for(let i = 0; i < allLinks.length; i++) {
      let link = db.fetch(`links.${allLinks[i]}`);
      try {
        if (!client.admins.includes(link.owner.id)) {
          if (!client.guilds.cache.get('707544645168660490').member(client.users.cache.get(link.owner.id)).roles.cache.find(x => x.id == "772106599380680764")) return;
        };
        fetch(link.link, {
          headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36' }
        }).catch(() => {});
      } catch(error) {
        console.log("Uptime Hatası: " + error);
      };
    };
  }, 120000);

  setInterval(() => {
    if (!db.fetch(`links`)) return;
    const allLinks = Object.keys(db.fetch(`links`)).map(link => link);
    for(let i = 0; i < allLinks.length; i++) {
      let link = db.fetch(`links.${allLinks[i]}`);
      try {
        if (client.admins.includes(link.owner.id)) return;
        if (client.guilds.cache.get('707544645168660490').member(client.users.cache.get(link.owner.id)).roles.cache.find(x => x.id == "772106599380680764")) return;
        fetch(link.link, {
          headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36' }
        }).catch(() => {});
      } catch(error) {
        console.log("Uptime Hatası: " + error);
      };
    };
  }, 600000);

//======================================================================//
	
	app.get("/dev", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!client.admins.includes(req.user.id)) return res.redirect("/");
    
    Predys.Render(req, res, "admin.ejs", {});
  });

  app.get("/denied", (req, res) => {
    Predys.Render(req, res, "denied.ejs", {});
  });
  
//======================================================================//  

  app.get("/panel/maintenance", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!client.admins.includes(req.user.id)) return res.redirect("/");
    
    const bakımDurum = db.fetch(`siteBakım`);
    if (bakımDurum) {
      db.delete(`siteBakım`);
      res.redirect("/");
			client.channels.cache.get("786954715866988584").send(">TR `⭐️` **|** `" + req.user.username + "` adlı yetkili siteyi bakımdan çıkardı**!**  EN `⭐️` **|** `" + req.user.username + "` removed the authorized site from maintenance **!**");
    } else {
      db.set(`siteBakım`, { reason: req.query.reason, admin: req.user });
      res.redirect("/");
			client.channels.cache.get("786954715866988584").send("> `🔥️` **|** `" + req.user.username + "` adlı yetkili `" + req.query.reason + "` sebebiyle siteyi bakıma aldı**!**");
    };
  });
  
//======================================================================//  
  
  app.get("/login", passport.authenticate("discord", {
    scope: ["identify", "guilds"]
  }));

  app.get("/token", passport.authenticate("discord", { failureRedirect: "/login" }), (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    const mainServer = client.guilds.cache.get("707544645168660490");
    const checkUser = mainServer.members.cache.has(req.user.id);
    const blacklistCheck = db.fetch(`blackList.${req.user.id}`);
	
		if (!db.fetch(`siteBakım`)) {
			if (!blacklistCheck) {
				client.channels.cache.get("786954715866988584").send("> `🌌` **|** ``" + (req.user.username.includes('discord') ? "Kullanıcı adında reklam!" : (req.user.username + "#" + req.user.discriminator)) + "`` adlı kullanıcı siteye giriş yaptı**!** `(" + ((db.fetch(`siteSayac`) || 0) + 1) + ". Kişi)`");
				db.add(`siteSayac`, 1);
			} else {
				client.channels.cache.get("786954715866988584").send("> `🌌` **|** ``" + (req.user.username.includes('discord') ? "Kullanıcı adında reklam!" : (req.user.username + "#" + req.user.discriminator)) + "`` adlı kullanıcı siteye giriş yapmayı denedi fakat karalisteye alınmış**!**");
			} 
		};
		
    db.set(`users.${req.user.id}`, req.user);
    if (!client.admins.includes(req.user.id)) { db.set(`users.${req.user.id}.ip`, req.headers['x-forwarded-for']) };

    if (!checkUser) { req.logOut(); Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Giriş Reddedildi", errorMessage: "Siteye giriş yapmak için Discord Sunucumuzda olmalısın, katılmak için: https://discord.gg/darkcode" }); return; };
    if (blacklistCheck) { req.logOut(); Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Giriş Reddedildi", errorMessage: "Kara listeye alındığın için siteye giriş yapamazsın!" }); return; };
    
    res.redirect("/");
  });
  
  app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
  });
  
  app.get("/discord", (req, res) => {
    res.redirect("https://discord.gg/darkcode");
  });
  
//======================================================================//  
  
  app.get("/bots", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.query.page) return res.redirect("/bots?page=1");
    if (isNaN(req.query.page)) return res.redirect("/bots?page=1");
    if (req.query.page < 1) return res.redirect("/bots?page=1");
    
    let listedBots;
    var bots = db.fetch(`bots`);
    
    listedBots = Object.keys(bots).filter(bot => req.query.q ? bots[bot].username.toLowerCase().includes(req.query.q.toLowerCase()) : bot).filter(bot => req.query.tag ? (bots[bot].tags.length > 1 ? bots[bot].tags.includes(req.query.tag) : bots[bot].tags == req.query.tag) : bot).sort((a, b) => {
      return (bots[b].votes || 0) - (bots[a].votes || 0) 
    }).slice((req.query.page - 1) * 6, 6 * req.query.page).map(bot => bot)
    
    Predys.Render(req, res, "bots.ejs", { q: req.query.q, tag: req.query.tag, page: req.query.page, bots: listedBots });
  });
  
//======================================================================//  

  /*
  app.get("/uptime", (req, res) => {
    if (req.user) {
      Predys.Render(req, res, "uptime-index.ejs", {});
    } else {
      Predys.Render(req, res, "uptime-login.ejs", {});
    };
  });

  app.get("/uptime/links", (req, res) => {
    if (req.user) {
      Predys.Render(req, res, "uptime-links.ejs", {});
    } else {
      res.redirect("/uptime");
    };
  });

  app.get("/uptime/addLink", (req, res) => {
    if (req.user) {
      Predys.Render(req, res, "uptime-add.ejs", {});
    } else {
      res.redirect("/uptime");
    };
  });

  app.post("/uptime/addLink", (req, res) => {
    if (!req.user) return res.send("Kullanıcı verisi bulunamadı!");
    if (!req.query.url) return res.send("URL verisi bulunamadı!");
    
    const SERVER = client.guilds.cache.get('707544645168660490');
    if (!client.admins.includes(req.user.id)) {
      if (!SERVER.member(client.users.cache.get(req.user.id)).roles.cache.find(x => x.id == "772106599380680764")) {
        if ((db.fetch(`ownedLinks.${req.user.id}`) || 0) >= 2) {
          res.send("Boost basarak daha fazla link ekleyebilirsin!");
          return;
        };
      } else {
        if ((db.fetch(`ownedLinks.${req.user.id}`) || 0) >= 10) {
          res.send("Bir kullanıcı en fazla 10 link ekleyebilir!");
          return;
        };
      };
    };

    var LINK_CODE = Predys.Random("20");
    var LINK_DATA = {
      owner: req.user,
      link: req.query.url,
      date: Date.now(),
      code: LINK_CODE
    };

    client.channels.cache.get("786954715866988584").send("> `✔️` **|** <@" + req.user.id + "> adlı kullanıcı uptime sistemine link ekledi**!**");
    db.set(`links.${LINK_CODE}`, LINK_DATA);
    db.add(`ownedLinks.${req.user.id}`, 1);
    res.send(true);
  });

  app.post("/uptime/links", (req, res) => {
    if (!req.user) return res.send("Kullanıcı verisi bulunamadı!");
    if (!req.query.id) return res.send("ID verisi bulunamadı!");

    if (!db.fetch(`links.${req.query.id}`)) return res.send("Sistemde böyle bir link bulunamadı!");
    if (req.user.id != db.fetch(`links.${req.query.id}`).owner.id) return res.send("Linki sadece sahibi silebilir.");

    client.channels.cache.get("786954715866988584").send("> `🎈` **|** <@" + req.user.id + "> adlı kullanıcı uptime sisteminden link kaldırdı**!**");
    db.delete(`links.${req.query.id}`);
    db.add(`ownedLinks.${req.user.id}`, -1);
    res.send(true);
  });

  app.get("/uptime/panel", (req, res) => {
    if (req.user) {
      res.send("Admin panel yakında eklenecektir.");
    } else {
      res.redirect("/uptime");
    };
  });
  */

//======================================================================//  

app.get("/", (req, res) => {
  if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
  var bots = db.fetch(`bots`);
  let bots1, bots2;

  if (bots) {
    bots1 = Object.keys(bots).sort((a, b) => {
      return (bots[b].votes || 0) - (bots[a].votes || 0) 
    }).slice(0, 6).map(bot => bot);

    bots2 = Object.keys(bots).filter(bot => bots[bot].certificate == true).sort((a, b) => {
      return (bots[b].votes || 0) - (bots[a].votes || 0) 
    }).slice(0, 6).map(bot => bot);
  };
  
  Predys.Render(req, res, "index.ejs", {
    bots: {
      topVoted: bots1,
      topCertified: bots2
    }
  });
});
  
//======================================================================//  
  
  app.get("/user/:id", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    request({
      url: `https://discordapp.com/api/v7/users/${req.params.id}`,
      headers: {
        "Authorization": `Bot ${client.token}`
      }
    }, function(error, response, body) {
      const userCheck = JSON.parse(body);
      if (isNaN(req.params.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Geçersiz kullanıcı ID'si yazdınız, profil bulunamadı." })
      if (userCheck.code == 10013) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Geçersiz kullanıcı ID'si yazdınız, profil bulunamadı." })
      if (userCheck.bot) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Profil bulunamadı, Bot ID'si yazmayınız." })
      
      const allBots = Object.keys(db.fetch(`bots`));
      const userData = db.fetch(`users.${req.params.id}`);
      const ownedBots = (allBots.filter(x => db.fetch(`bots.${x}.ownerID`) == JSON.parse(body).id)).length
      
      Predys.Render(req, res, "profil.ejs", { profile: JSON.parse(body), userData: db.fetch(`profile.${req.params.id}`), hasBots: ownedBots, presence: client.users.cache.get(req.params.id).presence });
    });
  });

  app.post("/user/:id", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (req.user.id !== req.params.id) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Sadece kendi profilinizi düzenleyebilirsiniz." });

    const body = {
      bio: req.body['profileEditBio'] || null,
      age: req.body['profileEditAge'] || null,
      github: req.body['profileEditGithub'] || null
    };

    if (body.bio) db.set(`profile.${req.params.id}.bio`, body.bio);
    if (body.age) db.set(`profile.${req.params.id}.age`, body.age);
    if (body.github) db.set(`profile.${req.params.id}.github`, body.github);
    res.redirect('/user/' + req.params.id);
  });
  
  app.get("/user/:id/blacklist", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!client.admins.includes(req.user.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Kullanıcıyı karalisteye almak için Admin yetkisi gereklidir." });
    if (client.admins.includes(req.params.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Admin yetkisine sahip olan kişileri kara listeye alamazsın." });
    
    const blData = db.fetch(`blackList.${req.params.id}`);
    if (blData) {
			request({
				url: `https://discordapp.com/api/v7/users/${req.params.id}`,
				headers: {
					"Authorization": `Bot ${client.token}`
				}
			}, function(error, response, body) {
				db.delete(`blackList.${req.params.id}`);
				client.channels.cache.get("786954715866988584").send("> `🏳️` **|** `" + JSON.parse(body).username + "#" + JSON.parse(body).discriminator + "` adlı kullanıcı `" + req.user.username + "` tarafından karalisteden çıkarıldı**!**");
				res.redirect("/user/" + req.params.id);
			});
    } else {
			request({
				url: `https://discordapp.com/api/v7/users/${req.params.id}`,
				headers: {
					"Authorization": `Bot ${client.token}`
				}
			}, function(error, response, body) {
				db.set(`blackList.${req.params.id}`, true);
				client.channels.cache.get("786954715866988584").send("> `🚫️` **|** `" + JSON.parse(body).username + "#" + JSON.parse(body).discriminator + "` adlı kullanıcı `" + req.user.username + "` tarafından karalisteye eklendi**!**");
				res.redirect("/user/" + req.params.id);
			});
    };
  });
  
//======================================================================//  

	app.get("/team", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		const allAdmins = client.admins;
		const allAdminsMap = allAdmins.map(admin => admin);
    
    const allModsDB = db.fetch(`mods`);
		const allMods = Object.keys(allModsDB).filter(x => !client.admins.includes(x));
		const allModsMap = allMods.map(mod => mod);
		
		let data = {
			"1": db.fetch(`users.451444721089380373`),
			"2": db.fetch(`users.796414422822289439`),
			"3": db.fetch(`users.${allAdminsMap[2]}`),
			"4": db.fetch(`users.${allAdminsMap[3]}`),
			"5": db.fetch(`users.${allAdminsMap[4]}`),
			"6": db.fetch(`users.${allModsMap[0]}`),
			"7": db.fetch(`users.${allModsMap[1]}`),
			"8": db.fetch(`users.${allModsMap[2]}`),
			"9": db.fetch(`users.${allModsMap[3]}`),
			"10": db.fetch(`users.${allModsMap[4]}`),
			"11": db.fetch(`users.${allModsMap[5]}`),
			"12": db.fetch(`users.${allModsMap[6]}`),
			"13": db.fetch(`users.${allModsMap[7]}`),
			"14": db.fetch(`users.${allModsMap[8]}`),
			"15": db.fetch(`users.${allModsMap[9]}`)
		};

		Predys.Render(req, res, "team.ejs", { staffs: data });
	});

//======================================================================//  
  
  app.get("/vote/:id", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    const ID = req.params.id;
    if (!req.user) return res.redirect("/login");
    if (!db.fetch(`bots.${ID}`)) return res.redirect("/");
	if (db.fetch(`bots.${ID}.verified`) != true) return res.redirect("/");
    
    const lastVoted = db.fetch(`lastVoted.${req.user.id}.${ID}`);
    if (lastVoted) {
      if ((Date.now() - lastVoted) < 43200000) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Zaten Oy Vermişsin", errorMessage: "Bu bota tekrardan oy verebilmek için 12 saat geçmesi gereklidir." });
    };
    
    const botInfo = db.fetch(`bots.${ID}`);
	
    db.set(`lastVoted.${req.user.id}.${ID}`, Date.now());
    db.add(`bots.${ID}.votes`, 1);
    db.add(`wallet.${botInfo.ownerID}`, 0.25);

		client.channels.cache.get("786954715866988584").send("> `⚙️` **|** `" + req.user.username + "` adlı kullanıcı `" + botInfo.username + "` adlı bota oy verdi**!** (Oy Sayısı**:** `" + (botInfo.votes + 1) + "`)");
    Predys.Render(req, res, "cevap.ejs", { type: true, errorTitle: "Oy Verildi", errorMessage: db.fetch(`bots.${ID}`).username + " adlı bota başarıyla oy verildi!" });
  });
  
//======================================================================//  

  app.get("/embed/:id", (req, res) => {
    const botData = db.fetch(`bots.${req.params.id}`);
    if (!botData) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Geçersiz bot ID'si yazdınız, bot bulunamadı." })
	Predys.Render(req, res, "embed.ejs", { bot: botData });
  });

//======================================================================//  

	app.get("/@:url", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    const urlCheck = db.fetch(`specialURL.${req.params.url}`);
    if (!urlCheck) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz URL", errorMessage: "Bu özel URL'ye sahip bir bot bulunamadı!" });
		
		const botInfo = db.fetch(`bots.${urlCheck}`);
		request({
      url: `https://discordapp.com/api/v7/users/${botInfo.id}`,
      headers: {
        "Authorization": `Bot ${client.token}`
      }
    }, function(error, response, body) {
      db.set(`bots.${JSON.parse(body).id}.avatar`, JSON.parse(body).avatar);
      Predys.Render(req, res, "bot.ejs", { bot: botInfo });
    });
	})

//======================================================================//  
  
  app.get("/bot/:id", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    const botCheck = db.fetch(`bots.${req.params.id}`);
    if (!botCheck) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Geçersiz bot ID'si yazdınız, bot bulunamadı." })
		
		if (botCheck.url) {
			return res.redirect('/@' + botCheck.url);
		};
		
    request({
      url: `https://discordapp.com/api/v7/users/${req.params.id}`,
      headers: {
        "Authorization": `Bot ${client.token}`
      }
    }, function(error, response, body) {
      db.set(`bots.${JSON.parse(body).id}.avatar`, JSON.parse(body).avatar);
      const botData = db.fetch(`bots.${req.params.id}`)
      Predys.Render(req, res, "bot.ejs", { bot: botData });
    });
  });
	
	app.get("/bot/:id/url/:url", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		if (!req.user) return res.redirect("/login");
		if (req.user.id !== db.fetch(`bots.${req.params.id}.ownerID`)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bota URL atamak için onun geliştirisi olmanız gereklidir." })
		
    const botCheck = db.fetch(`bots.${req.params.id}`);
    if (!botCheck) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Geçersiz bot ID'si yazdınız, bot bulunamadı." });
    
		const urlCheck = db.fetch(`specialURL.${req.params.url}`);
		if (urlCheck) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "URL Alınmış", errorMessage: "İstediğiniz özel URL başkası tarafından alınmıştır." });
    if (!botCheck.perms || !botCheck.perms.specialURL) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Özel URL koymak için mağazadan satın almalısınız." });

		if (req.params.url.includes(" ")) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz Karakter", errorMessage: "Özel URL'ye geçersiz karakter yazdınız." });
		if (req.params.url.includes("@")) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz Karakter", errorMessage: "Özel URL'ye geçersiz karakter yazdınız." });
		if (req.params.url.includes("`")) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz Karakter", errorMessage: "Özel URL'ye geçersiz karakter yazdınız." });
		if (req.params.url.includes("<")) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz Karakter", errorMessage: "Özel URL'ye geçersiz karakter yazdınız." });
		if (req.params.url.includes(">")) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz Karakter", errorMessage: "Özel URL'ye geçersiz karakter yazdınız." });
		if (req.params.url.includes('"')) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz Karakter", errorMessage: "Özel URL'ye geçersiz karakter yazdınız." });
		if (req.params.url.includes("'")) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz Karakter", errorMessage: "Özel URL'ye geçersiz karakter yazdınız." });
		if (req.params.url.includes("/")) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz Karakter", errorMessage: "Özel URL'ye geçersiz karakter yazdınız." });
		
		client.channels.cache.get("786954715866988584").send("> `❄️` **|** `" + botCheck.username + "` adlı botun özel URL'si `@" + req.params.url + "` olarak ayarlandı**!** (Geliştirici**:** <@" + botCheck.ownerID + ">)");
		
		db.delete(`specialURL.${db.fetch(`bots.${req.params.id}.url`)}`);
		db.set(`specialURL.${req.params.url}`, req.params.id);
		db.set(`bots.${req.params.id}.url`, req.params.url);
		res.redirect('/@' + req.params.url);
  });
	
	app.get("/bot/:id/urlRemove", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		if (!req.user) return res.redirect("/login");
		if (req.user.id !== db.fetch(`bots.${req.params.id}.ownerID`)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bottan özel URL silmek için onun geliştirisi olmanız gereklidir." })
		
    const botCheck = db.fetch(`bots.${req.params.id}`);
    if (!botCheck) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Geçersiz bot ID'si yazdınız, bot bulunamadı." });
    
		const urlCheck = db.fetch(`bots.${req.params.id}.url`);
		if (!urlCheck) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "URL Yok", errorMessage: "Botunuzun bir özel URL'si yoktur." });
		
		client.channels.cache.get("786954715866988584").send("> `🌀️` **|** `" + botCheck.username + "` adlı botun özel URL'si kaldırıldı**!** (Geliştirici**:** <@" + botCheck.ownerID + ">)");
		
		db.delete(`specialURL.${urlCheck}`);
		db.delete(`bots.${req.params.id}.url`);
		res.redirect('/bot/' + req.params.id);
  });

  app.post("/bot/:id", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!db.fetch(`bots.${req.params.id}`)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Veritabanında böyle bir bot bulunamadı." })
    if (req.user.id !== db.fetch(`bots.${req.params.id}.ownerID`)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Botu düzenlemek için onun geliştirisi olmanız gereklidir." })
    
    const oldData = db.fetch(`bots.${req.params.id}`)
    const newData = { library: req.body['botLibrary'] || oldData.library, tags: req.body['botTags'] || oldData.tags, support: req.body['botSupport'] || oldData.tags, site: req.body['botSite'] || oldData.site, prefix: req.body['botPrefix'] || oldData.prefix, banner: req.body['botBannerURL'] || oldData.banner, shortDesc: req.body['botShortDesc'] || oldData.shortDesc, longDesc: req.body['botLongDesc'] || oldData.longDesc };
    
    db.set(`bots.${req.params.id}.library`, newData.library);
    db.set(`bots.${req.params.id}.tags`, newData.tags || ["Diğer"]);
    db.set(`bots.${req.params.id}.support`, newData.support);
    db.set(`bots.${req.params.id}.site`, newData.site);
    db.set(`bots.${req.params.id}.prefix`, newData.prefix);
    db.set(`bots.${req.params.id}.banner`, oldData.perms ? oldData.perms.banner ? newData.banner : "https://cdn.wallpapersafari.com/74/18/ohNFH8.jpg" : "https://cdn.wallpapersafari.com/74/18/ohNFH8.jpg");
    db.set(`bots.${req.params.id}.shortDesc`, newData.shortDesc);
    db.set(`bots.${req.params.id}.longDesc`, newData.longDesc);
    
    Predys.Render(req, res, "cevap.ejs", { type: true, errorTitle: "Bot Düzenlendi!", errorMessage: "Botunuz başarıyla düzenlenmiştir!" })
    db.push(`notifications.${req.user.id}`, `▪ "${db.fetch(`bots.${req.params.id}.username`)}" adlı botunuz başarıyla düzenlendi!`)
  });
	
	app.post("/@:url", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
		const urlCheck = db.fetch(`specialURL.${req.params.url}`);
    if (!urlCheck) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz URL", errorMessage: "Bu özel URL'ye sahip bir bot bulunamadı!" });
    if (!db.fetch(`bots.${urlCheck}`)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Veritabanında böyle bir bot bulunamadı." })
    if (req.user.id !== db.fetch(`bots.${urlCheck}.ownerID`)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Botu düzenlemek için onun geliştirisi olmanız gereklidir." })
    
    const oldData = db.fetch(`bots.${urlCheck}`)
    const newData = { library: req.body['botLibrary'] || oldData.library, tags: req.body['botTags'] || oldData.tags, support: req.body['botSupport'] || oldData.tags, site: req.body['botSite'] || oldData.site, prefix: req.body['botPrefix'] || oldData.prefix, banner: req.body['botBannerURL'] || oldData.banner, shortDesc: req.body['botShortDesc'] || oldData.shortDesc, longDesc: req.body['botLongDesc'] || oldData.longDesc };
    
    db.set(`bots.${urlCheck}.library`, newData.library);
    db.set(`bots.${urlCheck}.tags`, newData.tags);
    db.set(`bots.${urlCheck}.support`, newData.support);
    db.set(`bots.${urlCheck}.site`, newData.site);
    db.set(`bots.${urlCheck}.prefix`, newData.prefix);
    db.set(`bots.${urlCheck}.banner`, oldData.perms ? oldData.perms.banner ? newData.banner : "https://cdn.wallpapersafari.com/74/18/ohNFH8.jpg" : "https://cdn.wallpapersafari.com/74/18/ohNFH8.jpg");
    db.set(`bots.${urlCheck}.shortDesc`, newData.shortDesc);
    db.set(`bots.${urlCheck}.longDesc`, newData.longDesc);
    
    Predys.Render(req, res, "cevap.ejs", { type: true, errorTitle: "Bot Düzenlendi!", errorMessage: "Botunuz başarıyla düzenlenmiştir!" })
    db.push(`notifications.${req.user.id}`, `▪ "${db.fetch(`bots.${urlCheck}.username`)}" adlı botunuz başarıyla düzenlendi!`)
  });
  
//======================================================================//  
  
  app.get("/certificate", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    Predys.Render(req, res, "certificate.ejs", {});
  });
  
  app.post("/certificate", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!req.body['selectedBot']) return res.redirect("/certificate");
    
    const botInfo = db.fetch(`bots.${req.body['selectedBot']}`);
    if (botInfo.ownerID !== req.user.id) return res.redirect("/certificate");
    
    db.set(`bots.${botInfo.id}.certificate`, `waiting`);
		client.channels.cache.get("786954715866988584").send("> `🔒` **|** `" + botInfo.username + "` adlı bot için sertifika talebi oluşturuldu**!** (Geliştirici**:** <@" + botInfo.ownerID + ">)");
    Predys.Render(req, res, "cevap.ejs", { type: true, errorTitle: "Sertifika Talebi Oluşturuldu!", errorMessage: "Sertifika talebi başarıyla oluşturulmuştur, lütfen beklemede kalınız..." })
    db.push(`notifications.${req.user.id}`, `▪ "${botInfo.username}" adlı botunuzun sertifika talebi oluşturuldu!`)
  });
  
//======================================================================//  
  
  app.get("/submit", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    Predys.Render(req, res, "submit.ejs", {});
  });
  
  app.post("/submit", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`bots.${req.body['botId']}`)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Bot Mevcut", errorMessage: "Eklemeye çalıştığınız bot başka birisi tarafından eklenmiştir." })
    
    request({
      url: `https://discordapp.com/api/v7/users/${req.body['botId']}`,
      headers: {
        "Authorization": `Bot ${client.token}`
      }
    }, function(error, response, body) {
      const userCheck = JSON.parse(body);
      if (userCheck.code == 10013) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Yazdığınız ID'ye sahip bir bot bulunamadı kontrol ediniz." })
      if (!userCheck.bot) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Geçersiz ID", errorMessage: "Yazdığınız ID'ye sahip bir bot bulunamadı kontrol ediniz." })
	  const newBotKey = Predys.Random(10) + "-" + Predys.Random(10) + "-" + Predys.Random(10) + "-" + Predys.Random(10) + "-" + Predys.Random(10);
      
      const botInfo = {
        id: userCheck.id,
        username: userCheck.username,
        avatar: userCheck.avatar,
        discriminator: userCheck.discriminator,
        owner: req.user.username,
        ownerID: req.user.id,
        ownerDiscriminator: req.user.discriminator,
        library: req.body['botLibrary'] || "discord.js",
        tags: req.body['botTags'] || ["Diğer"],
        support: req.body['botSupport'] || null,
        site: req.body['botSite'] || null,
        prefix: req.body['botPrefix'] || null,
        banner: "https://cdn.wallpapersafari.com/74/18/ohNFH8.jpg" || null,
        shortDesc: req.body['botShortDesc'] || "Veri yok!",
        longDesc: req.body['botLongDesc'] || "Veri yok!",
        date: Date.now(),
        certificate: false,
        verified: false,
		botKey: newBotKey,
        votes: 0
      };
      
      Predys.Render(req, res, "cevap.ejs", { type: true, errorTitle: "Bot Eklendi!", errorMessage: "Botunuz başarıyla eklenmiştir lütfen beklemede kalınız..." })
      db.set(`bots.${userCheck.id}`, botInfo);
	  db.set(`botKeys.${newBotKey}`, botInfo.id);
	  client.channels.cache.get("786954715866988584").send("> `📓` **|** `" + botInfo.username + "` adlı bot sisteme eklenmiştir, beklemede kalınız**...** (Geliştirici**:** <@" + botInfo.ownerID + ">)");
      db.push(`notifications.${req.user.id}`, `▪ "${userCheck.username}" adlı botunuz sisteme eklendi!`);
    });
  });

//======================================================================//  
  
  app.get("/clearNotifications/:id", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (req.user.id !== req.params.id) return res.redirect("/");
    db.delete(`notifications.${req.params.id}`)
    res.redirect("/");
  });

  app.get("/invite/:id", (req, res) => {
    if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    
    const botInfo = db.fetch(`bots.${req.params.id}`);
    if (!botInfo) return res.redirect('/');
    if (botInfo.verified !== true) return res.redirect('/');

    db.add(`bots.${req.params.id}.invites`, 1);
    res.redirect("https://discord.com/api/oauth2/authorize?client_id=" + botInfo.id + "&permissions=0&scope=bot");
  });
  
//======================================================================//  
  
  app.get("/panel", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`mods.${req.user.id}`) !== true) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    Predys.Render(req, res, "panel.ejs", {});
  });
  
  app.get("/panel/logs", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`mods.${req.user.id}`) !== true) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    Predys.Render(req, res, "panel-log.ejs", {});
  });
  
  app.get("/panel/addModerator", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!client.admins.includes(req.user.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Admin yetkisine sahip olmanız gereklidir." })
    Predys.Render(req, res, "panel-mod.ejs", { success: null });
  });
  
  app.post("/panel/addModerator", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!client.admins.includes(req.user.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Admin yetkisine sahip olmanız gereklidir." })
    db.set(`mods.${req.body['userID']}`, true);
    Predys.Render(req, res, "panel-mod.ejs", { success: req.body['userID'] });
  });
  
  app.get("/panel/removeModerator", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!client.admins.includes(req.user.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Admin yetkisine sahip olmanız gereklidir." })
    Predys.Render(req, res, "panel-unmod.ejs", { success: null });
  });
  
  app.post("/panel/removeModerator", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!client.admins.includes(req.user.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Admin yetkisine sahip olmanız gereklidir." })
    if (client.admins.includes(req.body['userID'])) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Admin yetkisine sahip olan birinin yetkisini alamazsınız." })
    db.delete(`mods.${req.body['userID']}`);
    Predys.Render(req, res, "panel-unmod.ejs", { success: req.body['userID'] });
  });
  
  app.get("/panel/waitingBots", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`mods.${req.user.id}`) !== true) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    Predys.Render(req, res, "panel-bots.ejs", {});
  });
  
  app.get("/panel/waitingCertificate", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`mods.${req.user.id}`) !== true) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    Predys.Render(req, res, "panel-ser.ejs", {});
  });
  
  app.get("/panel/waitingCertificate/decline/:botID/:reason", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`mods.${req.user.id}`) !== true) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    
    const botInfo = db.fetch(`bots.${req.params.botID}`);
    db.push(`notifications.${botInfo.ownerID}`, `▪ "${botInfo.username}" adlı botunuzun sertifika talebi "${req.params.reason || "Sebep Girilmedi"}" sebebinden dolayı "${req.user.username}" tarafından reddedildi!`)
    
    db.set(`bots.${req.params.botID}.certificate`, false)
	client.channels.cache.get("786954715866988584").send("> `🔌` **|** `" + botInfo.username + "` adlı botun sertifika talebi `" + req.params.reason + "` sebebiyle `" + req.user.username +"` tarafından reddedildi**!** (Geliştirici**:** <@" + botInfo.ownerID + ">)");
    res.redirect("/panel/waitingCertificate")
  });
  
  app.get("/panel/waitingCertificate/accept/:botID", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`mods.${req.user.id}`) !== true) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    
    const botInfo = db.fetch(`bots.${req.params.botID}`);
    db.push(`notifications.${botInfo.ownerID}`, `▪ "${botInfo.username}" adlı botunuzun sertifika talebi "${req.user.username}" tarafından onaylandı!`)
    
	client.guilds.cache.get("707544645168660490").members.cache.get(botInfo.ownerID).roles.add("786940806199771136");
	
    db.set(`certificatedDevelopers.${botInfo.ownerID}`, true)
    db.set(`bots.${req.params.botID}.certificate`, true)
	client.channels.cache.get("786954715866988584").send("> `💎` **|** `" + botInfo.username + "` adlı botun sertifika talebi `" + req.user.username + "` tarafından kabul edildi**!** (Geliştirici**:** <@" + botInfo.ownerID + ">)");
    res.redirect("/panel/waitingCertificate")
  });
  
  app.get("/panel/waitingBots/decline/:botID/:reason", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`mods.${req.user.id}`) !== true) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    
    const botInfo = db.fetch(`bots.${req.params.botID}`);
    db.push(`notifications.${botInfo.ownerID}`, `▪ "${botInfo.username}" adlı botunuz "${req.params.reason || "Sebep Girilmedi"}" sebebinden dolayı "${req.user.username}" tarafından reddedildi!`)
    
    db.delete(`bots.${req.params.botID}`)
	client.channels.cache.get("786954715866988584").send("> `🔍` **|** `" + botInfo.username + "` adlı bot `" + req.params.reason + "` sebebiyle `" + req.user.username + "` tarafından reddedildi**!** (Geliştirici**:** <@" + botInfo.ownerID + ">)");
    res.redirect("/panel/waitingBots")
  });
  
  app.get("/panel/waitingBots/accept/:botID", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`mods.${req.user.id}`) !== true) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    
    const botInfo = db.fetch(`bots.${req.params.botID}`);
    db.push(`notifications.${botInfo.ownerID}`, `▪ "${botInfo.username}" adlı botunuz "${req.user.username}" tarafından onaylandı!`)
	
    db.set(`developers.${botInfo.ownerID}`, true)
    db.set(`bots.${req.params.botID}.verified`, true)
	client.channels.cache.get("786954715866988584").send("> `✒` **|** `" + botInfo.username + "` adlı bot `" + req.user.username + "` tarafından kabul edildi**!** (Geliştirici**:** <@" + botInfo.ownerID + ">)");
    res.redirect("/panel/waitingBots")
  });
  
  app.get("/panel/bots", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (db.fetch(`mods.${req.user.id}`) !== true) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    Predys.Render(req, res, "panel-list.ejs", {});
  });
  
  app.get("/panel/bots/remove/:botID/:reason", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!client.admins.includes(req.user.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    
    const botInfo = db.fetch(`bots.${req.params.botID}`);
    db.push(`notifications.${botInfo.ownerID}`, `▪ "${botInfo.username}" adlı botunuz "${req.params.reason || "Sebep Girilmedi"}" sebebinden dolayı "${req.user.username}" tarafından kaldırıldı!`)
    
		client.channels.cache.get("786954715866988584").send("> `📤` **|** `" + botInfo.username + "` adlı bot `" + req.params.reason + "` sebebiyle `" + req.user.username + "` tarafından siteden silindi**!** (Geliştirici**:** <@" + botInfo.ownerID + ">)");
    db.delete(`bots.${req.params.botID}`);
    db.delete(`developers.${botInfo.ownerID}`);
    res.redirect("/panel/bots");
  });
  
  app.get("/panel/bots/removeSer/:botID", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.user) return res.redirect("/login");
    if (!client.admins.includes(req.user.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu sayfayı görüntüleyebilmek için Moderatör yetkisine sahip olmanız gereklidir." })
    
    const botInfo = db.fetch(`bots.${req.params.botID}`);
    db.push(`notifications.${botInfo.ownerID}`, `▪ "${botInfo.username}" adlı botunuzun sertifikası "${req.user.username}" tarafından kaldırıldı!`)
	
    db.set(`bots.${req.params.botID}.certificate`, false);
	client.channels.cache.get("786954715866988584").send("> `📜` **|** `" + botInfo.username + "` adlı botun sertifikası `" + req.user.username + "` tarafından kaldırıldı**!** (Geliştirici**:** <@" + botInfo.ownerID + ">)");
    db.delete(`certificatedDevelopers.${botInfo.ownerID}`);
    res.redirect("/panel/bots");
  });
  
//======================================================================//  
  
  app.get("/api/check/:key/:predysAuth", (req, res) => {
	if (!req.params.predysAuth) return res.json({ success: false, response: "Erişim Reddedildi" })
    if (!req.params.key) return res.json({ success: false, response: "Kontrol edilecek anahtarı header olarak belirtiniz." });
    
	if (req.params.predysAuth !== "gmCmr6ZhokMUlR4rrFzpdFuUtekQ3nLWE9XK6gm5P6goDubWDA") return res.json({ success: false, response: "Erişim Reddedildi" });
	
    const checkKey = db.fetch(`botKeys.${req.params.key}`);
    if (!checkKey) {
      res.json({ success: true, response: false });
    } else {
      res.json({ success: true, response: true });
    };
  });
  
  app.get("/api/voted/:key/:id/:predysAuth", (req, res) => {
	if (!req.params.predysAuth) return res.json({ success: false, response: "Erişim Reddedildi" })
    if (!req.params.key) return res.json({ success: false, response: "Lütfen botunuzun anahtarını parametre olarak yazınız." });
    if (!req.params.id) return res.json({ success: false, response: "Kontrol etmek istediğiniz kullanıcının ID'sini yazınız." });
    
	if (req.params.predysAuth !== "gmCmr6ZhokMUlR4rrFzpdFuUtekQ3nLWE9XK6gm5P6goDubWDA") return res.json({ success: false, response: "Erişim Reddedildi" });
	
    const checkUser = db.fetch(`lastVoted.${req.params.id}.${db.fetch(`botKeys.${req.params.key}`)}`);
    if (checkUser) {
      if ((Date.now() - checkUser) > 43200000) return res.json({ success: true, response: false });
      return res.json({ success: true, response: true });
    };
	res.json({ success: true, response: false });
  });

  app.get("/api/stats/:key/:server/:user/:predysAuth", (req, res) => {
	if (!req.params.predysAuth) return res.json({ success: false, response: "Erişim Reddedildi" })
    if (!req.params.key) return res.json({ success: false, message: "Lütfen botunuzun anahtarını parametre olarak yazınız." });
    if (!req.params.server) return res.json({ success: false, message: "Eksik veri girilmiştir." });
    if (!req.params.user) return res.json({ success: false, message: "Eksik veri girilmiştir." });
    
	if (req.params.predysAuth !== "gmCmr6ZhokMUlR4rrFzpdFuUtekQ3nLWE9XK6gm5P6goDubWDA") return res.json({ success: false, response: "Erişim Reddedildi" });
	
    const botID = db.fetch(`botKeys.${req.params.key}`);
    db.set(`bots.${botID}.server`, req.params.server);
    db.set(`bots.${botID}.user`, req.params.user);
    res.json({ success: true, message: "Bot istatistikleri güncellendi!" });
  });
  
//======================================================================//  

  
  app.get("/code", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		if (!req.user) return res.redirect('/login');
		Predys.Render(req, res, 'code-main.ejs', {});
	});
	
	app.get("/code/publish", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		if (!req.user) return res.redirect('/login');
		
		let SERVER_ROLES = [];
		const SERVER = client.guilds.cache.get('707544645168660490');
		const ALL_ROLES = SERVER.roles.cache.map(x => x);
		for(let i = 0; i < ALL_ROLES.length; i++) {
			let ROLE = ALL_ROLES[i];
			SERVER_ROLES.push({ id: ROLE.id, name: ROLE.name, position: ROLE.rawPosition });
		};
		
		Predys.Render(req, res, 'code-publish.ejs', { roles: SERVER_ROLES });
	});

	app.post("/code/publish", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		if (!req.user) return res.redirect('/login');

		if (!client.admins.includes(req.user.id)) {
			const SERVER = client.guilds.cache.get('707544645168660490');
			if (!SERVER.member(client.users.cache.get(req.user.id)).roles.cache.find(x => x.id == "769622574639874119")) {
				let form = req.body;
				let codeID = Predys.Random(20);
				
				const codeInfo = {
					title: form['codeTitle'],
					desc: form['codeDesc'],
					package: form['codePackage'],
					perm: "783333792223068210",
					category: "Sizden Gelenler",
					owner: req.user,
					file1: { name: form['codeName1'], code: form['editor1'] },
					file2: { name: form['codeName2'], code: form['editor2'] },
					file3: { name: form['codeName3'], code: form['editor3'] },
					file4: { name: form['codeName4'], code: form['editor4'] },
					file5: { name: form['codeName5'], code: form['editor5'] },
					date: Date.now(),
					id: codeID
				};
				
				db.set(`codes.${codeID}`, codeInfo);
				client.channels.cache.get("769649684678836247").send("> `🎇` **|** `" + req.user.username + "` adlı kullanıcı `" + "Sizden Gelenler" + "` kategorisinde `" + codeInfo.title + "` adlı bir kod paylaştı**!** `(Toplam " + ((db.fetch(`published.${req.user.id}`) || 0) + 1) + " kod paylaştı!)`");
				db.add(`published.${req.user.id}`, 1);
				db.push(`notifications.${req.user.id}`, `▪ "${codeInfo.title}" adlı kod başarıyla paylaşıldı!`);
				res.redirect('/code/view/' + codeID);
				return;
			};
		};
		
		let form = req.body;
		let codeID = Predys.Random(20);
		
		const codeInfo = {
			title: form['codeTitle'],
			desc: form['codeDesc'],
			package: form['codePackage'],
			perm: form['codePerm'],
			category: form['codeCategory'],
			owner: req.user,
			file1: { name: form['codeName1'], code: form['editor1'] },
			file2: { name: form['codeName2'], code: form['editor2'] },
			file3: { name: form['codeName3'], code: form['editor3'] },
			file4: { name: form['codeName4'], code: form['editor4'] },
			file5: { name: form['codeName5'], code: form['editor5'] },
			date: Date.now(),
			id: codeID
		};
		
		db.set(`codes.${codeID}`, codeInfo);
		client.channels.cache.get("769649684678836247").send("> `👑` **|** `" + req.user.username + "` adlı yetkili `" + codeInfo.category + "` kategorisinde `" + codeInfo.title + "` adlı bir kod paylaştı**!**  `(Toplam " + ((db.fetch(`published.${req.user.id}`) || 0) + 1) + " kod paylaştı!)`");
		db.add(`published.${req.user.id}`, 1);
    db.push(`notifications.${req.user.id}`, `▪ "${codeInfo.title}" adlı kod başarıyla paylaşıldı!`);
		res.redirect('/code/view/' + codeID);
	});
	
	app.get("/code/codes", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
    if (!req.query.page) return res.redirect("/code/codes?page=1");
    if (isNaN(req.query.page)) return res.redirect("/code/codes?page=1");
    if (req.query.page < 1) return res.redirect("/code/codes?page=1");
    
    let one, two, three, four, five, six;
    var codes = db.fetch(`codes`);

    const allCodes = Object.keys(codes).filter(x => req.query.q ? (codes[x].title.toLowerCase()).includes(req.query.q.toLowerCase()) : x).filter(x => req.query.tag ? codes[x].category == req.query.tag : x).sort((a, b) => {
  		const allLikesForA = Object.keys(codes[a].voted ? codes[a].voted: []).filter(x => codes[a].voted[x] == "like");
		  const allLikesMapForA = allLikesForA.map(like => like);
		  const allLikesForB = Object.keys(codes[b].voted ? codes[b].voted : []).filter(x => codes[b].voted[x] == "like");
		  const allLikesMapForB = allLikesForB.map(like => like);		
      return (allLikesMapForB.length) - (allLikesMapForA.length) 
    }).slice((req.query.page - 1) * 6, 6 * req.query.page).map(code => code);
    
		for(let i = 0; i < 6; i++) {
			const codeInformation = codes[allCodes[i]];
			if (codeInformation) {
				if (!one) { one = codeInformation; } else {
				if (!two) { two = codeInformation; } else {
				if (!three) { three = codeInformation; } else {
				if (!four) { four = codeInformation; } else {
				if (!five) { five = codeInformation; } else {
				if (!six) { six = codeInformation; }}}}}};
			};
		};
    
    let allCodesData = { one: one, two: two, three: three, four: four, five: five, six: six };
    Predys.Render(req, res, "code-all.ejs", { q: req.query.q, tag: req.query.tag, page: req.query.page, codes: allCodesData });
  });
	
	app.get("/code/view/:key", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		if (!req.user) return res.redirect('/login');
		
		const codeInfo = db.fetch(`codes.${req.params.key}`);
		if (!req.params.key) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Kod Bulunamadı", errorMessage: "Geçersiz kod ID'si girdiniz." });
		if (!codeInfo) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Kod Bulunamadı", errorMessage: "Geçersiz kod ID'si girdiniz." });
	
		if (!client.admins.includes(req.user.id)) {
			if (req.user.id !== codeInfo.owner.id) {
				const SERVER = client.guilds.cache.get('707544645168660490');
				if (!SERVER.member(client.users.cache.get(req.user.id)).roles.cache.find(x => x.id == codeInfo.perm)) {
					return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Bu kodu görüntülemek için " + SERVER.roles.cache.get(codeInfo.perm).name + " rolüne sahip olmalısın!" })
				};
			};
		};
		
		Predys.Render(req, res, 'code-view.ejs', { code: codeInfo });
	});
	
	app.get("/code/like/:key", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		if (!req.user) return res.redirect('/login');
		
		const codeInfo = db.fetch(`codes.${req.params.key}`);
		if (!req.params.key) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Kod Bulunamadı", errorMessage: "Geçersiz kod ID'si girdiniz." });
		if (!codeInfo) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Kod Bulunamadı", errorMessage: "Geçersiz kod ID'si girdiniz." });
	
		if (db.fetch(`codes.${req.params.key}.voted.${req.user.id}`)) {
			if (db.fetch(`codes.${req.params.key}.voted.${req.user.id}`) == "like") {
				db.delete(`codes.${req.params.key}.voted.${req.user.id}`);
				res.redirect("/code/view/" + req.params.key);
				client.channels.cache.get("769649684678836247").send("> `🎫` **|** `" + req.user.username + "` adlı kullanıcı `" + codeInfo.title + "` adlı kodu beğenmekten vazgeçti**!**");
				return;
			};
			db.set(`codes.${req.params.key}.voted.${req.user.id}`, "like");
			client.channels.cache.get("769649684678836247").send("> `🌟` **|** `" + req.user.username + "` adlı kullanıcı `" + codeInfo.title + "` adlı kodu beğendi**!**");
		} else {
			db.set(`codes.${req.params.key}.voted.${req.user.id}`, "like");
			client.channels.cache.get("769649684678836247").send("> `🌟` **|** `" + req.user.username + "` adlı kullanıcı `" + codeInfo.title + "` adlı kodu beğendi**!**");
		};

		res.redirect("/code/view/" + req.params.key);
	});
	
	app.get("/code/dislike/:key", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		if (!req.user) return res.redirect('/login');
		
		const codeInfo = db.fetch(`codes.${req.params.key}`);
		if (!req.params.key) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Kod Bulunamadı", errorMessage: "Geçersiz kod ID'si girdiniz." });
		if (!codeInfo) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Kod Bulunamadı", errorMessage: "Geçersiz kod ID'si girdiniz." });
	
		if (db.fetch(`codes.${req.params.key}.voted.${req.user.id}`)) {
			if (db.fetch(`codes.${req.params.key}.voted.${req.user.id}`) == "dislike") {
				db.delete(`codes.${req.params.key}.voted.${req.user.id}`);
				res.redirect("/code/view/" + req.params.key);
				client.channels.cache.get("769649684678836247").send("> `🎫` **|** `" + req.user.username + "` adlı kullanıcı `" + codeInfo.title + "` adlı kodu beğenmemekten vazgeçti**!**");
				return;
			};
			db.set(`codes.${req.params.key}.voted.${req.user.id}`, "dislike");
			client.channels.cache.get("769649684678836247").send("> `🌟` **|** `" + req.user.username + "` adlı kullanıcı `" + codeInfo.title + "` adlı kodu beğenmedi**!**");
		} else {
			db.set(`codes.${req.params.key}.voted.${req.user.id}`, "dislike");
			client.channels.cache.get("769649684678836247").send("> `🌟` **|** `" + req.user.username + "` adlı kullanıcı `" + codeInfo.title + "` adlı kodu beğenmedi**!**");
		};

		res.redirect("/code/view/" + req.params.key);
	});
	
	app.get("/code/delete/:key", (req, res) => {
		if (disableOldDomain == true) {if ((req.get('host')).includes(oldDomain)) return res.send("--> Eski domain kullanım dışıdır, yeni domain: " + newDomain);};
		if (!req.user) return res.redirect('/login');
		
		const codeInfo = db.fetch(`codes.${req.params.key}`);
		if (!req.params.key) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Kod Bulunamadı", errorMessage: "Geçersiz kod ID'si girdiniz." });
		if (!codeInfo) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Kod Bulunamadı", errorMessage: "Geçersiz kod ID'si girdiniz." });
		if (req.user.id !== codeInfo.owner.id) { if (!client.admins.includes(req.user.id)) return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Yetersiz Yetki", errorMessage: "Kodu sadece paylaşan kişi ve adminler silebilir." }); };
		if (req.params.key == "YpEBCzT6j0dkvLBof9pT") return Predys.Render(req, res, "cevap.ejs", { type: false, errorTitle: "Kod Silinemez", errorMessage: "Sistem adlı kod silinemez!" });
	
		db.delete(`codes.${req.params.key}`);
		res.redirect('/code');
  });


//======================================================================//  

  app.get("/wallet", (req, res) => {
    if (!req.user) return res.redirect("/login");
    Predys.Render(req, res, "wallet.ejs");
  });

  app.post("/wallet/shop", (req, res) => {
    if (!req.user) return res.send('Kullanıcı verisi bulunamadı!');
    if (!req.query.data) return res.send('Satın alınacak ürünün verisi bulunamadı!');
    if (!req.query.id) return res.send('Satın alınacak özelliğin hangi bota gideceğini belirtiniz!');

    // özel url
    if (req.query.data == "001") {
      var fiyat = 15;
      var bakiye = db.fetch(`wallet.${req.user.id}`) || 0;

      if (bakiye < fiyat) return res.send('Yetersiz bakiye, gereken: ' + fiyat + ' DarkCoin');
      if (!db.has(`bots.${req.query.id}`)) return res.send('Geçersiz bot ID\'si yazdınız.');

      var bot = db.fetch(`bots.${req.query.id}`);
      if (req.user.id !== bot.ownerID) {
        if (!client.admins.includes(req.user.id)) return res.send('Başkasının botuna özellik satın alamazsın!');
      };

      // işlem
      db.set(`bots.${bot.id}.perms.specialURL`, true);
      db.add(`wallet.${req.user.id}`, -fiyat);
      client.channels.cache.get('786954715866988584').send('> `🛒` **|** ``' + req.user.username + '`` adlı kullanıcı mağazadan `Özel URL` ürününü satın aldı**!**');
      res.send(true);
    };

    // banner
    if (req.query.data == "002") {
      var fiyat = 15;
      var bakiye = db.fetch(`wallet.${req.user.id}`) || 0;

      if (bakiye < fiyat) return res.send('Yetersiz bakiye, gereken: ' + fiyat + ' DarkCoin');
      if (!db.has(`bots.${req.query.id}`)) return res.send('Geçersiz bot ID\'si yazdınız.');

      var bot = db.fetch(`bots.${req.query.id}`);
      if (req.user.id !== bot.ownerID) {
        if (!client.admins.includes(req.user.id)) return res.send('Başkasının botuna özellik satın alamazsın!');
      };

      // işlem
      db.set(`bots.${bot.id}.perms.banner`, true);
      db.add(`wallet.${req.user.id}`, -fiyat);
      client.channels.cache.get('786954715866988584').send('> `🛒` **|** ``' + req.user.username + '`` adlı kullanıcı mağazadan `Bot Afişi` ürününü satın aldı**!**');
      res.send(true);
    };

    // reklam
    if (req.query.data == "003") {
      if (!req.query.day) return res.send('Reklamın süresini belirtiniz!');
      if (!req.query.link) return res.send('Reklamın linkini belirtiniz!');
      if (!req.query.href) return res.send('Reklamın yönlendirme linkini belirtiniz!');
      
      var fiyat = (25 * (parseInt(req.query.day) == 0 ? 1 : parseInt(req.query.day)));
      var bakiye = db.fetch(`wallet.${req.user.id}`) || 0;

      if (bakiye < fiyat) return res.send('Yetersiz bakiye, gereken: ' + fiyat + ' DarkCoin');
      if (db.fetch(`ads.${req.user.id}`)) return res.send('Zaten bir reklam satın aldınız!');

      // işlem
      db.set(`ads.${req.user.id}`, { href: req.query.href, link: req.query.link, start: Date.now(), day: (parseInt(req.query.day) == 0 ? 86400000 : (parseInt(req.query.day) * 86400000)) });
      db.add(`wallet.${req.user.id}`, -fiyat);
      client.channels.cache.get('786954715866988584').send('> `🛒` **|** ``' + req.user.username + '`` adlı kullanıcı mağazadan `' + (parseInt(req.query.day) == 0 ? 1 : parseInt(req.query.day)) +' Günlük Reklam` ürününü satın aldı**!**');
      res.send(true);
    };

    // oy
    if (req.query.data == "004") {
      if (!req.query.adet) return res.send('Reklamın süresini belirtiniz!');
      
      var fiyat = (3 * (parseInt(req.query.adet) == 0 ? 1 : parseInt(req.query.adet)));
      var bakiye = db.fetch(`wallet.${req.user.id}`) || 0;

      if (bakiye < fiyat) return res.send('Yetersiz bakiye, gereken: ' + fiyat + ' DarkCoin');

      var bot = db.fetch(`bots.${req.query.id}`);
      if (!bot) return res.send('Geçersiz bot ID\'si yazdınız!');
      if (bot.ownerID !== req.user.id) {
        if (!client.admins.includes(req.user.id)) return res.send('Başkasının botuna oy satın alamazsın!');
      };

      // işlem
      db.add(`bots.${req.query.id}.votes`, parseInt(req.query.adet));
      db.add(`wallet.${req.user.id}`, -fiyat);
      client.channels.cache.get('786954715866988584').send('> `🛒` **|** ``' + req.user.username + '`` adlı kullanıcı mağazadan `' + (parseInt(req.query.adet) == 0 ? 1 : parseInt(req.query.adet)) +' Adet Oy` ürününü satın aldı**!**');
      res.send(true);
    };
  });

  setInterval(() => {
    const allDatas = db.fetch(`walletMine`) || [];
    const allMiners = Object.keys(allDatas).map(miner => miner);
    for(let i = 0; i < allMiners.length; i++) {
      const miner = allMiners[i];
      if ((Date.now() - allDatas[allMiners[i]]) >= 10800000) {
        db.delete(`walletMine.${miner}`);
        db.set(`walletCooldown.${miner}`, Date.now());
        return;
      };
      db.add(`wallet.${miner}`, (0.002 * 20));
    };

    const allAdDatas = db.fetch(`ads`) || [];
    const allAds = Object.keys(allAdDatas).map(ad => ad);
    for (let i = 0; i < allAds.length; i++) {
      const ad = allAdDatas[allAds[i]];
      const left = (ad.day - (Date.now() - ad.start));

      if (left < 1) {
        client.channels.cache.get('786954715866988584').send('> `🛒` **|** ``' + (client.users.cache.get(allAds[i]) ? client.users.cache.get(allAds[i]).username : "Sunucudan çıkmış!") + '`` adlı kullanıcının reklamı sona erdi**!**');
        db.delete(`ads.${allAds[i]}`);
      };
    };
  }, 60000);

  app.post("/wallet/balance", (req, res) => {
    if (!req.user) return res.send('Kullanıcı verisi bulunamadı!')
    res.send(db.fetch(`wallet.${req.user.id}`).toString());
  });

  app.post("/wallet/miner", (req, res) => {
    if (!req.user) return res.send('Kullanıcı verisi bulunamadı!')

    var miner = db.fetch(`walletMine.${req.user.id}`);
    if (miner) {
      if ((Date.now() - miner) < 10800000) return res.send('Madenci zaten çalışıyor!');
    };
    var cooldown = db.fetch(`walletCooldown.${req.user.id}`);
    if (cooldown) {
      if ((Date.now() - cooldown) < 7200000) return res.send('Madenciyi yeniden başlatmak için ' + (((7200000 - (Date.now() - cooldown)) / 1000) / 60).toString().split(".")[0] + ' dakika bekleyiniz!');
    };

    db.set(`walletMine.${req.user.id}`, Date.now());
    res.send(true);
  });

  app.post("/wallet/createCode", (req, res) => {
    if (!req.user) return res.send('Kullanıcı verisi bulunamadı!');
    if (!req.query.balance) return res.send('Kod değeri bulunamadı!');

    var miktar = parseInt(req.query.balance);
    var bakiye = parseInt(db.fetch(`wallet.${req.user.id}`).toString().split('.')[0]);

    if (req.query.admin) {
      if (req.query.admin == "true") {
        if (!client.admins.includes(req.user.id)) {
          if (miktar > bakiye) return res.send('Yetersiz bakiye, gereken: ' + miktar + ' DarkCoin');
        };
      } else {
        if (miktar > bakiye) return res.send('Yetersiz bakiye, gereken: ' + miktar + ' DarkCoin');
      };
    } else {
      if (miktar > bakiye) return res.send('Yetersiz bakiye, gereken: ' + miktar + ' DarkCoin');
    };

    if (db.fetch(`walletKey.${req.user.id}`)) return res.send('Yeni kod oluşturmak için eski kodu silmelisiniz!');
    if (miktar < 1 || miktar > 100) return res.send('Kod değeri minumum 1, maksimum 100 olabilir.');

    var codeInfo = {
      id: 'DARKCODE-' + Predys.Random(5) + '-' + Predys.Random(5) + '-' + Predys.Random(5) + '-' + Predys.Random(5),
      balance: miktar,
      owner: req.user,
      used: false
    };

    if (req.query.admin) {
      if (req.query.admin == "true") {
        if (!client.admins.includes(req.user.id)) {
          db.add(`wallet.${req.user.id}`, -miktar);
        };
      } else {
        db.add(`wallet.${req.user.id}`, -miktar);
      };
    } else {
      db.add(`wallet.${req.user.id}`, -miktar);
    };

    db.set(`walletKey.${req.user.id}`, codeInfo);
    res.send('true||' + codeInfo.id);
  });

  app.post("/wallet/deleteCode", (req, res) => {
    if(!req.user) return res.send('Kullanıcı verisi bulunamadı!');

    var codeInfo = db.fetch(`walletKey.${req.user.id}`);
    if (!codeInfo) return res.send('Oluşturulmuş bir kodun yok!');
    if (codeInfo.used === false) db.add(`wallet.${req.user.id}`, codeInfo.balance);

    res.send(true);
    db.delete(`walletKey.${req.user.id}`);
  });

  app.post("/wallet/useCode", (req, res) => {
    if (!req.user) return res.send('Kuallnıcı verisi bulunamadı!');
    if (!req.query.code) return res.send('Kod verisi bulunamadı!');

    var keys = db.fetch(`walletKey`);
    var allCodes = Object.keys(keys).map(code => code);
    let codeInfo;

    for(let i = 0; i < allCodes.length; i++) {
      if (req.query.code == keys[allCodes[i]].id) codeInfo = keys[allCodes[i]];
    };

    if (!codeInfo) return res.send('Geçersiz kod girdiniz!');
    if (codeInfo.used !== false) return res.send('Kod başka birisi tarafından kullanılmış!');

    db.add(`wallet.${req.user.id}`, codeInfo.balance);
    db.set(`walletKey.${codeInfo.owner.id}.used`, req.user);
    res.send(true);
  });

//======================================================================//  

  server.listen(process.env.PORT || 80, () => {
    console.log("--> Site başlatıldı, bütün sistemler aktif edildi!");
    require('./darkcode-cdn.js')(app);
    ioDB.delete('onlineVisitors');
  });
  
};

//======================================================================//