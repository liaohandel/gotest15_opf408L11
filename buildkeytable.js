var fs = require('fs');
var path = require('path');
//=== PDDATA.txt to pdjobj
var filefirstname = "PDDATA"
var filename = "PDDATA.txt"
var filepath = path.join(__dirname, ("/public/" + filename));
var xpdjobj = {} //pd buffer 

// //=== treescan.txt to jtreescan
// var filename_treescan = "treescan.txt"
// var filepath_treescan = path.join(__dirname, ("/public/" + filename_treescan));
// var jtreescan = {} //treescan buffer 

// //=== treedata.txt to jtreedata
// var filename_treedate = "treedata.txt"
// var filepath_treedata = path.join(__dirname, ("/public/" + filename_treedate));
// var jtreedata = {} //tree upload buffer

//=== JAUTOCMD.txt to jautocmd === 
var filefirstname_jautocmd = "JAUTOCMD"
var filename_jautocmd = "JAUTOCMD.txt"
var filepath_jautocmd = path.join(__dirname, ("/public/" + filename_jautocmd));
var jautocmd = {} //tree upload buffer

//=== KEYPD.txt to jkeypd ===
var filefirstname_keypd = "KEYPD"
var filename_keypd = "KEYPD.txt"
var filepath_keypd = path.join(__dirname, ("/public/" + filename_keypd));
var jkeypd = {} //tree upload buffer

//=== KEYTABLE.txt to keytab ===
var filename_keytab = "KEYTABLE.txt"
var filepath_keytab = path.join(__dirname, ("/public/" + filename_keytab));
var keytab = {} //tree upload buffer

xpdjobj = JSON.parse(fs.readFileSync(filepath).toString());
jautocmd = JSON.parse(fs.readFileSync(filepath_jautocmd).toString());
jkeypd = JSON.parse(fs.readFileSync(filepath_keypd).toString());

//每個key的形狀
function newkey() {
	let args = Array.prototype.slice.call(arguments);
	let args2 = args.slice(1);
	keytab[args.join("#")] = { "file": args[0], "path": args2, "sub": [] };
}

//讀檔建PDDATA的key表
for (key in xpdjobj) {
	newkey("PDDATA", key);
}
//因為Devtab被獨立，需要建key表
keytab["PDDATA#PDDATA"].sub.push("Devtab");
for (key in xpdjobj.PDDATA.Devtab) {
	newkey("PDDATA", "PDDATA", "Devtab", key);
}


//讀檔建JAUTOCMD的key表
for (key in jautocmd) {
	newkey("JAUTOCMD", key);
}

//DEVLIST DEFAUTOLIST ALARMCHECK 被獨立，需要建key表
delete keytab["JAUTOCMD#DEVLIST"];
for (key in jautocmd.DEVLIST) {
	newkey("JAUTOCMD", "DEVLIST", key);
}
delete keytab["JAUTOCMD#DEFAUTOLIST"];
for (key in jautocmd.DEFAUTOLIST) {
	newkey("JAUTOCMD", "DEFAUTOLIST", key);
}
delete keytab["JAUTOCMD#ALARMCHECK"];
for (key in jautocmd.ALARMCHECK) {
	newkey("JAUTOCMD", "ALARMCHECK", key);
}

//讀檔建KEYPD的key表
for (key in jkeypd) {
	newkey("KEYPD", key);
}
//KEYLIB被獨立，需要建key表
delete keytab["KEYPD#KEYLIB"];
for (key in jkeypd.KEYLIB.KEYPAD0) {
	newkey("KEYPD", "KEYLIB", "KEYPAD0", key);
}
for (key in jkeypd.KEYLIB.KEYPAD1) {
	newkey("KEYPD", "KEYLIB", "KEYPAD1", key);
}
for (key in jkeypd.KEYLIB.KEYPAD2) {
	newkey("KEYPD", "KEYLIB", "KEYPAD2", key);
}
//JSON.stringify第二個參數沒用到，第三個參數為使用tab字元做排版，第三個參數如果輸入數字則是用數值個空白排版。
fs.writeFileSync(filepath_keytab, JSON.stringify(keytab, null, "\t"));