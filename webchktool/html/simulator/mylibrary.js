function paddingLeft(str, lenght) {
	str += '';
	if (str.length >= lenght)
		return str;
	else
		return paddingLeft("0" + str, lenght);
}

function sendaapicmd(obj) {
	for (let it in obj) {
		let apicmd = 'http://192.168.1.112:3000/'
			+ obj[it].CMD
			+ '?UUID=' + UUID.value
			+ '&Action=' + obj[it].Action
			+ '&POS=' + obj[it].POS
			+ '&STU=' + obj[it].STU
			+ '&GROUP=' + obj[it].GROUP;
		let xhttp = new XMLHttpRequest();
		// xhttp.onreadystatechange = function () {
		// 	if (this.readyState == 4 && this.status == 200) {
		// 		console.log(this.responseText);
		// 	}
		// };
		xhttp.open("GET", apicmd, true);
		xhttp.send();
	}
}
function sendurl(url) {
	let xhttp = new XMLHttpRequest();
	// xhttp.onreadystatechange = function () {
	// 	if (this.readyState == 4 && this.status == 200) {
	// 		console.log(this.responseText);
	// 	}
	// };
	xhttp.open("GET", url, true);
	xhttp.send();
}

function url2array() {
	var arr = [];
	var strUrl = location.search;
	if (strUrl.indexOf('?') != -1) {
		var allData = strUrl.split("?")[1].split("&");
		for (var i = 0; i < allData.length; i++) {
			var data = allData[i].split("=");
			arr[data[0]] = decodeURIComponent(data[1]);
		}
	}
	return arr;
}
function array2url(arr) {
	var allData = [];
	for (var i in arr) {
		allData.push(i + '=' + encodeURIComponent(arr[i]));
	}
	var strUrl = allData.length != 0 ? ('?' + allData.join('&')) : '';
	var url = location.href.split('?')[0];
	window.history.pushState({}, 0, url + strUrl + location.hash);
}

function generator(genfunc) {
    var g = genfunc();

    function next() {
        let res = g.next();
        if (!res.done) {
            if (typeof res.value.argsfront != 'object') res.value.argsfront = [];
            if (typeof res.value.argsback != 'object') res.value.argsback = [];
            res.value.nextfunc(...res.value.argsfront, function (...args) {
                res.value.cbfunc(...args);
                next();
            }, ...res.value.argsback);
        }
    }
    next();
}