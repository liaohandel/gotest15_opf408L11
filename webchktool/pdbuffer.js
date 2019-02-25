
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();

var path = require('path');
var fs = require('fs');
var os = require('os');

var htmlio = require('./htmlio.js');

var ch1com = require('./utx.js');
var setuuid = '1234567890abcdefghijk';

//=== PDDATA.txt to pdjobj
var filename = "PDDATA.txt";
var filepath = path.join(__dirname, ("../public/" + filename));
var xpdjobj = {}; //pd buffer 

//=== syspub function ===
function jobjcopy(jobj) {
	return JSON.parse(JSON.stringify(jobj));
}

function eventcall(callmask) {
	event.emit(callmask);
}
function paddingLeft(str, lenght) {
	str += '';
	if (str.length >= lenght)
		return str;
	else
		return paddingLeft("0" + str, lenght);
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

var subcmdname = {
	0: "OFF",
	1: "ON",
	2: "LOAD",
	3: "AUTO",
	4: "SET",
	5: "LOW",
	6: "HI",
	7: "ALARM",
	8: "MODELOOP",
	9: "MODETRIG"
};


function devloadtobuff(bufdata) {
	let devadd = bufdata.substring(2, 4);
	let devdatalen = Number('0x' + bufdata.substring(4, 6));
	let devsubcmd = Number('0x' + bufdata.substring(8, 10));
	let devreg = bufdata.substring(10, 12);
	let devdata = bufdata.substring(10, (devdatalen + 2) * 2);
	let devname = xpdjobj.addposmap[devadd];
	let devsubcmdname = subcmdname[devsubcmd];
	let devsubname;
	let devregnum = Number('0x' + devreg);
	if ((devregnum >= 0x41 && devregnum <= 0x68) || devregnum == 0x9C) {
		devsubname = 'PUMP';
	} else if (devregnum >= 0x00 && devregnum <= 0x02) {
		devsubname = 'PUMP';
		devreg = '00';
	} else if (devregnum >= 0x71 && devregnum <= 0x77) {
		devsubname = 'WATERLEVEL';
	} else if (devregnum == 0xA1) {
		devsubname = 'TEMPERATURE';
	} else if (devregnum == 0x92) {
		devsubname = 'RH';
	} else if (devregnum == 0x91) {
		devsubname = 'CO2';
	} else if (devregnum == 0x94) {
		devsubname = 'ELECTRONS';
	} else if (devregnum == 0x93) {
		devsubname = 'PH';
	} else if (devregnum == 0x22 || devregnum == 0x21) {
		devsubname = 'LED';
	} else if (devregnum == 0x31) {
		devsubname = 'AIRFAN';
	} else {
		devsubname = 'MACADD';
	}
	let devsubadd = xpdjobj.CMDDATA[devsubname][0];

	let ttbuf = Buffer.from("fa0006000200000000", 'hex');
	ttbuf[1] = Number('0x' + devadd);
	ttbuf[5] = Number('0x' + devreg);

	let stu;

	let obj = { "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "000000", "GROUP": "00" };
	obj.CMD = devsubname;
	obj.POS = devname;
	obj.STU = devdata;


	if (typeof devname != "undefined" &&
		devsubadd in xpdjobj.PDDATA.Devtab[devname] &&
		devreg in xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab) {
		switch (devsubname) {
			case 'PUMP':
				xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].sub = devsubcmd;
				xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].stu = devdata;

				obj.Action = devsubcmdname;
				htmlio.html.printall(obj);

				ttbuf[4] = 0x02;
				break;
			case 'WATERLEVEL':
				ttbuf[4] = 0x02;

				stu = xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].stu;
				stu += '';
				if (stu.length < 6) {
					stu = paddingLeft(stu, 4);
					stu = devreg + stu;
					stu = stu.substr(0, 6);
				}

				ttbuf[6] = Number('0x' + stu.substring(2, 4));
				ttbuf[7] = Number('0x' + stu.substring(4, 6));
				break;
			case 'TEMPERATURE':
				ttbuf[4] = 0x02;

				stu = xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].stu;
				stu += '';
				if (stu.length < 6) {
					stu = paddingLeft(stu, 4);
					stu = devreg + stu;
					stu = stu.substr(0, 6);
				}

				ttbuf[6] = Number('0x' + stu.substring(2, 4));
				ttbuf[7] = Number('0x' + stu.substring(4, 6));
				break;
			case 'RH':
				ttbuf[4] = 0x02;

				stu = xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].stu;
				stu += '';
				if (stu.length < 6) {
					stu = paddingLeft(stu, 4);
					stu = devreg + stu;
					stu = stu.substr(0, 6);
				}

				ttbuf[6] = Number('0x' + stu.substring(2, 4));
				ttbuf[7] = Number('0x' + stu.substring(4, 6));
				break;
			case 'CO2':
				ttbuf[4] = 0x02;

				stu = xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].stu;
				stu += '';
				if (stu.length < 6) {
					stu = paddingLeft(stu, 4);
					stu = devreg + stu;
					stu = stu.substr(0, 6);
				}

				ttbuf[6] = Number('0x' + stu.substring(2, 4));
				ttbuf[7] = Number('0x' + stu.substring(4, 6));
				break;
			case 'ELECTRONS':
				ttbuf[4] = 0x02;

				stu = xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].stu;
				stu += '';
				if (stu.length < 6) {
					stu = paddingLeft(stu, 4);
					stu = devreg + stu;
					stu = stu.substr(0, 6);
				}

				ttbuf[6] = Number('0x' + stu.substring(2, 4));
				ttbuf[7] = Number('0x' + stu.substring(4, 6));
				break;
			case 'PH':
				ttbuf[4] = 0x02;

				stu = xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].stu;
				stu += '';
				if (stu.length < 6) {
					stu = paddingLeft(stu, 4);
					stu = devreg + stu;
					stu = stu.substr(0, 6);
				}

				ttbuf[6] = Number('0x' + stu.substring(2, 4));
				ttbuf[7] = Number('0x' + stu.substring(4, 6));
				break;
			case 'LED':
				xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].sub = devsubcmd;
				xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].stu = devdata;

				obj.Action = devsubcmdname;
				htmlio.html.printall(obj);

				ttbuf[4] = 0x02;
				break;
			case 'AIRFAN':
				xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].sub = devsubcmd;
				xpdjobj.PDDATA.Devtab[devname][devsubadd].chtab[devreg].stu = devdata;

				obj.Action = devsubcmdname;
				htmlio.html.printall(obj);

				ttbuf[4] = 0x02;
				break;
			default:
				ttbuf[4] = 0x52;
				break;
		}
	} else {
		ttbuf[4] = 0x52;
	}
	totxbuff(ttbuf);
}
event.on('rxbuff_event', function () { //####
	if (ch1com.rxdatabuffer.length > 0) {
		ch1com.rxtopacket();
		while (ch1com.rxdatabuffer.length > 1) {
			ch1com.rxtopacket();
		}
	}

	while (ch1com.qrxcmd.length > 0) {
		if (ch1com.qrxcmd.length > 0) {
			ssbuf = ch1com.qrxcmdshift();
			ss = ssbuf.toUpperCase();
			console.log("<<< show cmd rx[" + ch1com.qrxcmd.length + "]:" + ss)
			devloadtobuff(ss);
		}
	}
});

