//檔案讀取檔名路徑配置
//模板載入並宣告變數與物件
var fs = require('fs');
var path = require('path');
var setuuid = '1234567890abcdefghijk';
//=== PDDATA.txt to pdjobj
var filefirstname = "PDDATA"
var filename = "PDDATA.txt"
var filepath = path.join(__dirname, ("/public/" + filename));
var xpdjobj = {} //pd buffer 

//=== treescan.txt to jtreescan
var filename_treescan = "treescan.txt"
var filepath_treescan = path.join(__dirname, ("/public/" + filename_treescan));
var jtreescan = {} //treescan buffer 

//=== treedata.txt to jtreedata
var filename_treedate = "treedata.txt"
var filepath_treedata = path.join(__dirname, ("/public/" + filename_treedate));
var jtreedata = {} //tree upload buffer

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

//多執行續
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();

//合併物件
var lodash = require("lodash");

//連結redis資料庫配置
var redis = require('redis'),
	RDS_PORT = 6379,			//port
	RDS_HOST = '127.0.0.1',		//IP
	RDS_PWD = '0921836780',		//password
	RDS_OPTS = {},
	client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

//確認密碼
//暫時不需要密碼
// client.auth(RDS_PWD, function (err) {
// 	if (!err)
// 		console.log('Redis password is correct.');
// });
//錯誤回報
client.on("error", function (err) {
	console.log("Redis error " + err);
});
//如果模板載入正確回報準備就緒
client.on('ready', function (err) {
	console.log('Redis ready.');
});
//連線成功回報
client.on('connect', function () {
	console.log('Redis client connected');
});
//有callback才執行
function runcallback(callback) {
	if (callback != undefined)
		callback();
}
//先開啟PDDATA檢測UUID是否正確後，將其他檔案開啟，安排一秒後執行載入redis。
function init_redis(callback) {
	fs.readFile(filepath, function (err, content) {
		if (err) {
			throw err;
		}
		xpdjobj = JSON.parse(content.toString());
		setuuid = xpdjobj.PDDATA.UUID;
		//redis儲存的uuid
		exports.setuuid = setuuid;
		exports.pdjobj = xpdjobj;
	});
	fs.readFile(filepath_jautocmd, function (err, content) {
		if (err) {
			throw err;
		}
		jautocmd = JSON.parse(content.toString());
		exports.jautocmd = jautocmd;
	});
	fs.readFile(filepath_keypd, function (err, content) {
		if (err) {
			throw err;
		}
		jkeypd = JSON.parse(content.toString());
		exports.jkeypd = jkeypd;
	});
	fs.readFile(filepath_keytab, function (err, content) {
		if (err) {
			throw err;
		}
		keytab = JSON.parse(content.toString());
		//exports.keytab = keytab;
	});
	setTimeout(function () {
		event.emit('load_redis_event', callback);
	}, 1000);
}

