var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var path = require('path');
var fs = require('fs');

var Client = require('node-rest-client').Client;
var client = new Client();
var cargs = {
	requestConfig: {
		timeout: 10, //500,
		noDelay: true,
		keepAlive: true
	},
	responseConfig: {
		timeout: 10 //1000 //response timeout 
	}
};

var setuuid = '1234567890abcdefghijk';
//=== PDDATA.txt to pdjobj
var filename = "PDDATA.txt";
var filepath = path.join(__dirname, ("../public/" + filename));
var xpdjobj = {}; //pd buffer 

var loopdata = require('./data/loopdata.js');
var logexample = require('./data/logexample.js');
var redisfunc = require('./redisfunc.js');

function paddingLeft(str, lenght) {
	str = str + "";
	if (str.length >= lenght)
		return str;
	else
		return paddingLeft("0" + str, lenght);
}
function paddingRight(str, lenght) {
	str = str + "";
	if (str.length >= lenght)
		return str;
	else
		return paddingRight(str + "0", lenght);
}

function gettimestring() {
	let nowtime = new Date();
	let nowtimestring = "T"
		+ paddingLeft(nowtime.getFullYear(), 4)
		+ '-' + paddingLeft(nowtime.getMonth() + 1, 2)
		+ '-' + paddingLeft(nowtime.getDate(), 2)
		+ '-' + paddingLeft(nowtime.getHours(), 2)
		+ ':' + paddingLeft(nowtime.getMinutes(), 2)
		+ ':' + paddingLeft(nowtime.getSeconds(), 2);
	return nowtimestring;
}

function jobjcopy(jobj) {
	return JSON.parse(JSON.stringify(jobj));
}

function sysload(callback) {
	fs.readFile(filepath, function (err, content) {
		if (err) { throw err; }

		let uuiddata = content.toString();

		xpdjobj = JSON.parse(uuiddata);
		setuuid = xpdjobj.PDDATA.UUID;

		exports.pdjobj = xpdjobj;
		exports.setuuid = setuuid

		callback();
	});
}

function eventcall(callmask) {
	event.emit(callmask);
}
function client_trige_savedata(ljob, key, devcmd) {
	let dpos = "";
	let dtype = "";
	let dregadd = "";
	let dstu = "";
	let dgroup = "";
	let switch_url = "";
	let devlist = ljob.CHKLOOP.SENSORPOS[key];
	dpos = devlist.POS;
	dtype = devlist.CMD;
	dregadd = devlist.STU.substr(0, 2);
	dstu = devlist.STU;
	dgroup = devlist.GROUP;

	switch_url = "http://192.168.5.105:3000/" + dtype
		+ '?UUID=' + setuuid
		+ "&POS=" + dpos
		+ "&Action=" + devcmd
		+ "&STU=" + dstu
		+ "&GROUP=" + dgroup;
	console.log(">>switch_url => " + switch_url);
	client.get(switch_url, function (data, response) {
		if (!((typeof data) == 'object')) {
			ljob.CHKLOOP.CHKVALUE[key] = {};
			return;
		}
		ljob.CHKLOOP.CHKVALUE[key] = jobjcopy(data);
		console.log("savelevel>>" + JSON.stringify(data));
	}).on("error", function (err) {
		console.log("err for client");
		ljob.CHKLOOP.CHKVALUE[key] = {};
	});
}

function readautoloopdata(logtemp, key, dev) {
	let dataobj = logtemp[key];
	if ("STATU" in dev) {
		dataobj.STATU = dev.STATU;
	}
	if ("SENSOR_CONTROL" in dev) {
		dataobj.SENSOR_CONTROL = dev.SENSOR_CONTROL;
	}
	if ("CHKLOOP" in dev) {
		if ("CHKVALUE" in dev.CHKLOOP) {
			if ("WAIT1" in dev.CHKLOOP.CHKVALUE) {
				dataobj.WAIT1 = dev.CHKLOOP.CHKVALUE.WAIT1;
			}
		}
	}
}

function readchkloopdata(key, dev) {
	if ("CHKLOOP" in dev) {
		if ("CHKVALUE" in dev.CHKLOOP) {
			if (key in dev.CHKLOOP.CHKVALUE) {
				return dev.CHKLOOP.CHKVALUE[key];
			}
		}
	}
	return 0;
}

