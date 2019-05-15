var express = require('express');
var app = express();
var port = 3500;
var http = require('http');
var server = http.createServer(app);
var savelog = require('./savelog.js');
var redisfunc = require('./redisfunc.js');

app.use('/', express.static('.'));
app.get('/LOGSWITCH', function (req, res) {
	res.json(req.query);
});
app.get('/LOADDATA', function (req, res) {
	let datatype = req.query.DATATYPE;
	let data = {};
	redisfunc.client.hgetall(savelog.setuuid, function (err, obj) {
		if (err) {
			console.log('Redis load error:' + err);
			return;
		}
		for (let it in obj) {
			data[it] = JSON.parse(obj[it])[datatype];
		}
		res.json(data);
	});
});
server.listen(port, function () {
	savelog.sysload(function () {
		setInterval(function () {
			console.log("runloop_event...");
			savelog.eventcall('runloop_event');
		}, 15 * 1000);
	});
});

console.log('weblogtool port: ' + port);