function jobjcopy(jobj) {
	return JSON.parse(JSON.stringify(jobj));
}
//物件下元素數量
function object_length(obj) {
	try {
		return Object.getOwnPropertyNames(obj).length;
	} catch (err) {
		return 0;
	}
}
//以路徑搜尋資料
function getobjdata(obj, arr) {
	let len = arr.length;
	if (len == 0)
		return undefined;
	var data = obj;
	for (let i = 0; i < len; i++) {
		if (data == undefined) {
			return undefined;
		}
		data = data[arr[i]];
	}
	return data;
}
//搜尋到成員資料存進去
//判讀data是否為undefined是因為原先是直接執行data[arr[lendec]] = datain
//會有部分架構遺失
//如果是用lodash.merge是合併架構，不會有架構遺失問題
function setobjdata(obj, arr, datain) {
	let len = arr.length;
	if (len == 0)
		return;
	var data = obj;
	let lendec = len - 1;
	for (let i = 0; i < lendec; i++) {
		// if (data == undefined) {
		// 	data = {};
		// }
		data = data[arr[i]];
	}
	// if (data == undefined) {
	// 	data = {};
	// }
	// if (data[arr[lendec]] == undefined) {
	// 	data[arr[lendec]] = {};
	// }
	if (typeof data[arr[lendec]] == "object") {
		lodash.merge(data[arr[lendec]], datain);
	} else {
		data[arr[lendec]] = datain;
	}
}
//雖然是載入但是會先判斷redis是否有資料
//最開始會先給10次判斷每次一秒的檔案是否讀取好，否則直接結束。
var load_redis_event_count = 0;
event.on('load_redis_event', function (callback) {
	if (object_length(xpdjobj) == 0 || object_length(jautocmd) == 0 ||
		object_length(jkeypd) == 0 || object_length(keytab) == 0) {
		load_redis_event_count++;
		if (load_redis_event_count < 10) {
			setTimeout(function () {
				event.emit('load_redis_event', callback);
			}, 1000);
		} else {
			console.log('Read file error!');
		}
		return;
	}
	client.keys('*', function (err, arr) {
		if (err) {
			console.log('Redis load error:' + err);
			return;
		}
		let uuidseat = arr.indexOf(setuuid);
		if (uuidseat != -1) {
			arr.splice(uuidseat, 1);
		}
		if (arr.length != 0) {
			client.del(arr, function (err) {
				if (err) {
					console.log('Redis delete error:' + err);
					return;
				}
			});
		}
		client.hgetall(setuuid, function (err, obj) {
			if (err) {
				console.log('Redis load error:' + err);
				return;
			}
			if (object_length(obj) == 0) {
				console.log('Save buffer to redis.');
				for (key in keytab) {
					let keyelement = keytab[key];
					let keydata;
					switch (keyelement.file) {
						case filefirstname:
							keydata = getobjdata(xpdjobj, keyelement.path);
							break;
						case filefirstname_jautocmd:
							keydata = getobjdata(jautocmd, keyelement.path);
							break;
						case filefirstname_keypd:
							keydata = getobjdata(jkeypd, keyelement.path);
							break;
						default:
							break;
					}
					if (keydata == undefined) {
						continue;
					}
					keydata = jobjcopy(keydata);
					let len = keyelement.sub.length;
					for (let i = 0; i < len; i++) {
						delete keydata[keyelement.sub[i]];
					}
					//統一加上JSON.stringify，減少判斷上的麻煩。
					client.hset(setuuid, key, JSON.stringify(keydata));
				}
			} else {
				console.log('Load redis to buffer.')
				for (key in keytab) {
					let keyelement = keytab[key];
					let keydata = JSON.parse(obj[key]);
					switch (keyelement.file) {
						case filefirstname:
							setobjdata(xpdjobj, keyelement.path, keydata);
							break;
						case filefirstname_jautocmd:
							setobjdata(jautocmd, keyelement.path, keydata);
							break;
						case filefirstname_keypd:
							setobjdata(jkeypd, keyelement.path, keydata);
							break;
						default:
							break;
					}
				}
			}
			runcallback(callback);
		});
	});
});
function load_redis(objpath, callback) {
	let objpatharr = objpath.replace(/[\[\]\"\']/g, ".").replace(/\.+/g, ".").split(".");
	//replace的第一個參數google搜尋正規表示式
	//先將中括弧和雙引號和單引號統一改成小數點，再將多個連續小數點改成一個小數點，最後以小數點分割成陣列
	//檢測是否以物件名稱呼叫，如果是轉成檔案名稱。
	switch (objpatharr[0]) {
		case 'pdjobj':
			objpatharr[0] = filefirstname;
			break;
		case 'jautocmd':
			objpatharr[0] = filefirstname_jautocmd;
			break;
		case 'jkeypd':
			objpatharr[0] = filefirstname_keypd;
			break;
		default:
			break;
	}
	let len = objpatharr.length;
	console.log('load_redis objpatharr length = ' + len);
	if (len == 1) {
		console.log('load_redis if (len == 1) {');
		console.log('load_redis' + objpatharr[0]);
		switch (objpatharr[0]) { //因為要完全確定load才能callback，所以串成單一執行續
			case filefirstname: {
				console.log('load_redis buffer filefirstname');
				let keyarr = [];
				for (let key in keytab) {
					let keyelement = keytab[key];
					if (keyelement.file == filefirstname) {
						keyarr.push(key);
					}
				}
				let nextget = function () {
					if (keyarr.length == 0) {
						runcallback(callback);
						return;
					}
					let key = keyarr.shift();
					let keyelement = keytab[key];
					client.hget(setuuid, key, function (err, keydata) {
						if (err) {
							console.log('Load error key=' + key);
							return;
						}
						setobjdata(xpdjobj, keyelement.path, keydata);
						nextget();
					});
				};
				nextget();
				break;
			}
			case filefirstname_jautocmd: {
				console.log('load_redis buffer filefirstname_jautocmd');
				let keyarr = [];
				for (let key in keytab) {
					let keyelement = keytab[key];
					if (keyelement.file == filefirstname_jautocmd) {
						keyarr.push(key);
					}
				}
				let nextget = function () {
					if (keyarr.length == 0) {
						runcallback(callback);
						return;
					}
					let key = keyarr.shift();
					let keyelement = keytab[key];
					client.hget(setuuid, key, function (err, keydata) {
						if (err) {
							console.log('Load error key=' + key);
							return;
						}
						setobjdata(jautocmd, keyelement.path, keydata);
						nextget();
					});
				};
				nextget();
				break;
			}
			case filefirstname_keypd: {
				console.log('load_redis buffer filefirstname_keypd');
				let keyarr = [];
				for (let key in keytab) {
					let keyelement = keytab[key];
					if (keyelement.file == filefirstname_keypd) {
						keyarr.push(key);
					}
				}
				let nextget = function () {
					if (keyarr.length == 0) {
						runcallback(callback);
						return;
					}
					let key = keyarr.shift();
					let keyelement = keytab[key];
					client.hget(setuuid, key, function (err, keydata) {
						if (err) {
							console.log('Load error key=' + key);
							return;
						}
						setobjdata(jkeypd, keyelement.path, keydata);
						nextget();
					});
				};
				nextget();
				break;
			}
			default:
				break;
		}
		console.log('Redis a buffer load...');
		return;
	}
	for (let i = len; i > 0; i--) {
		let key = objpatharr.slice(0, i).join("#");
		if (key in keytab) {
			client.hget(setuuid, key, function (err, res) {
				if (err) {
					console.log("Redis load error.  Key=" + key + " Path=" + objpath);
					return;
				}
				console.log("Redis load success.  Key=" + key + " Path=" + objpath);
				let keyelement = keytab[key];
				let keydata = JSON.parse(res);
				switch (keyelement.file) {
					case filefirstname:
						setobjdata(xpdjobj, keyelement.path, keydata);
						break;
					case filefirstname_jautocmd:
						setobjdata(jautocmd, keyelement.path, keydata);
						break;
					case filefirstname_keypd:
						setobjdata(jkeypd, keyelement.path, keydata);
						break;
					default:
						break;
				}
				runcallback(callback);
			});
			return;
		}
	}
	console.log("Redis load error. Path=" + objpath);
}
//將buffer的資料儲存自redis
function update_redis(objpath, callback) {
	runcallback(callback);
	let objpatharr = objpath.replace(/[\[\]\"\']/g, ".").replace(/\.+/g, ".").split(".");
	//replace的第一個參數google搜尋正規表示式
	//先將中括弧和雙引號和單引號統一改成小數點，再將多個連續小數點改成一個小數點，最後以小數點分割成陣列
	//檢測是否以物件名稱呼叫，如果是轉成檔案名稱。
	switch (objpatharr[0]) {
		case 'pdjobj':
			objpatharr[0] = filefirstname;
			break;
		case 'jautocmd':
			objpatharr[0] = filefirstname_jautocmd;
			break;
		case 'jkeypd':
			objpatharr[0] = filefirstname_keypd;
			break;
		default:
			break;
	}
	//從全部串接慢慢地變成減少最後面一層愈串愈少
	let len = objpatharr.length;
	console.log('update_redis objpatharr length = ' + len);
	if (len == 1) {
		console.log('update_redis if (len == 1) {');
		console.log('update_redis' + objpatharr[0]);
		switch (objpatharr[0]) {
			case filefirstname:
				console.log('update_redis buffer filefirstname');
				for (let key in keytab) {
					let keyelement = keytab[key];
					let keydata;
					if (keyelement.file == filefirstname) {
						keydata = getobjdata(xpdjobj, keyelement.path);
						if (keydata == undefined) {
							continue;
						}
						keydata = jobjcopy(keydata);
						let len = keyelement.sub.length;
						for (let i = 0; i < len; i++) {
							delete keydata[keyelement.sub[i]];
						}
						//統一加上JSON.stringify，減少判斷上的麻煩。
						client.hset(setuuid, key, JSON.stringify(keydata));
					}
				}
				break;
			case filefirstname_jautocmd:
				console.log('update_redis buffer filefirstname_jautocmd');
				for (let key in keytab) {
					let keyelement = keytab[key];
					let keydata;
					if (keyelement.file == filefirstname_jautocmd) {
						keydata = getobjdata(jautocmd, keyelement.path);
						if (keydata == undefined) {
							continue;
						}
						keydata = jobjcopy(keydata);
						let len = keyelement.sub.length;
						for (let i = 0; i < len; i++) {
							delete keydata[keyelement.sub[i]];
						}
						//統一加上JSON.stringify，減少判斷上的麻煩。
						client.hset(setuuid, key, JSON.stringify(keydata));
					}
				}
				break;
			case filefirstname_keypd:
				console.log('update_redis buffer filefirstname_keypd');
				for (let key in keytab) {
					let keyelement = keytab[key];
					let keydata;
					if (keyelement.file == filefirstname_keypd) {
						keydata = getobjdata(jkeypd, keyelement.path);
						if (keydata == undefined) {
							continue;
						}
						keydata = jobjcopy(keydata);
						let len = keyelement.sub.length;
						for (let i = 0; i < len; i++) {
							delete keydata[keyelement.sub[i]];
						}
						//統一加上JSON.stringify，減少判斷上的麻煩。
						client.hset(setuuid, key, JSON.stringify(keydata));
					}
				}
				break;
			default:
				break;
		}
		console.log('Redis a buffer update...');
		return;
	}
	for (let i = len; i > 0; i--) {
		let key = objpatharr.slice(0, i).join("#");
		if (key in keytab) {
			let keyelement = keytab[key];
			let keydata;
			switch (keyelement.file) {
				case filefirstname:
					keydata = getobjdata(xpdjobj, keyelement.path);
					break;
				case filefirstname_jautocmd:
					keydata = getobjdata(jautocmd, keyelement.path);
					break;
				case filefirstname_keypd:
					keydata = getobjdata(jkeypd, keyelement.path);
					break;
				default:
					break;
			}
			if (keydata == undefined) {
				break;
			}
			keydata = jobjcopy(keydata);
			let len = keyelement.sub.length;
			for (let i = 0; i < len; i++) {
				delete keydata[keyelement.sub[i]];
			}
			//統一加上JSON.stringify，減少判斷上的麻煩。
			client.hset(setuuid, key, JSON.stringify(keydata), function (err) {
				if (err) {
					console.log("Update redis error. Key=" + key + " Path=" + objpath);
					return;
				}
				console.log("Update redis success. Key=" + key + " Path=" + objpath);
			});
			return;
		}
	}
	console.log("Update redis error. Path=" + objpath);
}

function clear_redis(uuid, callback) {
	runcallback(callback);
	client.del(uuid, function (err) {
		if (err) {
			console.log("Clear redis error! " + err);
			return;
		}
		console.log("Clear redis success. UUID = " + uuid);
	});
}
function show_all_keys_redis(callback) {
	runcallback(callback);
	client.keys('*', function (err, arr) {
		if (err) {
			console.log("Show all keys redis error! " + err);
			return;
		}
		console.log('Redis keys = ' + arr);
	});
}
exports.init_redis = init_redis;
exports.load_redis = load_redis;
exports.update_redis = update_redis;

exports.clear_redis = clear_redis;
exports.show_all_keys_redis = show_all_keys_redis;
