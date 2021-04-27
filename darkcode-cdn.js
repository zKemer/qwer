const path = require('path');
const fs = require('fs');

module.exports = (app) => {
	
	app.get("/cdn/embed.js", (req, res) => {
		res.set('content-type', 'text/javascript');
		res.send(fs.readFileSync('cdn/embed.js').toString());
	});
	
	console.log("--> CDN başlatıldı ve aktif edildi!\n");
	
};