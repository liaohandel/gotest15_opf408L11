console.log("pdbuff v2.0 20180516 ... XD");

var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter(); 

global.weblinkflag = 0;
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
var ipccargs = {
    requestConfig: {
        timeout: 500,
        noDelay: true,
        keepAlive: true
    },
    responseConfig: {
        timeout: 1000 //response timeout 
    }
};

var path = require('path');
var fs = require('fs');
var os = require('os');

var util = require('util');

//=== UART comport module 
//var ch1com = require('./utx7xipccom0')// IPC com port 0 RS232
//var ch1com = require('./utx7xipccom1')// IPC com port 1 RS232
var ch1com = require('./utx7x1')// rec oxfa and 0xfc command 
//var ch1com = require('./utx5x2')
//var ch3com = require('./utx5x3')
//var ch4com = require('./utx5x4')

//=== web server link url ===
var ddsnurl = "http://106.104.112.56/Cloud/API/linkbox.php"
var vdsnurl = "http://106.104.112.56/Cloud/API/videobox.php"
var devloadurl = "http://106.104.112.56/Cloud/API/DeviceUpdate.php"
var typeloadurl = "http://106.104.112.56/Cloud/API/TypeUpdate.php" //
var typechannelurl = "http://106.104.112.56/Cloud/API/TypeChannelsUpdate.php"

var dev85statusurl="http://106.104.112.56/Cloud/API/DeviceStatus.php"
var dev105statusurl="http://106.104.112.56/Cloud/API/ContainerStatus.php"

var offdev85statusurl="http://192.168.5.220/API/DeviceStatus.php"
var offdev105statusurl="http://192.168.5.220/API/ContainerStatus.php"
var offdevloadurl = "http://192.168.5.220/API/DeviceUpdate.php"
var offtypeloadurl = "http://192.168.5.220/API/TypeUpdate.php"
var offtypechannelurl = "http://192.168.5.220/API/TypeChannelsUpdate.php"

var setdeviceip = 'https://c4915760.ngrok.io'
var setdeviceport = '0000'
var setuuid = '1234567890abcdefghijk'
//var activekeyurl = "http://106.104.112.56/Cloud/API/DeviceStatus.php"
var linkoffmode = 1;

var setddsnurl = ddsnurl+'?DeviceIP='+setdeviceip+'&UUID='+setuuid
var setvdsnurl = ddsnurl+'?DeviceIP='+setdeviceip+'&DevicePOS='+setdeviceport+'&UUID='+setuuid
var setdevouturl = devloadurl+"?UUID="+setuuid+"&result="+"{}"

//=== POS RS422 command lib
var cmdcode = require("./handelrs485x3.js");

//載入redis自製模板
var redisfunc = require("./redisfunc.js");
var autocmd = require('./autocmd_gx8.js');

//=== PDDATA.txt to pdjobj
var filename = "PDDATA3.txt"
var filepath = path.join(__dirname, ("/public/" + filename));
var xpdjobj ={} //pd buffer 

//=== treescan.txt to jtreescan
var filename_treescan = "treescan.txt"
var filepath_treescan = path.join(__dirname, ("/public/" + filename_treescan));
var jtreescan = {} //treescan buffer 
//global.jtreescan = {} //treescan buffer 

//=== treedata.txt to jtreedata
var filename_treedate = "treedata.txt"
var filepath_treedata = path.join(__dirname, ("/public/" + filename_treedate));
var jtreedata = {} //tree upload buffer
//global.jtreedata = {} //tree upload buffer

//=== JAUTOCMD.txt to jautocmd === 
var filename_jautocmd = "JAUTOCMD.txt"
var filepath_jautocmd = path.join(__dirname, ("/public/" + filename_jautocmd));
var jautocmd = {} //tree upload buffer

//=== KEYPD.txt to jkeypd ===
var filename_keypd = "KEYPD.txt"
var filepath_keypd = path.join(__dirname, ("/public/" + filename_keypd));
var jkeypd = {} //tree upload buffer
var keypadpushbuffer =[];

var tx_timeout_chk = false;

var keycomm=["OFF","ON","AUTO","HI","LOW","SET","LOAD"];
//=== syspub function ===
function jobjcopy(jobj){
	return JSON.parse(JSON.stringify(jobj));	
}

function eventcall(callmask){
	event.emit(callmask);
}

//===================================
function sysload(callback){	
    fs.readFile(filepath, function(err, content) {
		if(err){throw err;}
		
        //res.writeHead(200, { 'Content-Type': 'text/plain' });
        let uuiddata = content.toString();
        //let jobj = JSON.parse(uuiddata);
		xpdjobj= JSON.parse(uuiddata);
		
        //var jpam = jobj[0];
        //console.log(" txt find ok ! ... \n", uuiddata);
        //console.log("uuids = ", jobj.uuid);
        //console.log("dsnurl = ", jobj.dsnurl);
        //console.log("uuids = ", pdjobj.PDDATA.UUID);
        //console.log("dsnurl = ", pdjobj.PDDATA.dsnurl);
        //console.log("videodsnurl = ", pdjobj.PDDATA.videodsnurl);//devloadur
        //console.log("devloadur = ", pdjobj.PDDATA.devloadur);
		
        ddsnurl = xpdjobj.PDDATA.dsnurl;
        vdsnurl = xpdjobj.PDDATA.videodsnurl;
		devloadurl =  xpdjobj.PDDATA.devloadurl;		
		typeloadurl = xpdjobj.PDDATA.typeloadurl;
		typechannelurl = xpdjobj.PDDATA.typechannelurl;
		
        setuuid =  xpdjobj.PDDATA.UUID;
		
		dev85statusurl = xpdjobj.PDDATA.dev85statusurl
		dev105statusurl = xpdjobj.PDDATA.dev105statusurl
		linkoffmode = xpdjobj.PDDATA.linkoffmode;		
		
		exports.pdjobj = xpdjobj; //#####
		exports.linkoffmode = linkoffmode
		exports.setuuid = setuuid

		exports.ddsnurl = ddsnurl
		exports.vdsnurl = vdsnurl
		exports.devloadurl = devloadurl
		exports.typeloadurl = typeloadurl
		exports.typechannelurl = typechannelurl //

		exports.dev85statusurl = dev85statusurl
		exports.dev105statusurl = dev105statusurl

		exports.offdev85statusurl = offdev85statusurl
		exports.offdev105statusurl = offdev105statusurl
		exports.offdevloadurl = offdevloadurl
		exports.offtypeloadurl = offtypeloadurl
		exports.offtypechannelurl = offtypechannelurl

		exports.setdeviceip = setdeviceip
		exports.setdeviceport = setdeviceport

		exports.setddsnurl = setddsnurl
		exports.setvdsnurl = setvdsnurl
		exports.setdevouturl = setdevouturl
        callback();
		
        //res.send(req.query.appfile + ' ' + req.query.index);
        //res.send(webstr); 
	});
}

