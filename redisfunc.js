//模板載入並宣告變數與物件
var redis = require('redis'),
	RDS_PORT = 6379,			//port
	RDS_HOST = '127.0.0.1',		//IP
	RDS_PWD = '0921836780',		//password
	RDS_OPTS = {},
	client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

//確認密碼
client.auth(RDS_PWD, function (err) {
	if (!err)
		console.log('Redis password is correct.');
});
//錯誤回報
client.on("error", function (err) {
	console.log("Redis error " + err);
});
//如果模板載入正確回報準備就緒
client.on('ready', function (err) {
	console.log('Redis ready.');
});

var uuid = 'OFA1C002DC0E7105AD6A2886';
//key 表格
var keytab = {
	"PDDATA": [
		"PDDATA",
		"addposmap",
		"subcmd",
		"CMDDATA"
	],
	"KEYPD": [
		"KEYVER",
		"KEYPADCOUNT",
		"KEYLIB",
		"DEVLIB"
	],
	"JAUTOCMD": [
		"AUTOSN",
		"DEVLIST",
		"ALARMCHECK",
		"DEVICESET",
		"SENSORCHECK",
		"DEFAUTOLIST",
		"LIMITPAM",
		"WATERLOOP",
		"PWMOFFBACKUP",
		"SENSORAUTO",
		"EVENTID"
	],
	"Devtab": [
		"ESCAN",
		"E001",
		"E002",
		"A001",
		"A002",
		"A003",
		"A004",
		"A005",
		"A006",
		"A007",
		"A008",
		"A009",
		"A00A",
		"A00B",
		"A00C",
		"A00D",
		"A021",
		"A022",
		"A023",
		"A024",
		"A025",
		"A026",
		"A027",
		"A028",
		"A029",
		"A02A",
		"A02B",
		"A02C",
		"A02D",
		"B001",
		"B002",
		"B003",
		"B004",
		"B005",
		"B006",
		"B007",
		"B008",
		"B009",
		"B00A",
		"B00B",
		"B00C",
		"B00D",
		"B00E",
		"B00F",
		"B010",
		"C001",
		"C002",
		"C003",
		"C004",
		"C005",
		"C006",
		"C007",
		"D001",
		"D002",
		"D003",
		"D004",
		"D005",
		"D006",
		"D007",
		"D008",
		"D009",
		"D00A",
		"D00B",
		"D00C",
		"F001",
		"F002",
		"F003",
		"F004",
		"F005",
		"F006",
		"F007",
		"F008",
		"G001",
		"G002",
		"G003",
		"G004",
		"G005",
		"G006",
		"G007",
		"G008",
		"G009",
		"G010",
		"G011",
		"B101",
		"B102",
		"B103",
		"B104",
		"B105",
		"B106",
		"B107",
		"B108",
		"B109",
		"B10A",
		"B10B",
		"B10C",
		"B10D",
		"B10E",
		"B10F",
		"B110",
		"B111",
		"B112",
		"B113",
		"B114",
		"B115",
		"H001",
		"H002",
		"H003",
		"H004",
		"H005",
		"H006",
		"K001",
		"R001",
		"R002",
		"J000",
		"J001",
		"J002",
		"J003",
		"J004",
		"J005",
		"J006",
		"J007"
	],
	"DEVLIST": [
		"GROWLED",
		"CYCLEFAN",
		"SPRAY",
		"REFRESH",
		"UV",
		"PUMP",
		"GROWUPDOWN",
		"AIRCON",
		"AIRRH",
		"WATERTM",
		"CO2",
		"OPWAVE",
		"DOSE",
		"LEDHI",
		"LEDLOW",
		"LISTREFFAN",
		"ECDOSE",
		"PHDOSE",
		"DOSEA",
		"DOSEB",
		"DOSEC",
		"DOSED"
	],
	"DEFAUTOLIST": [
		"GROWLED",
		"CYCLEFAN",
		"SPRAY",
		"REFRESH",
		"UV",
		"PUMP",
		"GROWUPDOWN",
		"AIRCON",
		"AIRRH",
		"WATERTM",
		"CO2",
		"OPWAVE",
		"DOSE",
		"LEDHI",
		"LEDLOW",
		"LISTREFFAN",
		"ECDOSE",
		"PHDOSE",
		"DOSEA",
		"DOSEB",
		"DOSEC",
		"DOSED"
	],
	"ALARMCHECK": [
		"am1001",
		"am1002",
		"am1003",
		"am1004",
		"am1005",
		"am1006",
		"am1007",
		"am1008",
		"am1009",
		"am1010",
		"am1011",
		"am1012",
		"am1013",
		"am1014",
		"am1015",
		"am1016",
		"am1017",
		"am1018",
		"am1019",
		"am1020",
		"am1021",
		"am1022",
		"am2001",
		"am2002",
		"am2003",
		"am2004",
		"am2005",
		"am2006",
		"am2007",
		"am2008",
		"am2009",
		"am2010",
		"am2011",
		"am2012"
	],
	"KEYLIB": [
		"K001",
		"K002",
		"K003",
		"K004",
		"K005",
		"K006",
		"K007",
		"K008",
		"K009",
		"K010",
		"K011",
		"K012",
		"K013",
		"K014",
		"K015",
		"K016",
		"K017",
		"K018",
		"K019",
		"K020",
		"K021",
		"K022",
		"K023",
		"K091",
		"K092",
		"K093",
		"K094",
		"K095",
		"K096",
		"K097",
		"K098",
		"K099",
		"K09A",
		"K09B",
		"K025",
		"K027",
		"K029",
		"K02B",
		"K02D",
		"K02F",
		"K031",
		"K033",
		"K035",
		"K037",
		"K039",
		"K03B",
		"K03D",
		"K042",
		"K043",
		"K044",
		"K045",
		"K046",
		"K047",
		"K048",
		"K049",
		"K04A",
		"K04F",
		"K051",
		"K053",
		"K055",
		"K057",
		"K059",
		"K05B",
		"K05D",
		"K05F",
		"K061",
		"K063",
		"K065",
		"K067"
	]
};
//從redis將資料載入到buffer
//mainkey:主key為keytab的第1層
//buffer:要載入的物件
function load_redis(mainkey, buffer, callback) {
	var count = 0;
	if (mainkey in keytab === false) {
		console.log("Mainkey error. Key table don't " + mainkey + ".");
		return;
	}
	var keyarr = keytab[mainkey];
	var nextkey = function (err, res) {
		if (err) {
			console.log('Redis load error:' + err);
			return;
		}
		buffer[keyarr[count]] = JSON.parse(res);
		count++;
		if (count < keyarr.length) {
			client.hget(uuid, mainkey + '#' + keyarr[count], nextkey);
		} else {
			if (typeof callback != 'undefined') {
				callback();
			}
		}
	};
	client.hget(uuid, mainkey + '#' + keyarr[count], nextkey);
}
//將buffer的資料儲存自redis
//mainkey:主key為keytab的第1層
//sonkey:子key為keytab的第2層，可以不用輸入
//buffer:要載入的物件
function update_redis(mainkey, sonkey, buffer, callback) {
	if (mainkey in keytab === false) {
		console.log("Mainkey error. Key table don't " + mainkey + ".");
		return;
	}
	var keyarr = keytab[mainkey];
	if (typeof sonkey != 'string') {
		callback = buffer;
		buffer = sonkey;

		var count = 0;
		var nextkey = function (err, res) {
			if (err) {
				console.log('Redis updata error:' + err);
				return;
			}
			count++;
			if (count < keyarr.length) {
				client.hset(uuid, mainkey + '#' + keyarr[count], JSON.stringify(buffer[keyarr[count]]), nextkey);
			} else {
				if (typeof callback != 'undefined') {
					callback();
				}
			}
		};
		client.hset(uuid, mainkey + '#' + keyarr[count], JSON.stringify(buffer[keyarr[count]]), nextkey);
	} else {
		if (sonkey in keyarr === false) {
			console.log("Sonkey error. " + mainkey + " table don't " + sonkey + ".");
			return;
		}
		client.hset(uuid, mainkey + '#' + sonkey, JSON.stringify(buffer[sonkey]), function (err) {
			if (err) {
				console.log('Redis updata error:' + err);
				return;
			}
			if (typeof callback != 'undefined') {
				callback();
			}
		});
	}
}
exports.uuid = uuid;
exports.load_redis = load_redis;
exports.update_redis = update_redis;
