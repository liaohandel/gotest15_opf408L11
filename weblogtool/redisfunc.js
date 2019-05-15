//檔案讀取檔名路徑配置
//模板載入並宣告變數與物件
var fs = require('fs');
var path = require('path');
var setuuid = '1234567890abcdefghijk';

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

exports.clear_redis = clear_redis;
exports.show_all_keys_redis = show_all_keys_redis;

exports.client = client;