function sysupdate(callback){	

	let uuiddata = JSON.stringify(xpdjobj);	
	
	// fs.writeFile(filepath,uuiddata,function(error){
		// if(error){ //如果有錯誤，把訊息顯示並離開程式
			// console.log('PDDATA.txt update ERR ! ');
		// }		
		// callback(err);
	// });
	
	fs.writeFileSync(filepath,uuiddata);	
	console.log('PDDATA.txt update ok ! ');		
	callback();	
	
}


//===================================
function treescan_load(callback){
    fs.readFile(filepath_treescan, function(err, content) {
		if(err){			
			console.log("open treedata err! ")
			throw err;
		}
        let treescandata = content.toString();
		//console.log("jscan",treescandata);
        //let jobj = JSON.parse(uuiddata);
		jtreescan = jobjcopy(JSON.parse(treescandata));//jobjcopy(jobj)
		console.log("jscan=",jtreescan.treever);
		
		exports.jtreescan = jtreescan //#####
        callback();		
	});	
}

function treescan_update(callback){	
	let treescandata = JSON.stringify(jtreescan);		
	
	// fs.writeFile(filepath_treescan,treescandata,function(error){
		// if(error){ //如果有錯誤，把訊息顯示並離開程式
			// console.log('treescan.txt update ERR ! ');
		// }		
		// callback();
	// });
	
	fs.writeFileSync(filepath_treescan,treescandata);	
	console.log('treescan.txt update ok ! ');		
	callback();	
}

//===================================
function treedata_load(callback){
    fs.readFile(filepath_treedata, function(err, content) {
		if(err){
			console.log("open treedata err! ")
			throw err;
		}
        let treedatadata = content.toString();
		//console.log("jdata",treedatadata);
        //let jobj = JSON.parse(uuiddata);
		jtreedata = jobjcopy(JSON.parse(treedatadata));
		console.log("jdata=",jtreedata.treever);		
		exports.jtreedata = jtreedata//#####		
        callback();	
	});	
}

function treedata_update(callback){	
	let treedatadata = JSON.stringify(jtreedata);	
	
	// fs.writeFile(filepath_treedata,treedatadata,function(error){
		// if(error){ //如果有錯誤，把訊息顯示並離開程式
			// console.log('treedata.txt update ERR ! ');
		// }		
		// callback();
	// });	
	
	fs.writeFileSync(filepath_treedata,treedatadata);	
	console.log('treedata.txt update ok ! ');		
	callback();	
}

//===================================
function jautocmd_load(callback){
    fs.readFile(filepath_jautocmd, function(err, content) {
		if(err){
			console.log("open jautocmd err! ")
			throw err;
		}
        let jautocmddata = content.toString();
		//console.log("jdata",treedatadata);
        //let jobj = JSON.parse(uuiddata);
		jautocmd = jobjcopy(JSON.parse(jautocmddata));
		//console.log("jautocmd ver =",jautocmd.AUTOSN);		
		exports.jautocmd = jautocmd//#####		
        callback();	
	});	
}

function jautocmd_update(callback){	
	let jautocmddata = JSON.stringify(jautocmd);
	console.log('JAUTOCMD.txt update run x1! ');	
	
	// fs.writeFile(filepath_jautocmd,jautocmddata,function(error){
		// if(error){ //如果有錯誤，把訊息顯示並離開程式
			// console.log('JAUTOCMD.txt update ERR ! ');
		// }		
		// console.log('JAUTOCMD.txt update ok x2! ');		
		// callback();
	// });//### for 同步強制寫入 不受系統延遲 
	fs.writeFileSync(filepath_jautocmd,jautocmddata);
	
	console.log('JAUTOCMD.txt update ok x3! ');		
	callback();	
}

//===================================
function jkeypd_load(callback){
    fs.readFile(filepath_keypd, function(err, content) {
		if(err){
			console.log("open KEYPD.txt err! ")
			throw err;
		}
        let keypddata = content.toString();
		//console.log("jdata",treedatadata);
        //let jobj = JSON.parse(uuiddata);
		jkeypd = jobjcopy(JSON.parse(keypddata));
		//console.log("KETPD ver=",jkeypd.KEYVER);		
		exports.jkeypd = jkeypd//#####		
        callback();	
	});	
}

function jkeypd_update(callback){	
	let keypddata = JSON.stringify(jkeypd);		
	
	// fs.writeFile(filepath_keypd,keypddata,function(error){
		// if(error){ //如果有錯誤，把訊息顯示並離開程式
			// console.log('KEYPD.txt update ERR ! ');
		// }		
	// });	
	fs.writeFileSync(filepath_keypd,keypddata);
	console.log('KEYPD.txt update ok x4! ');		
	callback();
}

//=============================
//=== uart sub funciton lib ===
//=============================

