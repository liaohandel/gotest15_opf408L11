var express = require('express');
var app = express();
var port = 3510;
var http = require('http');
var server = http.createServer(app);
var htmlio = require('./htmlio.js');
var pdbuffer = require('./pdbuffer.js');

app.use('/', express.static('.'));
htmlio.setserver(server);

server.listen(port, function () {
	pdbuffer.sysload(function () {
		setInterval(function () {
			pdbuffer.eventcall('rxbuff_event');
		}, 50);
		pdbuffer.initswreg();
		setInterval(function () {
			pdbuffer.eventcall('swreg_event');
		}, 1000);
	});
});

console.log('webchktool port: ' + port);