function readdata(dev, datatype, reg) {
	console.log("readdata suf >>");
	if ("result" in dev) {
		console.log("readdata suf >>result");
		for (let it in dev.result) {
			if ("CMD" in dev.result[it]) {
				console.log("readdata suf >>" + it + " CMD");
				if (dev.result[it].CMD == datatype) {
					console.log("readdata suf >>" + datatype);
					if ("chtab" in dev.result[it]) {
						console.log("readdata suf >>chtab");
						if (reg in dev.result[it].chtab) {
							if ("stu" in dev.result[it].chtab[reg]) {
								console.log("readdata suf >>" + dev.result[it].chtab[reg].stu);
								return dev.result[it].chtab[reg].stu;
							}
						}
					}
				}
			}
		}
	}
	return 0;
}
function readdatasub(dev, datatype, reg) {
	console.log("readdata suf >>");
	if ("result" in dev) {
		console.log("readdata suf >>result");
		for (let it in dev.result) {
			if ("CMD" in dev.result[it]) {
				console.log("readdata suf >>" + it + " CMD");
				if (dev.result[it].CMD == datatype) {
					console.log("readdata suf >>" + datatype);
					if ("chtab" in dev.result[it]) {
						console.log("readdata suf >>chtab");
						if (reg in dev.result[it].chtab) {
							if ("sub" in dev.result[it].chtab[reg]) {
								console.log("readdata suf >>" + dev.result[it].chtab[reg].sub);
								return dev.result[it].chtab[reg].sub;
							}
						}
					}
				}
			}
		}
	}
	return 0;
}

function readtmscstatu(dev) {
	if ("STATU" in dev) {
		return dev.STATU;
	}
	return 0;
}