//=== uart buffer tx loop 1 by 1 and rxbuff ====
//01234567890123456789
//f5010571021801020371
//###=== rx buffer tx buffer sunfunciton ======
function devloadtobuff(sub02cmd){	
	console.log("check 02 rxcmd = "+sub02cmd)
	var buffchkval = 0;
	sdevadd = sub02cmd.substring(2,4);  	//get devadd map to pos
	ss = sub02cmd
	sdevreg = ss.substring(10,12);			//reg type	
	nsdevadd = Number("0x"+sdevadd);	
	let offsettmval = 0;
	
	if(nsdevadd > 0xf0){//broadcase command call all device 
		if(nsdevadd == 0xf1)return
		if(nsdevadd == 0xfd){
			if(sdevreg == "E1")sdevadd = sub02cmd.substring(14,16);  //get devadd map to pos
			if(sdevreg == "01")sdevadd = "20" // is OPL002 TREE SCAN only
		}
		if(sdevadd in xpdjobj.addposmap){
			sdevpos = xpdjobj.addposmap[sdevadd];	//relaod POS 
		}else{
			sdevpos = "ESCAN"
			xpdjobj.PDDATA.Devtab[sdevpos].STATU.devadd = Number("0x"+sdevadd);
			console.log("ESCAN macadd scan ipadd = 0x"+sdevadd);
			return
		}
	}else{		
		if(sdevadd in xpdjobj.addposmap){
			sdevpos = xpdjobj.addposmap[sdevadd];	//relaod POS
		}else{
			sdevpos = "ESCAN"
			return
		}
	}
	
	sdevsubcmd = ss.substring(8,10);	//subcmd
	sdevreg = ss.substring(10,12);		//reg type	
	console.log("check 02 rxcmd = "+sub02cmd+" reg="+sdevreg +" sop="+sdevpos);
	
	//device out status  load check 
	ndevreglen =  Number("0x"+ss.substring(4,6))-4;//reg leng (by 1 byte)
	ndevregadd =  Number("0x"+sdevreg);//the regadd 
	switch(sdevreg.substring(0,1)){
		case "0":	//LED #reg 0x00..0x0f
			if(ndevregadd==0x03 && ndevreglen==0x02){
				sdevstau = ss.substring(12,14);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C70"]["chtab"]["03"].stu = Number("0x"+sdevstau);//0x03
				sdevstau = ss.substring(14,16);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C70"]["chtab"]["04"].stu = Number("0x"+sdevstau);//0x04
				break
			}
			if(ndevregadd==0x0e && ndevreglen==0x05){
				ve1= Number("0x"+ss.substring(12,14));
				ve2= Number("0x"+ss.substring(14,16));
				ve3= Number("0x"+ss.substring(16,18));
				ve4= Number("0x"+ss.substring(18,20));
				xpdjobj.PDDATA.Devtab[sdevpos]["C70"]["chtab"]["0E"].stu = ve1;//0x0e alarm DOSE low PUMP,3001
				if(ve1==0x01)ofmalarmcall("E002","PUMP","3001")//E002,PUMP,3001
				xpdjobj.PDDATA.Devtab[sdevpos]["C70"]["chtab"]["0F"].stu = ve2;//0x0f alarm Water low PUMP,3002
				if(ve2==0x01)ofmalarmcall("E002","PUMP","3002")//E002,PUMP,3002
				xpdjobj.PDDATA.Devtab[sdevpos]["C70"]["chtab"]["10"].stu = ve3;//0x10 alarm Dose pump err PUMP,3003
				if(ve3==0x01)ofmalarmcall("E002","PUMP","3003")//E002,PUMP,3003
				xpdjobj.PDDATA.Devtab[sdevpos]["C70"]["chtab"]["11"].stu = ve4;//0x11 alarm Water pump err PUMP,3005
				if(ve4==0x01)ofmalarmcall("E002","PUMP","3004")//E002,PUMP,3004
				sdevstau = ss.substring(20,22);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C70"]["chtab"]["12"].stu = Number("0x"+sdevstau)*2+1;//0x12
				break
			}
			break
		case "1":	//C71 key1..3 mode  reg 1D..20
			if(ndevregadd==0x1d && ndevreglen==0x04){
				vk1= Number("0x"+ss.substring(12,14));
				vk2= Number("0x"+ss.substring(14,16));
				vk3= Number("0x"+ss.substring(16,18));
				vk4= Number("0x"+ss.substring(18,20));
				if(xpdjobj.PDDATA.Devtab[sdevpos]["C71"]["chtab"]["1D"].stu != vk1){
					xpdjobj.PDDATA.Devtab[sdevpos]["C71"]["chtab"]["1D"].stu = vk1;//0x1D
					ofmkeyupload("KEYPAD0","K001",keycomm[vk1]);//pos = KEYPAD0 , group = "K021" , STU=:ON75"
				}
				if(xpdjobj.PDDATA.Devtab[sdevpos]["C71"]["chtab"]["1E"].stu != vk2){
					xpdjobj.PDDATA.Devtab[sdevpos]["C71"]["chtab"]["1E"].stu = vk2;//0x1E
					ofmkeyupload("KEYPAD0","K006",keycomm[vk2]);//pos = KEYPAD0 , group = "K021" , STU=:ON75"
				}
				ofmkeyupload("KEYPAD0","K006",keycomm[vk2]);//pos = KEYPAD0 , group = "K021" , STU=:ON75"
				//autocmd.active_keypadjob("KEYPAD0","K006",keycomm[vk2]);//pos = KEYPAD0 , group = "K021" , STU=:ON75"
				if(xpdjobj.PDDATA.Devtab[sdevpos]["C71"]["chtab"]["1F"].stu != vk3){
					xpdjobj.PDDATA.Devtab[sdevpos]["C71"]["chtab"]["1F"].stu = vk3;//0x1F
					ofmkeyupload("KEYPAD0","K007",keycomm[vk3]);//pos = KEYPAD0 , group = "K021" , STU=:ON75"
				}
				if(xpdjobj.PDDATA.Devtab[sdevpos]["C71"]["chtab"]["20"].stu != vk4){
					xpdjobj.PDDATA.Devtab[sdevpos]["C71"]["chtab"]["20"].stu = vk4;//0x20
					//ofmkeyupload("KEYPAD0","K008",keycomm[vk4]);//pos = KEYPAD0 , group = "K021" , STU=:ON75"
				}
				break
			}
			break
		case "6":	//sensor  reg60 .. 66 extern maping  U16 
			if(ndevregadd==0x60 && ndevreglen==0x04){
				sdevstau = ss.substring(12,16);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C78"]["chtab"]["60"].stu = Number("0x"+sdevstau);//0x60
				sdevstau = ss.substring(16,20);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C77"]["chtab"]["61"].stu = Number("0x"+sdevstau);//0x61
				//console.log(JSON.stringify(xpdjobj.PDDATA.Devtab[sdevpos]));
				break
			}
			if(ndevregadd==0x62 && ndevreglen==0x06){
				sdevstau = ss.substring(12,16);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C7B"]["chtab"]["62"].stu = Number("0x"+sdevstau);//0x62
				sdevstau = ss.substring(16,20);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C7A"]["chtab"]["63"].stu = Number("0x"+sdevstau);//0x63
				sdevstau = ss.substring(20,24);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C76"]["chtab"]["64"].stu = Number("0x"+sdevstau);//0x64
				//console.log(JSON.stringify(xpdjobj.PDDATA.Devtab[sdevpos]));
				break
			}
			if(ndevregadd==0x65 && ndevreglen==0x04){
				sdevstau = ss.substring(12,16);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C78"]["chtab"]["65"].stu = Number("0x"+sdevstau);//0x65
				sdevstau = ss.substring(16,20);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C77"]["chtab"]["66"].stu = Number("0x"+sdevstau);//0x66
				break
			}
			break
		case "7":	//WATERLEVEL(C79) reg70 .. 7B flow and hall scan value U16
			if(ndevregadd==0x70 && ndevreglen==0x03){
				sdevstau = ss.substring(12,16);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["70"].stu = Number("0x"+sdevstau);//0x70
				sdevstau = ss.substring(16,20);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["71"].stu = Number("0x"+sdevstau);//0x71
				sdevstau = ss.substring(20,24);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["72"].stu = Number("0x"+sdevstau);//0x72
				break
			}
			if(ndevregadd==0x73 && ndevreglen==0x02){
				sdevstau = ss.substring(24,28);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["73"].stu = Number("0x"+sdevstau);//0x73
				sdevstau = ss.substring(28,32);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["74"].stu = Number("0x"+sdevstau);//0x74
				break
			}
			if(ndevregadd==0x76 && ndevreglen==0x03){
				sdevstau = ss.substring(12,16);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["76"].stu = Number("0x"+sdevstau);//0x76
				sdevstau = ss.substring(16,20);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["77"].stu = Number("0x"+sdevstau);//0x77
				sdevstau = ss.substring(20,24);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["78"].stu = Number("0x"+sdevstau);//0x78
				break
			}
			if(ndevregadd==0x79 && ndevreglen==0x02){
				sdevstau = ss.substring(24,28);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["79"].stu = Number("0x"+sdevstau);//0x79
				sdevstau = ss.substring(28,32);			//reg value by 1 byte	
				xpdjobj.PDDATA.Devtab[sdevpos]["C75"]["chtab"]["7A"].stu = Number("0x"+sdevstau);//0x7A
				break
			}
			break		
		default:
			break 
	};
}

