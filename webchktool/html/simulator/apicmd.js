var apicmd = {
	"loadcheck": {
		"mod": "url",
		"name": "從感應器讀取資料到樹莓派(3in1 & 水位 & 水溫)",
		"keyname": "強制讀取",
		"url": "http://192.168.1.112:3000/loadcheck"
	},
	"typecheck": {
		"mod": "url",
		"name": "將感應器讀取的資料上傳到IPC和伺服器(3in1 & 水位 & 水溫 & EC & pH)",
		"keyname": "強制傳送",
		"url": "http://192.168.1.112:3000/typecheck"
	},
	"ELECTRONS": {
		"mod": "cmd",
		"name": "從EC感應器讀取資料到樹莓派",
		"keyname": "強制讀取",
		"cmd": { "CMD": "ELECTRONS", "POS": "E002", "Action": "LOAD", "STU": "940000", "GROUP": "00" }
	},
	"PH": {
		"mod": "cmd",
		"name": "從pH感應器讀取資料到樹莓派",
		"keyname": "強制讀取",
		"cmd": { "CMD": "PH", "POS": "E002", "Action": "LOAD", "STU": "930000", "GROUP": "00" }
	}
};