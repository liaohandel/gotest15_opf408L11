var request = require('request');
var spawn = require('child_process').spawn;
var Emitter = require('events').EventEmitter;
var platform = require('os').platform();
//var lock = require('lock')();
var async = require('async');

var uuid = require('uuid');
var url = require('url');

//=== file load module === 
var path = require('path');
var fs = require('fs');
var os = require('os');

var filename = "PDDATA.txt"
var filepath = path.join(__dirname, ("/public/" + filename));
var pdjobj = {}


//link gateway pam  login web server
var Client = require('node-rest-client').Client;
var client = new Client();
var cargs = {
	requestConfig: {
		timeout: 500,
		noDelay: true,
		keepAlive: true
	},
	responseConfig: {
		timeout: 1000 //response timeout 
	}
};

var seturl = ""
var chkurl = ""
var setport = 3000
var linkchkcount = 0

var ddsnurl = "http://106.104.112.56/Cloud/API/linkbox.php"
var vdsnurl = "http://106.104.112.56/Cloud/API/videobox.php"
var devloadurl = "http://106.104.112.56/Cloud/API/linkbox.php"
var setdeviceip = 'https://c4915760.ngrok.io'
var setdeviceport = 'C909'
var setuuid = '1234567890abcdefghijk'

var setddsnurl = ddsnurl + '?DeviceIP=' + setdeviceip + '&UUID=' + setuuid
var setvdsnurl = ddsnurl + '?DeviceIP=' + setdeviceip + '&DevicePOS=' + setdeviceport + '&UUID=' + setuuid
var setdevouturl = devloadurl + "?UUID=" + setuuid + "&result=" + "{}"

var ngrok = require('ngrok');

var exec = require('child_process').exec;


fs.readFile(filepath, function (err, content) {
	let uuiddata = content.toString();
	pdjobj = JSON.parse(uuiddata);

	ddsnurl = pdjobj.PDDATA.dsnurl;
	vdsnurl = pdjobj.PDDATA.videodsnurl;
	devloadurl = pdjobj.PDDATA.devloadurl;
	setuuid = pdjobj.PDDATA.UUID;

	console.log("uuids = ", setuuid);
	console.log("dsnurl = ", ddsnurl);
	console.log("videodsnurl = ", vdsnurl);//devloadur
	console.log("devloadur = ", devloadurl);
	if (pdjobj.PDDATA.linkoffmode == 0) {
		loadddsn();
		setInterval(function () {
			chkurl = seturl + "/connectcheck";
			client.get(chkurl, function (data, response) {
				if (data == null) {
					chkstr = "null";
				} else {
					chkstr = data.toString();
				}
				console.log("linkchk ... " + chkstr);
				if (chkstr === "ready") {
					console.log("ddns ready");
				} else {
					exec('sudo pm2 restart loadwebappddns.js', function () {
						console.log("restart link loadwebappddns ... ");
					});
				}
			}).on("error", function (err) {
				exec('sudo pm2 restart loadwebappddns.js', function () {
					console.log("restart link loadwebappddns ... ");
				});
			});
		}, 10 * 60 * 1000);
	} else if (pdjobj.PDDATA.linkoffmode == 1) {//off link mode
		console.log(">>OFF Link Mode !");
	} else if (pdjobj.PDDATA.linkoffmode == 2) {//by 220 mode
		console.log(">>LOCAL server 192.268.5.220 Link Mode !");
	}
});

function loadddsn() {
	console.log('recall link ngrok ...');
	ngrok.disconnect(); // stops all

	ngrok.connect(setport, function (err, url) {
		if (url === undefined) { //### this chek use the ngrok is fail  unlink .... 20180909 
			url = "http://0000";
		}
		seturl = url
		chkurl = seturl + "/connectcheck"
		console.log("link container opf408L10 or opf403,opdf406 =>" + seturl);
		setddsnurl = ddsnurl + '?DeviceIP=' + seturl + '&UUID=' + setuuid;
		client.get(setddsnurl, cargs, function (data, response) {
			console.log("get ok...");
		}).on("error", function (err) { console.log("err for client"); }).on('requestTimeout', function (req) { req.abort(); });
	});
}