ERRMSG_CODE={
	"01":"CMD_RE_ER_TIMEOVER",
	"02":"CMD_RE_ER_FORMAT",
	"03":"CMD_RE_ER_UNDEV",
	"04":"CMD_RE_ER_UNLEN",
	"05":"CMD_RE_ER_UNCMD",
	"06":"CMD_RE_ER_UNREG",
	"07":"CMD_RE_ER_CHECK",
	"08":"CMD_RE_ER_NOIP",
	"09":"CMD_RE_ER_NOSRC",
	"0A":"CMD_RE_ER_CRT_MEM",
	"0B":"CMD_RE_ER_PARAM_OV",
	"0C":"CMD_RE_ER_PARAM_ER",
	"0D":"CMD_RE_ER_BUF_OV",
	"0E":"CMD_RE_ER_BUSY",
	"0F":"CMD_RE_ER_NODAT"
}

//  ERR message send to webserver or IPC webUI
function deverrbuff(errcmd){//fcc10681019f010381
	//check pos onlink
	sdevadd = errcmd.substring(2,4);		//add
	sdevcmd = errcmd.substring(8,10);     	//subcmd
	sdevreg = ss.substring(10,12);			//reg type	
	let errcode = ss.substring(12,16);		//err code 	
	let errkey = ss.substring(14,16);		//err code 	
	nsdevadd = Number("0x"+sdevadd);
	
	console.log(">>> Err code ["+errcode+"]="+ERRMSG_CODE[errkey]);
	//0xFC,[ipadd],[len],[00],[0x07 alarm], [reg] , [dataH][dataL],chk
	//  01  23       45   67   89           01       23     45     67 
	//0xfa,add,len,0x00,0x0a,reg,[errcode_H],[errcode_L],chksum==> ERR code callback  0x0a ERR subcmd 
	
}

var sstxbuff=[];//txbuffer list

function totxbuff(ttbuf){
	let scmd = ttbuf.toString('hex')
	let sendmask = 0;
	
	//console.log("startx1 tx run ... txbuffer leng= "+sstxbuff.length);
	if(ttbuf.length >= 10){
		//go();
	}
	if(sstxbuff.length == 0 )sendmask = 1;
	sstxbuff.push(scmd)
	//if (sstxbuff.length == 1){
	if (sendmask == 1){
		//event.emit('txbuff_event'); 
		console.log("startx2 tx run ... txbuffer leng= "+sstxbuff.length);
		//tx_timeout_chk = false;
		setTimeout(function() { 
			event.emit('txbuff_event'); 
		}, 100);	
	}
}

event.on('txbuff_event', function() { 
	if(sstxbuff.length > 0){
	   let scmd = sstxbuff.shift();
	   ch1com.qqsendcmd(scmd,function(){	   
			//console.log(">>> rxbuff timeout check ...");
			setTimeout(function() { 
				event.emit('rxbuff_event'); 
			}, 500); //#### tx bufffer dealy 1300ms ???
	   });			
	}
});