var _runloop = {
	"LINKDATA": function (ljob) {
		let logtemp;
		let dataobj = {};
		console.log(">>LINKDATA = " + ljob.SENSOR_CONTROL);
		ljob.SENSOR_CONTROL = Number(ljob.SENSOR_CONTROL);
		switch (ljob.SENSOR_CONTROL) {
			case 0:
				client_trige_savedata(ljob, "DEVE002", "ON");
				client_trige_savedata(ljob, "DEVE003", "ON");
				client_trige_savedata(ljob, "DEVC00A", "ON");
				client_trige_savedata(ljob, "DEVH002", "ON");
				client_trige_savedata(ljob, "DEVH004", "ON");
				client_trige_savedata(ljob, "DEVH005", "ON");
				client_trige_savedata(ljob, "DEVA032", "ON");
				client_trige_savedata(ljob, "DEVA03A", "ON");
				client_trige_savedata(ljob, "DEVH010", "ON");
				client_trige_savedata(ljob, "DEVH011", "ON");
				client_trige_savedata(ljob, "BOX2LOOP", "LOAD");
				client_trige_savedata(ljob, "ECDOSELOOP", "LOAD");
				client_trige_savedata(ljob, "autotmloop", "LOAD");
				client_trige_savedata(ljob, "autopumpmotoloop", "LOAD");
				client_trige_savedata(ljob, "DOSE", "LOAD");
				client_trige_savedata(ljob, "DOSEA", "LOAD");
				client_trige_savedata(ljob, "DOSEB", "LOAD");
				client_trige_savedata(ljob, "DOSEC", "LOAD");
				client_trige_savedata(ljob, "DOSED", "LOAD");
				ljob.SENSOR_CONTROL = 1;
				break;
			case 1:
				logtemp = jobjcopy(logexample);

				//TM
				readautoloopdata(logtemp, 'TM', ljob.CHKLOOP.CHKVALUE.autotmloop);
				logtemp.TM.INSTCODEALL = readchkloopdata("INSTCODEALL", ljob.CHKLOOP.CHKVALUE.autotmloop);

				logtemp.TM.H002 = readdata(ljob.CHKLOOP.CHKVALUE.DEVH002, "TEMPERATURE", "A1");
				logtemp.TM.H004 = readdata(ljob.CHKLOOP.CHKVALUE.DEVH004, "TEMPERATURE", "A1");
				logtemp.TM.H005 = readdata(ljob.CHKLOOP.CHKVALUE.DEVH005, "TEMPERATURE", "A1");
				logtemp.TM.E002 = readdata(ljob.CHKLOOP.CHKVALUE.DEVE002, "TEMPERATURE", "A1");
				logtemp.TM.LEDSAW = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVA032, "LED", "22");
				logtemp.TM.LEDSAR = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVA032, "LED", "21");
				logtemp.TM.LEDSBW = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVA03A, "LED", "22");
				logtemp.TM.LEDSBR = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVA03A, "LED", "21");
				logtemp.TM.LEDAW = readdata(ljob.CHKLOOP.CHKVALUE.DEVA032, "LED", "22");
				logtemp.TM.LEDAR = readdata(ljob.CHKLOOP.CHKVALUE.DEVA032, "LED", "21");
				logtemp.TM.LEDBW = readdata(ljob.CHKLOOP.CHKVALUE.DEVA03A, "LED", "22");
				logtemp.TM.LEDBR = readdata(ljob.CHKLOOP.CHKVALUE.DEVA03A, "LED", "21");
				logtemp.TM.FAN1 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "58");
				logtemp.TM.FAN2 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "57");
				logtemp.TM.FAN3 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "56");
				logtemp.TM.FAN4 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "55");
				logtemp.TM.AIR = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVC00A, "AIRFAN", "31");
				logtemp.TM.COOL = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "64");
				logtemp.TM.HOT = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "65");
				logtemp.TM.H010 = readdata(ljob.CHKLOOP.CHKVALUE.DEVH010, "TEMPERATURE", "A1");
				logtemp.TM.H011 = readdata(ljob.CHKLOOP.CHKVALUE.DEVH011, "TEMPERATURE", "A1");

				//PUMP
				readautoloopdata(logtemp, 'PUMP', ljob.CHKLOOP.CHKVALUE.autopumpmotoloop);

				logtemp.PUMP.CWLEVEL = readdata(ljob.CHKLOOP.CHKVALUE.DEVE002, "WATERLEVEL", "76");
				logtemp.PUMP.FWLEVEL = readdata(ljob.CHKLOOP.CHKVALUE.DEVE002, "WATERLEVEL", "77");
				logtemp.PUMP.CWPUMP = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "4D");
				logtemp.PUMP.FWPUMP = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "4F");
				logtemp.PUMP.CFA1 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "42");
				logtemp.PUMP.FPA1 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "41");
				logtemp.PUMP.CFA2 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "44");
				logtemp.PUMP.FPA2 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "43");
				logtemp.PUMP.CFA3 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "46");
				logtemp.PUMP.FPA3 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "45");
				logtemp.PUMP.CFB1 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "48");
				logtemp.PUMP.FPB1 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "47");
				logtemp.PUMP.CFB2 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "4A");
				logtemp.PUMP.FPB2 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "49");
				logtemp.PUMP.CFB3 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "4C");
				logtemp.PUMP.FPB3 = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE003, "PUMP", "4B");

				//WATER
				readautoloopdata(logtemp, 'WATER', ljob.CHKLOOP.CHKVALUE.BOX2LOOP);
				logtemp.WATER.CWLEVEL = readdata(ljob.CHKLOOP.CHKVALUE.DEVE002, "WATERLEVEL", "76");
				logtemp.WATER.FWLEVEL = readdata(ljob.CHKLOOP.CHKVALUE.DEVE002, "WATERLEVEL", "77");

				//ECPH
				readautoloopdata(logtemp, 'ECPH', ljob.CHKLOOP.CHKVALUE.ECDOSELOOP);
				logtemp.ECPH.PUMP = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "43");
				logtemp.ECPH.TWA = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "49");
				logtemp.ECPH.CWLEVEL = readdata(ljob.CHKLOOP.CHKVALUE.DEVE002, "WATERLEVEL", "76");
				logtemp.ECPH.FWLEVEL = readdata(ljob.CHKLOOP.CHKVALUE.DEVE002, "WATERLEVEL", "77");

				//DOSE
				logtemp.DOSE.STATU = readtmscstatu(ljob.CHKLOOP.CHKVALUE.DOSE);
				logtemp.DOSE.STATUA = readtmscstatu(ljob.CHKLOOP.CHKVALUE.DOSEA);
				logtemp.DOSE.STATUB = readtmscstatu(ljob.CHKLOOP.CHKVALUE.DOSEB);
				logtemp.DOSE.STATUC = readtmscstatu(ljob.CHKLOOP.CHKVALUE.DOSEC);
				logtemp.DOSE.STATUD = readtmscstatu(ljob.CHKLOOP.CHKVALUE.DOSED);
				logtemp.DOSE.PUMPA = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "44");
				logtemp.DOSE.PUMPB = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "45");
				logtemp.DOSE.PUMPC = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "46");
				logtemp.DOSE.PUMPD = readdatasub(ljob.CHKLOOP.CHKVALUE.DEVE002, "PUMP", "61");


				//save log
				redisfunc.client.hset(setuuid, gettimestring(), JSON.stringify(logtemp));
				ljob.SENSOR_CONTROL = 0;
				break;
			default:
				break;
		}
	}
}
function runloop(keyname) {
	if (loopdata.LOOP[keyname].STATU == 1) {
		_runloop[keyname](loopdata.LOOP[keyname]);
	}
}
event.on('runloop_event', function () {
	for (jj in loopdata.LOOP) {
		console.log("loop[" + jj + "] =" + loopdata.LOOP[jj].STATU);
		switch (jj) {
			case "LINKDATA":
				runloop("LINKDATA");
				break;
			default:
				break;
		}
	}
});

exports.sysload = sysload;
exports.setuuid = setuuid;
exports.eventcall = eventcall;