function totxbuff(ttbuf) {
	let scmd = ttbuf.toString('hex')
	setTimeout(function () {
		event.emit('txbuff_event', scmd);
	}, 50);
}

event.on('txbuff_event', function (scmd) {
	ch1com.qqsendcmd(scmd, function () {
	});
});

let swreg = [
	{
		"obj": { "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "9C0000", "GROUP": "00" },
		"auto": [
			{ "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "4D0000", "GROUP": "00" }
		]
	}, {
		"obj": { "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "440000", "GROUP": "00" },
		"auto": [
			{ "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "440000", "GROUP": "00" }
		]
	}, {
		"obj": { "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "450000", "GROUP": "00" },
		"auto": [
			{ "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "450000", "GROUP": "00" }
		]
	}, {
		"obj": { "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "460000", "GROUP": "00" },
		"auto": [
			{ "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "460000", "GROUP": "00" }
		]
	}, {
		"obj": { "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "610000", "GROUP": "00" },
		"auto": [
			{ "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "610000", "GROUP": "00" }
		]
	}
];
let swreglen = swreg.length;

function runswreg(sw, now) {
	let data = sw.obj;
	let cmd = data.CMD;
	let pos = data.POS;
	let subcmd = data.Action;
	let stu = data.STU;
	let subkey = stu.substr(0, 2);
	let group = data.GROUP;
	let cmdkey = xpdjobj.CMDDATA[cmd][0];
	let dtime = (now - sw.time) / 1000;
	subcmd = subcmdname[xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].sub];
	if (subcmd == 'ON') {
		sw.subcmd = 'ON';
		stu = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
		stu = paddingLeft(stu, 6);
		if (stu.length == 10) {
			let ontime = Number('0x' + stu.substr(2, 4));
			let offtime = Number('0x' + stu.substr(6, 4));
			if (dtime < ontime) {
				if (sw.Action != 'ON') {
					sw.Action = 'ON';
					for (let i = 0; i < sw.auto.length; i++) {
						let obj = jobjcopy(sw.auto[i]);
						obj.Action = 'ON';
						htmlio.html.printall(obj);
					}
				}
			} else if (dtime >= ontime && dtime < ontime + offtime) {
				if (sw.Action != 'OFF') {
					sw.Action = 'OFF';
					for (let i = 0; i < sw.auto.length; i++) {
						let obj = jobjcopy(sw.auto[i]);
						obj.Action = 'OFF';
						htmlio.html.printall(obj);
					}
				}
			} else if (dtime >= ontime + offtime) {
				sw.time = now - (dtime - (ontime + offtime));
				if (sw.Action != 'ON') {
					sw.Action = 'ON';
					for (let i = 0; i < sw.auto.length; i++) {
						let obj = jobjcopy(sw.auto[i]);
						obj.Action = 'ON';
						htmlio.html.printall(obj);
					}
				}
			}
		} else {
			let ontime = Number('0x' + stu.substr(2, 4));
			if (dtime < ontime) {
				if (sw.Action != 'ON') {
					sw.Action = 'ON';
					for (let i = 0; i < sw.auto.length; i++) {
						let obj = jobjcopy(sw.auto[i]);
						obj.Action = 'ON';
						htmlio.html.printall(obj);
					}
				}
			} else if (dtime >= ontime) {
				if (sw.Action != 'OFF') {
					sw.Action = 'OFF';
					for (let i = 0; i < sw.auto.length; i++) {
						let obj = jobjcopy(sw.auto[i]);
						obj.Action = 'OFF';
						htmlio.html.printall(obj);
					}

					xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].sub = xpdjobj.subcmd['OFF'];
					sw.subcmd = 'OFF';
				}
			}
		}
	} else {
		sw.time = now;
		if (sw.subcmd != 'OFF') {
			sw.subcmd = 'OFF';
			for (let i = 0; i < sw.auto.length; i++) {
				let obj = jobjcopy(sw.auto[i]);
				obj.Action = 'OFF';
				htmlio.html.printall(obj);
			}
		}
	}
}

function initswreg() {
	let now = Date.now();
	for (let i = 0; i < swreglen; i++) {
		swreg[i].time = now;
	}
}

event.on('swreg_event', function () {
	let now = Date.now();
	for (let i = 0; i < swreglen; i++) {
		runswreg(swreg[i], now);
	}
});

htmlio.html.scan = function (data, socketid) {
	let cmd = data.CMD;
	let pos = data.POS;
	let subcmd = data.Action;
	let stu = data.STU;
	let subkey = stu.substr(0, 2);
	let group = data.GROUP;
	let cmdkey;
	if (cmd != 'UUID') {
		if (!(pos in xpdjobj.PDDATA.Devtab)) return;
	}
	if (!(subcmd in xpdjobj.subcmd)) return;
	if (cmd != 'TRIGGER' && cmd != 'UUID') {
		if (!(cmd in xpdjobj.CMDDATA)) return;
		cmdkey = xpdjobj.CMDDATA[cmd][0];
		if (!(cmdkey in xpdjobj.PDDATA.Devtab[pos])) return;

		if (!(subkey in xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab)) return;
	}

	let obj = { "CMD": "PUMP", "POS": "E002", "Action": "OFF", "STU": "000000", "GROUP": "00" };
	obj.CMD = cmd;
	obj.POS = pos;

	switch (cmd) {
		case 'PUMP':
			if (subcmd == 'LOAD') {
				obj.Action = subcmdname[xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].sub];

				let temp = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
				temp += '';
				if (temp.length < 6) {
					temp = paddingLeft(temp, 4);
					temp = subkey + temp;
					temp = temp.substr(0, 6);
				}
				obj.STU = temp;

				htmlio.html.print(obj, socketid);
			}
			break;
		case 'WATERLEVEL':
			if (subcmd == 'SET') {
				xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu = stu;
				htmlio.html.printall(data);
			} else if (subcmd == 'LOAD') {
				obj.Action = 'SET';

				let temp = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
				temp += '';
				if (temp.length < 6) {
					temp = paddingLeft(temp, 4);
					temp = subkey + temp;
					temp = temp.substr(0, 6);
				}
				obj.STU = temp;

				htmlio.html.print(obj, socketid);
			}
			break;
		case 'TEMPERATURE':
			if (subcmd == 'SET') {
				xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu = stu;
				htmlio.html.printall(data);
			} else if (subcmd == 'LOAD') {
				obj.Action = 'SET';

				let temp = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
				temp += '';
				if (temp.length < 6) {
					temp = paddingLeft(temp, 4);
					temp = subkey + temp;
					temp = temp.substr(0, 6);
				}
				obj.STU = temp;

				htmlio.html.print(obj, socketid);
			}
			break;
		case 'RH':
			if (subcmd == 'SET') {
				xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu = stu;
				htmlio.html.printall(data);
			} else if (subcmd == 'LOAD') {
				obj.Action = 'SET';

				let temp = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
				temp += '';
				if (temp.length < 6) {
					temp = paddingLeft(temp, 4);
					temp = subkey + temp;
					temp = temp.substr(0, 6);
				}
				obj.STU = temp;

				htmlio.html.print(obj, socketid);
			}
			break;
		case 'CO2':
			if (subcmd == 'SET') {
				xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu = stu;
				htmlio.html.printall(data);
			} else if (subcmd == 'LOAD') {
				obj.Action = 'SET';

				let temp = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
				temp += '';
				if (temp.length < 6) {
					temp = paddingLeft(temp, 4);
					temp = subkey + temp;
					temp = temp.substr(0, 6);
				}
				obj.STU = temp;

				htmlio.html.print(obj, socketid);
			}
			break;
		case 'ELECTRONS':
			if (subcmd == 'SET') {
				xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu = stu;
				htmlio.html.printall(data);
			} else if (subcmd == 'LOAD') {
				obj.Action = 'SET';

				let temp = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
				temp += '';
				if (temp.length < 6) {
					temp = paddingLeft(temp, 4);
					temp = subkey + temp;
					temp = temp.substr(0, 6);
				}
				obj.STU = temp;

				htmlio.html.print(obj, socketid);
			}
			break;
		case 'PH':
			if (subcmd == 'SET') {
				xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu = stu;
				htmlio.html.printall(data);
			} else if (subcmd == 'LOAD') {
				obj.Action = 'SET';

				let temp = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
				temp += '';
				if (temp.length < 6) {
					temp = paddingLeft(temp, 4);
					temp = subkey + temp;
					temp = temp.substr(0, 6);
				}
				obj.STU = temp;

				htmlio.html.print(obj, socketid);
			}
			break;
		case 'LED':
			if (subcmd == 'LOAD') {
				obj.Action = subcmdname[xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].sub];

				let temp = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
				temp += '';
				if (temp.length < 6) {
					temp = paddingLeft(temp, 4);
					temp = subkey + temp;
					temp = temp.substr(0, 6);
				}
				obj.STU = temp;

				htmlio.html.print(obj, socketid);
			}
			break;
		case 'AIRFAN':
			if (subcmd == 'LOAD') {
				obj.Action = subcmdname[xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].sub];

				let temp = xpdjobj.PDDATA.Devtab[pos][cmdkey].chtab[subkey].stu;
				temp += '';
				if (temp.length < 6) {
					temp = paddingLeft(temp, 4);
					temp = subkey + temp;
					temp = temp.substr(0, 6);
				}
				obj.STU = temp;

				htmlio.html.print(obj, socketid);
			}
			break;
		case 'TRIGGER':
			if (subcmd == 'ALARM') {
				let ttbuf = Buffer.from("fa0006000200000000", 'hex');
				ttbuf[0] = 0xfc;

				ttbuf[1] = xpdjobj.PDDATA.Devtab[pos].STATU.devadd;
				ttbuf[5] = Number('0x' + subkey);

				ttbuf[4] = 0x07;
				ttbuf[6] = Number('0x' + stu.substr(2, 2));
				ttbuf[7] = Number('0x' + stu.substr(4, 2));
				totxbuff(ttbuf);
			}
			break;
		case 'UUID':
			if (subcmd == 'SET') {
				xpdjobj.PDDATA.UUID = stu;
				obj.Action = 'SET';
				obj.STU = xpdjobj.PDDATA.UUID;
				htmlio.html.printall(obj);
			} else if (subcmd == 'LOAD') {
				obj.Action = 'SET';
				obj.STU = xpdjobj.PDDATA.UUID;
				htmlio.html.print(obj, socketid);
			}
			break;
		default:
			break;
	}
}


exports.eventcall = eventcall;

exports.sysload = sysload;
exports.initswreg = initswreg;