//0xF5,addr,0x02,0x50,0x50
//F5,addr,0x05,0x70,[pos1][pos2],[gorup],0x70 
event.on('rxbuff_event', function() { //####
	while(ch1com.qrxcmd.length > 0){
		if(ch1com.qrxcmd.length > 0){
			//console.log("rxleng="+ch1com.qrxcmd.length );
			//ss = ch1com.qrxcmd.shift()
			ssbuf = ch1com.qrxcmdshift();
			ss = ssbuf.toUpperCase();
			console.log("<<< show cmd rx["+ch1com.qrxcmd.length +"]:" + ss)
			//check pos onlink
			startkey = ss.substring(0,2);//0xfa or 0xfc
			sdevadd = ss.substring(2,4);
			sdevcmd = ss.substring(8,10);
			sdevreg = ss.substring(10,12);
			if(startkey == "FC"){
				//devalarmbuff(ss);//add to alarmbuff[]
			}else{			
				sdevsubcmd = ss.substring(8,10);	
				console.log("rx subcmd chek = "+sdevsubcmd)
				if(sdevsubcmd == '02')devloadtobuff(ss);//when load command will to setup buffer
				if(sdevsubcmd == '52')deverrbuff(ss);   //when Err Code Message buffer send to server 
			}
		}else{		
			//console.log("<<< show cmd rx timeOut Fail rxleng="+ch1com.qrxcmd.length );
			console.log("<<< show cmd cehk rxleng="+ch1com.qrxcmd.length );
			//tx_timeout_chk = true;		
		}
		
		if(sstxbuff.length > 0){	
			// setTimeout(function() { 
				// event.emit('txbuff_event'); 
			// }, 50);	
			event.emit('txbuff_event'); 
		}	
	}
	
	if(sstxbuff.length > 0){	
		// setTimeout(function() { 
			// event.emit('txbuff_event'); 
		// }, 50);	
		event.emit('txbuff_event'); 
	}	
});

//===========================
//0xF5,addr,0x02,0x50,0x50
//F5,addr,0x05,0x70,[pos1][pos2],[gorup],0x70 
event.on('arxbuff_event', function() { //####
	while(ch1com.aqrxcmd.length > 0){
		if(ch1com.aqrxcmd.length > 0){
			//console.log("arxleng="+ch1com.aqrxcmd.length );
			//ss = ch1com.qrxcmd.shift()
			ssbuf = ch1com.aqrxcmdshift();
			ss = ssbuf.toUpperCase();
			console.log("<<< show cmd arx["+ch1com.aqrxcmd.length+"]=" + ss)
			//check pos onlink
			startkey = ss.substring(0,2);//0xfa or 0xfc[0][1][2][3][4:cmd][5:reg][6,7:value],[8,9:group],[10]
			//sdevadd = ss.substring(2,4); //[01 23 45 67 89 01 23 45 67 89 01]
			//sdevcmd = ss.substring(8,10);
			//sdevreg = ss.substring(10,12);
			if(startkey == "FC"){
				devalarmbuff(ss);//add to alarmbuff[]
			}else{
				console.log("Fxx rxcomm = "+ss);
			}
			
		}else{		
			console.log("<<< show cmd rx timeOut Fail rxleng="+ch1com.aqrxcmd.length );
		}		
	}
})

//=== container IPC  105url for  alarm event ===
var alarmbuff = [];
var alarmloadurl = "http://127.0.0.1:3001/alarm"

function toalarmoutbuff(kdev){  //### no use 
	alarmbuff.push(JSON.stringify(kdev))	
	if(alarmbuff.length==1){			
		setTimeout(function(){event.emit('sendalarm_event')},10);	
	}	
}

event.on('sendalarm_event', function() { 
	if(alarmbuff.length>0){	
	        sdev = alarmbuff.shift();
			console.log("type ="+typeof(sdev)+" data="+sdev);
			//setdevouturl = key105loadurl+"?KEY="+"&STATE="+"&EVENT=";       
			console.log("url="+setdevouturl);
            //client.get(setdevouturl, function (data, response) {				
			//});
			setTimeout(function(){event.emit('sendalarm_event')},10);		
	}
});

//=== container IPC 105url for keypad event ===
var keypadbuff =[];
var key105loadurl =  "http://127.0.0.1:3001/keypad"  //localhost:3001/keypad?KEY=94&STATE=00&EVENT=2

function tokeypadoutbuff(kdev){
	keypadbuff.push(JSON.stringify(kdev))	
	if(keypadbuff.length==1){			
		setTimeout(function(){event.emit('sendkeypad_event')},10);	
	}	
}

event.on('sendkeypad_event', function() { //FCC10681019E010281
	if(keypadbuff.length>0){	
		sdev = keypadbuff.shift();
		sdevkey = sdev.substring(11,13);
		sdevstu = sdev.substring(13,15);
		sdevevent = sdev.substring(15,17);
		console.log("type ="+typeof(sdev)+" data="+sdev);
		setdevouturl = key105loadurl+"?KEY="+sdevkey+"&STATE="+sdevstu+"&EVENT="+sdevevent;       
		console.log("url="+setdevouturl);
		if(global.weblinkflag == 0){
			client.get(setdevouturl, function (data, response) {}).on("error", function(err) {console.log("err for client");global.weblinkflag=0;});
		}
		setTimeout(function(){event.emit('sendkeypad_event')},10);		
	}
});

function ofmkeyupload(kpos,kcode,kactive){
	updatekeysstuatusurl="http://106.104.112.56/Cloud/API/v2/KeypadUpdate"+"?ID="+setuuid+"&KeypadID="+kpos+"&Index="+kcode+"&value="+kactive;
	console.log("sudo active update to webui =>"+updatekeysstuatusurl);
	if(global.weblinkflag == 0){
		client.get(updatekeysstuatusurl,cargs, function (data, response) {
			console.log("keypad active update to webui   ok ...");
		}).on("error", function(err) {console.log("err for clientx1");global.weblinkflag=0;}).on('requestTimeout', function (req) {console.log("timeout for clientx1");req.abort();});
	}
}


