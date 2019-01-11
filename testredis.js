//載入redis自製模板
var pdbuffer = require('./pdbuffer_v02.js');
//物件下元素數量
function object_length(obj) {
	try {
		return Object.getOwnPropertyNames(obj).length;
	} catch (err) {
		return 0;
	}
}

// setTimeout(init_test, 1000);
setTimeout(load_test, 1000);
// setTimeout(update_test, 1000);
function init_test() {
	if (object_length(pdbuffer.pdjobj) == 0 || object_length(pdbuffer.jautocmd) == 0 || object_length(pdbuffer.jkeypd) == 0) {
		setTimeout(init_test, 1000);
		return;
	}
	console.log("=====================");
	console.log("pdjobj");
	console.log("=====================");
	console.log(JSON.stringify(pdbuffer.pdjobj, null, "\t"));
	console.log("=====================");
	console.log("jautocmd");
	console.log("=====================");
	console.log(JSON.stringify(pdbuffer.jautocmd, null, "\t"));
	console.log("=====================");
	console.log("jkeypd");
	console.log("=====================");
	console.log(JSON.stringify(pdbuffer.jkeypd, null, "\t"));
}
function load_test() {
	if (object_length(pdbuffer.pdjobj) == 0) {
		setTimeout(load_test, 1000);
		return;
	}
	pdbuffer.pdjobj.PDDATA.Devtab.E001.C70.chtab["01"].sub = 100;
	console.log("=====================");
	console.log("pdjobj");
	console.log("=====================");
	console.log(JSON.stringify(pdbuffer.pdjobj, null, "\t"));
	console.log("=====================");
	pdbuffer.load_redis('pdjobj.PDDATA.Devtab.E001.C70.chtab["01"].sub', function () {
		console.log("=====================");
		console.log("pdjobj");
		console.log("=====================");
		console.log(JSON.stringify(pdbuffer.pdjobj, null, "\t"));
		console.log("=====================");
	});
}
function update_test() {
	if (object_length(pdbuffer.pdjobj) == 0) {
		setTimeout(update_test, 1000);
		return;
	}
	pdbuffer.pdjobj.PDDATA.Devtab.E001.C70.chtab["01"].sub = 3;
	pdbuffer.update_redis('pdjobj.PDDATA.Devtab.E001.C70.chtab["01"].sub', function () {
	});
}