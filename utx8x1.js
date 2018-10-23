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
var rx_size =64;
var tx_size =64;
var rx_pt =0;
var tx_pt =0;
var rx_buf = new Buffer(rx_size);
var tx_buf = new Buffer(tx_size);
var qrxcmd =[];
var qtxcmd =[];

var comflag = 0;
var txokflag = 0;
global.rxokflag = false;

var aqrxcmd =[];
global.arxokflag = false;

var sp = new SerialPort(portName, {
  baudRate: 19200,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
});


function rxchk(rbuf){
	console.log("check rxbuff ...x1! ",rx_pt,rx_size)
	if(rx_pt<=rx_size && rbuf.length>0){
		console.log("check rxbuff ...x2! ",rx_pt,rx_size)
		//reload 0xfc and 0xfa command 
		if(rx_pt>0 && ( rx_buf[0]==0xfa || rx_buf[0]==0xfc ) ){
			rbuf.copy(rx_buf,rx_pt,0)
			rx_pt = rx_pt + rbuf.length
			console.log("check rxbuff ...x21! ",rx_pt,rx_size)
			console.log(rx_buf.toString('hex'))
		}else{			
			console.log("check rxbuff ...x22! ",rx_pt,rx_size)
			for(i=0;i<rbuf.length;i++){
				if(rbuf[i]==0xfa || rbuf[i]==0xfc ){
					rbuf.copy(rx_buf,0,i,rbuf.length)
					rx_pt = rx_pt + rbuf.length - i
					break;
				}
			}
		}
	}else{
		console.log("overbuff =["+rbuf.toString('hex')+"]");
	}
	//check rx_buff format [0xfa],[add],[pam_leng],[dat]x(pamleng)
	if((rx_buf[0]==0xfa||rx_buf[0]==0xfc ) && rx_pt >3 ){
		console.log("check rxbuff ...x3! ",rx_pt,rx_size)
		if(rx_pt > (rx_buf[2]+2)){
			console.log("check rxbuff ...x31! ",rx_pt,rx_size)			
			sbuf = new Buffer(rx_buf[2]+3);
			rx_buf.copy(sbuf,0,0,rx_buf[2]+3);
			//if(sbuf[0]==0xfc){
			//	global.arxokflag = true;
			//	console.log('rxcommx0 ='+sbuf.toString('hex'));//rxcomm
			//}			
			if(sbuf[0]==0xfc){
				aqrxcmd.push(sbuf.toString('hex'));
				rx_pt = 0;
				global.arxokflag = true;
				console.log('rxcommx1 ='+sbuf.toString('hex'));//rxcomm
			}else{		
				qrxcmd.push(sbuf.toString('hex'));
				rx_pt = 0;
				global.rxokflag = true;
				console.log('rxcommx2 ='+sbuf.toString('hex'));
				//send next tx command event
				event.emit('stsend');
			}
		}		
	};	
	
}

function qqsendcmd(txcmd,callback){
	console.log("txbuff lengx2 = "+qtxcmd.length)
	qtxcmd.push(txcmd);
	event.emit('stsend');
	callback();
}

function qrxcmdshift(){
	if(qrxcmd.length > 0){
		return qrxcmd.shift();
	}else{
		return null;
	}
}

function qrxcmdclear(){
	qrxcmd=[]
}

function aqrxcmdshift(){
	if(aqrxcmd.length > 0){
		return aqrxcmd.shift();
	}else{
		return null;
	}
}
event.on('stsend', function() {
	console.log("txbuff lengx1 = "+qtxcmd.length)
	if(qtxcmd.length >0){
		ss = qtxcmd.shift()
		console.log("tx:"+ss);
		ttbuf = Buffer.from(ss,'hex');
		//ttbuf[0] = 0xf5
		sp.write(ttbuf);
		//sim rx event
		//rxss = ss;		
		//event.emit('strxok');			
	}	
});


sp.on('data', function (data) {
    console.log(data);
    sdata = data.toString();
	rxchk(data)
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
	//comflag = 1;
	//ttbuf = Buffer.from("f521025050",'hex');
	//sp.write(ttbuf);
});

sp.write(mbBuffer, function (err, bytesWritten) {
	console.log('bytes written:', bytesWritten);
});

//sp.open();

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