function ofmalarmcall(apos,atype,alarmcode){//E002,PUMP,3001
	//alarm code 0x4001 => by POS device list to upload
	update_alarmcodeurl= "http://106.104.112.56/Cloud/API/v2/Alarm"+"?ID="+setuuid+"&POS="+apos+"&Type="+atype+"&value="+alarmcode+"&Data=0";
	console.log(">>alarm update to web DB =>"+update_alarmcodeurl);
	if(global.weblinkflag == 0){
		client.get(update_alarmcodeurl,cargs, function (data, response) {
			console.log("alarm code active update to webDB pump  ok ...");
		}).on("error", function(err) {console.log("err for client");global.weblinkflag=0;}).on('requestTimeout', function (req) {req.abort();});
	}
}
//0xFC alarm 主動回報 警告處置 KeyPAD 觸發 主動回報處置
function devalarmbuff(alarmcmd){//fcc10681019f010381
	//check pos onlink
	let alarmcode ="0000";
	let apos = "0000";
	let sdevadd = alarmcmd.substring(2,4);		//add
	let sdevcmd = alarmcmd.substring(8,10);     //subcmd
	let sdevreg = alarmcmd.substring(10,12);	//reg type	
	let nsdevadd = Number("0x"+sdevadd);
	
	//0xFC,[ipadd],[len],[00],[0x07 alarm], [reg] , [dataH][dataL],chk
	//  01  23       45   67   89           01       23     45     67 
	
	//=== check ipadd is use in PDDATA db 
	if(nsdevadd > 0xf0){
		if(nsdevadd == 0xf1)return //GROUP CONTROL 
		//0xFC,0xFD ==> is new MACADD deviec install active alarm 
		if(nsdevadd == 0xfd){      //macadd command ipadd nodefine 
			sdevmac = alarmcmd.substring(12,24); 	//macadd
			sdevpadd = alarmcmd.substring(26,28); 	//parint ipadd 
			console.log("find a new macadd =["+sdevmac+"] paradd ="+sdevpadd);
			return
		}
		if(sdevadd in xpdjobj.addposmap){
			sdevpos = xpdjobj.addposmap[sdevadd];	//relaod POS 
		}else{
			sdevpos = "ESCAN"  //undefined sop use ESCAN backup data Value 
			xpdjobj.PDDATA.Devtab[sdevpos].STATU.devadd = Number("0x"+sdevadd);
			console.log("ESCAN macadd scan ipadd = 0x"+sdevadd);
			return
		}
	}else{		
		if(sdevadd in xpdjobj.addposmap){
			sdevpos = xpdjobj.addposmap[sdevadd];	//relaod POS
		}else{
			sdevpos = "ESCAN"
			xpdjobj.PDDATA.Devtab[sdevpos].STATU.devadd = Number("0x"+sdevadd);
			console.log("ESCAN macadd scan ipadd = 0x"+sdevadd);
		}
	}
	
	ss = alarmcmd
	//keypad push alarm broadcast to server ### 20180610 update hadnel 
	if(nsdevadd == 0x20){// keypad1 and keypad2 maping in E001 0x20 reg:10 , 12
		if(sdevreg == "10"){  //keypad1 8 keycode:  0x91 .. 0x98 FC20060003109801AF
			//keypad1
			let skeyinx = ss.substr(12,2);	
			let skeystu = ss.substr(14,2);
			let kkss = "01"+skeyinx+skeystu;
			if(keypadpushbuffer.length > 32)keypadpushbuffer=[];//buffer mac 32 item 
			keypadpushbuffer.push(kkss);
			
			// let stpt = Number("0x"+skeystu);
			// let jketbuff={};
			// let jkeypush ={};
			// let keycmask ="ON";
			// ksop = "K0"+skeyinx
			// console.log("key="+ksop)
			// if(ksop in jkeypd.KEYLIB.KEYPAD1){
				// jketbuff = jkeypd.KEYLIB.KEYPAD1[ksop];
				// if(stpt < jketbuff.STATUS.stcnt){
					// keycmask = jketbuff.STATUS.stmask[stpt];
					// jkeypush = jketbuff.EVENT[keycmask];
					// for(jkk in jkeypush ){
						// console.log("keyapi>>"+jkeypush[jkk]);
					// }
				// }else{
					// console.log("keystu="+stpt+"no define in "+ksop);
				// }
			// }else{
				// console.log("key="+ksop+"no define in keypad1")
			// }
			
			//jkeypd.KEYLIB.KEYPAD1[ksop]["STATUS"]["stcnt"]= Number("0x"+skeystu);
			return;
		}else if(sdevreg == "12"){	//keypad2  68 keycode: 0x21 .. 0x6b
			//keypad2
			let skeyinx = ss.substr(12,2);	
			let skeystu = ss.substr(14,2);
			let kkss = "02"+skeyinx+skeystu;
			if(keypadpushbuffer.length > 32)keypadpushbuffer=[];//buffer mac 32 item 
			keypadpushbuffer.push(kkss);
			
			// let stpt = Number("0x"+skeystu);
			// let jketbuff={};
			// let jkeypush ={};
			// let keycmask ="ON";
			// ksop = "K0"+skeyinx
			// console.log("key="+ksop)
			// if(ksop in jkeypd.KEYLIB.KEYPAD2){
				// jketbuff = jkeypd.KEYLIB.KEYPAD2[ksop];
				// if(stpt < jketbuff.STATUS.stcnt){
					// keycmask = jketbuff.STATUS.stmask[stpt];
					// jkeypush = jketbuff.EVENT[keycmask];
					// for(jkk in jkeypush ){
						// console.log("keyapi>>"+jkeypush[jkk]);
					// }
				// }else{
					// console.log("keystu="+stpt+"no define in "+ksop);
				// }
			// }else{
				// console.log("key="+ksop+"no define in keypad2")
			// }
			//jkeypd.KEYLIB.KEYPAD2[ksop]["STATUS"]["stcnt"]= Number("0x"+skeystu);
			return;
		}
	}
	
	if(nsdevadd == 0x21){
		switch (sdevreg) {
			case "10": //keypad1 8 keycode:  0x91 .. 0x98
				//keypad3
				skeyinx = ss.substring(12,14);	
				skeystu = ss.substring(14,16);
				let kkss = "03"+skeyinx+skeystu;
				if(keypadpushbuffer.length > 32)keypadpushbuffer=[];//buffer mac 32 item 
				keypadpushbuffer.push(kkss);
				//jkeypd.KEYLIB.KEYPAD1[ksop]["STATUS"]["stcnt"]= Number("0x"+skeystu);
				return
				break;
			case "12": //keypad2  68 keycode: 0x21 .. 0x6b
				//keypad4
				return;
				break;
			default:
				break;
		}
		//jautocmd.EVENTID.DEVPUMP
		if(sdevreg in jautocmd.EVENTID.DEVPUMP){	
			apos = jautocmd.EVENTID.DEVPUMP[sdevreg][0];
			atype =  jautocmd.EVENTID.DEVPUMP[sdevreg][1];
			alarmcode =  jautocmd.EVENTID.DEVPUMP[sdevreg][2];
			if(sdevcmd == "07"){			
				//alarm code 0x4001 => by POS device list to upload
				update_alarmcodeurl= "http://106.104.112.56/Cloud/API/v2/Alarm"+"?ID="+setuuid+"&POS="+apos+"&Type="+atype+"&value="+alarmcode+"&Data=0";
				console.log(">>alarm update to web DB =>"+update_alarmcodeurl);
		if(global.weblinkflag == 0){
					client.get(update_alarmcodeurl,cargs, function (data, response) {
						console.log("alarm code active update to webDB pump  ok ...");
					}).on("error", function(err) {console.log("err for client");global.weblinkflag=0;}).on('requestTimeout', function (req) {req.abort();});
		}
				updateipc_alarmcodeurl= "http://192.168.5.220/API/v2/Alarm.php"+"?ID="+setuuid+"&POS="+apos+"&Type="+atype+"&value="+alarmcode+"&Data=0";
				console.log(">>alarm update to web DB =>"+updateipc_alarmcodeurl);
				client.get(updateipc_alarmcodeurl,ipccargs, function (data, response) {
					console.log("alarm code active update to webDB  pump ok ...");
				}).on("error", function(err) {console.log("err for client");}).on('requestTimeout', function (req) {req.abort();});
			}
		}
		return;
	}
	
	if(((nsdevadd==0x84) || (nsdevadd==0xBD)) && sdevcmd == "07"){//PIR
		if(sdevreg == "41"){
			let kkss = "019901";
			if(keypadpushbuffer.length > 32)keypadpushbuffer=[];//buffer mac 32 item 
			keypadpushbuffer.push(kkss);//push K099 OFF UV and wayLED on
			//jkeypd.KEYLIB.KEYPAD1[ksop]["STATUS"]["stcnt"]= Number("0x"+skeystu);
			return			
		}else{
			return
		}			
	}
	
	if((nsdevadd>=0x2f) && (nsdevadd<=0xe0) && (sdevcmd=="07")){//device Fail alarm addposmap
		//if(!(sdevadd in xpdjobj.PDDATA.addposmap))return;
	
		if(!(sdevadd in jautocmd.EVENTID.DEVLED))return;
		apos = jautocmd.EVENTID.DEVLED[sdevadd][0];
		atype =  jautocmd.EVENTID.DEVLED[sdevadd][1];
		alarmcode =  jautocmd.EVENTID.DEVLED[sdevadd][2];
		
		//alarm code 0x4001 => by POS device list to upload
		update_alarmcodeurl= "http://106.104.112.56/Cloud/API/v2/Alarm"+"?ID="+setuuid+"&POS="+apos+"&Type="+atype+"&value="+alarmcode+"&Data=0";
		console.log(">>alarm update to web DB =>"+update_alarmcodeurl);
		
		if(global.weblinkflag == 0){
			client.get(update_alarmcodeurl,cargs, function (data, response) {
				console.log("alarm code active update to webDB   ok ...");
			}).on("error", function(err) {console.log("err for client");global.weblinkflag=0;}).on('requestTimeout', function (req) {req.abort();});
		}

		updateipc_alarmcodeurl= "http://192.168.5.220/API/v2/Alarm.php"+"?ID="+setuuid+"&POS="+apos+"&Type="+atype+"&value="+alarmcode+"&Data=0";
		console.log(">>alarm update to web DB =>"+updateipc_alarmcodeurl);
		client.get(updateipc_alarmcodeurl,ipccargs, function (data, response) {
			console.log("alarm code active update to webDB   ok ...");
		}).on("error", function(err) {console.log("err for client");}).on('requestTimeout', function (req) {req.abort();});
		
	
	}
	
	//=== check sop & reg for sensor value save 
	switch(sdevreg.substring(0,1)){		
		case "A":	//TEMPERATURE(C77) reg A1..Af
			sdevstau = ss.substring(12,16);			//reg type	
			if(!(sdevreg in xpdjobj.PDDATA.Devtab[sdevpos]["C77"]["chtab"]))return
			xpdjobj.PDDATA.Devtab[sdevpos]["C77"]["chtab"][sdevreg].sub = Number("0x"+sdevsubcmd)
			xpdjobj.PDDATA.Devtab[sdevpos]["C77"]["chtab"][sdevreg].stu = Number("0x"+sdevstau);
			//send alarm to webserver ....
			break
		case "7":	//WATERLEVEL(C79) reg71 .. 7f
			sdevstau = ss.substring(12,16);			//reg type	
			if(!(sdevreg in xpdjobj.PDDATA.Devtab[sdevpos]["C79"]["chtab"]))return
			xpdjobj.PDDATA.Devtab[sdevpos]["C79"]["chtab"][sdevreg].sub = Number("0x"+sdevsubcmd)
			xpdjobj.PDDATA.Devtab[sdevpos]["C79"]["chtab"][sdevreg].stu = Number("0x"+sdevstau);
			//send alarm to webserver ....
			break
		default:
			break 
	};
	
	switch(sdevreg){
		case "91":	//CO2(C76)	#reg91
			sdevstau = ss.substring(12,16);			//reg type	
			if(!(sdevreg in xpdjobj.PDDATA.Devtab[sdevpos]["C76"]["chtab"]))return
			xpdjobj.PDDATA.Devtab[sdevpos]["C76"]["chtab"][sdevreg].sub = Number("0x"+sdevsubcmd)
			xpdjobj.PDDATA.Devtab[sdevpos]["C76"]["chtab"][sdevreg].stu = Number("0x"+sdevstau);	
			//send alarm to webserver ....	
			break
		case "92":	//RH(C78)	#reg92
			sdevstau = ss.substring(12,16);			//reg type	
			if(!(sdevreg in xpdjobj.PDDATA.Devtab[sdevpos]["C78"]["chtab"]))return
			xpdjobj.PDDATA.Devtab[sdevpos]["C78"]["chtab"][sdevreg].sub = Number("0x"+sdevsubcmd)
			xpdjobj.PDDATA.Devtab[sdevpos]["C78"]["chtab"][sdevreg].stu = Number("0x"+sdevstau);		
			//send alarm to webserver ....
			break
		case "93":	//PH(C7B)   #reg93
			sdevstau = ss.substring(12,16);			//reg type	
			if(!(sdevreg in xpdjobj.PDDATA.Devtab[sdevpos]["C7B"]["chtab"]))return
			xpdjobj.PDDATA.Devtab[sdevpos]["C7B"]["chtab"][sdevreg].sub = Number("0x"+sdevsubcmd)
			xpdjobj.PDDATA.Devtab[sdevpos]["C7B"]["chtab"][sdevreg].stu = Number("0x"+sdevstau);	
			//send alarm to webserver ....	
			break
		case "94":	//ELECTRONS(C7A)#reg94
			sdevstau = ss.substring(12,16);			//reg type	
			if(!(sdevreg in xpdjobj.PDDATA.Devtab[sdevpos]["C7A"]["chtab"]))return
			xpdjobj.PDDATA.Devtab[sdevpos]["C7A"]["chtab"][sdevreg].sub = Number("0x"+sdevsubcmd)
			xpdjobj.PDDATA.Devtab[sdevpos]["C7A"]["chtab"][sdevreg].stu = Number("0x"+sdevstau);	
			//send alarm to webserver ....	
			break
		default:
			return 
			
	}
	
	// if(sdevadd == "C1" && sdevcmd == "81"){
		// tokeypadoutbuff(alarmcmd);		
	// }else{
	//alarmbuff.push(alarmcmd);  //to alarm buffer 
	// }
	//sensroe modeloop or modetrig active message
	//keypad active message 
	//
	
}


