console.log("[linkgateway utx6x1] start RS485 ch1  ...");

var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();

var SerialPort = require('serialport');

/**
* Serial Port Setup.
*/

var portName = '/dev/ttyUSB0'; //This is the standard Raspberry Pi Serial port
var readData = ''; //Array to hold the values read in from the port
var mbBuffer = '1231';

var rxcount = 0;
var rx_size = 64;
var tx_size = 64;
var rx_pt = 0;
var tx_pt = 0;
var rx_buf = new Buffer.alloc(rx_size);
var tx_buf = new Buffer.alloc(tx_size);
var qrxcmd = [];
var qtxcmd = [];

var rxdatabuffer = [];

var comflag = 0;
var txokflag = 0;
global.rxokflag = false;

var aqrxcmd = [];
global.arxokflag = false;

var sp = new SerialPort(portName, {
	baudRate: 115200,
	dataBits: 8,
	parity: 'none',
	stopBits: 1,
	flowControl: false
});

function rxchk(rbuf) {
	console.log('rx data = ' + JSON.stringify(rbuf));
	console.log("check rxbuff ...x1! ", rx_pt, rx_size, rx_buf[0])
	if (rx_pt <= rx_size && rbuf.length > 0) {
		//console.log("check rxbuff ...x2! ",rx_pt,rx_size)
		//reload 0xfc and 0xfa command 
		if (rx_pt > 0 && (rx_buf[0] == 0xf5)) {
			rbuf.copy(rx_buf, rx_pt, 0)
			rx_pt = rx_pt + rbuf.length
			//console.log("check rxbuff ...x21! ",rx_pt,rx_size)
			//console.log(rx_buf.toString('hex'))
		} else {
			//console.log("check rxbuff ...x22! ",rx_pt,rx_size)
			for (i = 0; i < rbuf.length; i++) {
				if (rbuf[i] == 0xf5) {
					rbuf.copy(rx_buf, 0, i, rbuf.length)
					rx_pt = rx_pt + rbuf.length - i
					break;
				}
			}
		}
	} else {
		console.log("overbuff =[" + rbuf.toString('hex') + "]");
		rx_pt = 0;
		for (i = 0; i < rbuf.length; i++) {
			if (rbuf[i] == 0xf5) {
				rbuf.copy(rx_buf, 0, i, rbuf.length)
				rx_pt = rx_pt + rbuf.length - i
				break;
			}
		}
	}
	//check rx_buff format [0xfa],[add],[pam_leng],[dat]x(pamleng)
	if ((rx_buf[0] == 0xf5) && rx_pt > 3) {
		console.log("check rxbuff ...x3! ", rx_pt, rx_size)
		if (rx_pt > (rx_buf[2] + 2)) {
			//console.log("check rxbuff ...x31! ",rx_pt,rx_size)			
			sbuf = new Buffer.alloc(rx_buf[2] + 3);
			rx_buf.copy(sbuf, 0, 0, rx_buf[2] + 3);
			qrxcmd.push(sbuf.toString('hex'));
			rx_pt = 0;
			global.rxokflag = true;
			console.log('rxcommx2 =' + sbuf.toString('hex'));
			//send next tx command event
			event.emit('stsend');
		}
	} else {
		if (rx_pt <= 3) return;
		console.log("check rxbuff ...x32! ", rx_pt, rx_size, rx_buf[0]);
		rx_pt = 0;
	}

}

function qqsendcmd(txcmd, callback) {
	//console.log("txbuff lengx2 = "+qtxcmd.length)
	qtxcmd.push(txcmd);
	event.emit('stsend');
	callback();
}

function qrxcmdshift() {
	if (qrxcmd.length > 0) {
		return qrxcmd.shift();
	} else {
		return null;
	}
}

function qrxcmdclear() {
	qrxcmd = []
}

function aqrxcmdshift() {
	if (aqrxcmd.length > 0) {
		return aqrxcmd.shift();
	} else {
		return null;
	}
}
event.on('stsend', function () {
	console.log("txbuff lengx1 = " + qtxcmd.length)
	if (qtxcmd.length > 0) {
		ss = qtxcmd.shift()
		console.log("tx:" + ss);
		ttbuf = Buffer.from(ss, 'hex');
		sp.write(ttbuf);
	}
});

function rxtopacket() {
	let sdata = '';
	let sdata2 = '';
	let sdata3 = '';
	let data = {};
	let dlen = 0;
	let len = 0;
	if (rxdatabuffer.length <= 0) return;

	sdata = rxdatabuffer.shift();
	data = Buffer.from(sdata, 'hex');

	if (data[0] != 0xf5) return;

	dlen = data.length;

	if (dlen <= 3) {
		if (rxdatabuffer.length <= 0) {
			rxdatabuffer.unshift(sdata);
		} else {
			sdata2 = rxdatabuffer.shift();
			rxdatabuffer.unshift(sdata + sdata2);
		}
		return;
	}
	len = data[2] + 3;
	if (dlen < len) {
		if (rxdatals.length <= 0) {
			rxdatabuffer.unshift(sdata);
		} else {
			sdata2 = rxdatabuffer.shift();
			rxdatabuffer.unshift(sdata + sdata2);
		}
		return;
	}
	if (dlen > len) {
		sdata3 = data.slice(len).toString('hex');
		if (rxdatabuffer.length <= 0) {
			rxdatabuffer.unshift(sdata3);
		} else {
			sdata2 = rxdatabuffer.shift();
			rxdatabuffer.unshift(sdata3 + sdata2);
		}
	}
	qrxcmd.push(data.slice(0, len).toString('hex'));
}

sp.on('data', function (data) {
	let sdata = data.toString('hex');
	console.log('uart rx = ' + sdata);
	rxdatabuffer.push(sdata);
	// rxchk(data)
	//console.log("=>"+rxcount); 
	//rxcount++;
});

sp.on('close', function (err) {
	console.log('port closed');
});

sp.on('error', function (err) {
	console.error("error", err);
});

sp.on('open', function () {
	console.log('port1 opened...');
});

// sp.write(mbBuffer, function (err, bytesWritten) {
// 	console.log('bytes written:', bytesWritten);
// });

//rs485 uart function 
exports.comflag = comflag
exports.qrxcmd = qrxcmd;
exports.trxcmd = qtxcmd;


exports.sp = sp
exports.qqsendcmd = qqsendcmd
exports.qrxcmdshift = qrxcmdshift
exports.qrxcmdclear = qrxcmdclear


exports.txokflag = txokflag
exports.rxokflag = rxokflag

exports.aqrxcmd = aqrxcmd;
exports.arxokflag = arxokflag
exports.aqrxcmdshift = aqrxcmdshift

exports.rxdatabuffer = rxdatabuffer
exports.rxtopacket = rxtopacket