//=== system start up function call process 
// sysload(function(){	
        // console.log("dsnurl = ", ddsnurl);
        // console.log("videodsnurl = ",vdsnurl);//devloadur
        // console.log("devloadur = ", devloadurl)
        // console.log("typeloadurl = ", typeloadurl)
        // console.log("typechannelurl = ", typechannelurl)
        // console.log("dev85statusurl = ", dev85statusurl)
        // console.log("dev105statusurl = ", dev105statusurl)
        // console.log("linkoffmode = ", linkoffmode)
		
        // console.log("uuids = ", setuuid);		
// });

// treescan_load(function(){
        // console.log("jtreescan ver = ", jtreescan.treever);			
// });

// treedata_load(function(){
        // console.log("jtreedata ver = ", jtreedata.treever);			
// });

// jautocmd_load(function(){
// 		console.log("jautocmd ver =",jautocmd.AUTOSN);		
// });

// jkeypd_load(function(){
// 		console.log("KETPD ver=",jkeypd.KEYVER);		
// });
function allload(callback){
	//redis的buffer載入
	redisfunc.init_redis(function () {
		setuuid = redisfunc.setuuid;
		exports.setuuid = setuuid;

		xpdjobj = redisfunc.pdjobj;
		exports.pdjobj = xpdjobj;

		jautocmd = redisfunc.jautocmd;
		//jobj=jobjcopy(jautocmd);
		//console.log(JSON.stringify(jobj));
		exports.jautocmd = jautocmd;

		jkeypd = redisfunc.jkeypd;
		exports.jkeypd = jkeypd;
		callback();
	});
}
//=== tree data
//exports.pdjobj = xpdjobj; //#####
//exports.jtreescan = jtreescan
//exports.jtreedata = jtreedata		
//exports.jautocmd = jautocmd//#####			
//exports.jkeypd = jkeypd//#####			

//rs422 command and subcmd 
exports.cmdcode = cmdcode

//=== bufff syspub lib	
exports.jobjcopy = jobjcopy
exports.eventcall = eventcall

exports.totxbuff = totxbuff
exports.ch1com = ch1com

//PDDATA.txt		pdjobj
exports.sysload = sysload
exports.sysupdate = sysupdate

//treescan.txt    	jtreescan
// exports.treescan_load = treescan_load
// exports.treescan_update = treescan_update

//treedata.txt 		jtreedata
// exports.treedata_load = treedata_load
// exports.treedata_update = treedata_update

//JAUTOCMD.txt 		jautocmd
exports.jautocmd_load = jautocmd_load
exports.jautocmd_update = jautocmd_update

//KETPD.txt 		jkeypd
exports.jkeypd_load = jkeypd_load
exports.jkeypd_update = jkeypd_update
exports.keypadpushbuffer = keypadpushbuffer

//redisfunc.js
exports.init_redis = redisfunc.init_redis;
exports.load_redis = redisfunc.load_redis;
exports.update_redis = redisfunc.update_redis;

exports.clear_redis = redisfunc.clear_redis;
exports.show_all_keys_redis = redisfunc.show_all_keys_redis;

exports.allload = allload;
