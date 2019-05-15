function paddingLeft(str, lenght) {
	str = str + "";
	if (str.length >= lenght)
		return str;
	else
		return paddingLeft("0" + str, lenght);
}
function paddingRight(str, lenght) {
	str = str + "";
	if (str.length >= lenght)
		return str;
	else
		return paddingRight(str + "0", lenght);
}

window.onload = function () {
	let filename = 'http://192.168.5.230:3500/LOADDATA?DATATYPE=ECPH';
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let temp = '<tr><td colspan="4">ECPH檢測流程監控'
				+ '</td><td colspan="2">'
				+ '</td><td colspan="2">水位'
				+ '</td></tr>'
				+ '<tr><td>時間'
				+ '</td><td>開關'
				+ '</td><td>狀態基'
				+ '</td><td>延遲計數器'
				+ '</td><td>馬達'
				+ '</td><td>三通閥'
				+ '</td><td>清水'
				+ '</td><td>養液'
				+ '</td></tr>';
			console.log(this.responseText);
			let buffer = JSON.parse(this.responseText);
			let keyarr = Object.keys(buffer).sort();
			for (let i = 0; i < keyarr.length; i++) {
				let it = keyarr[i];
				temp += '<tr><td>' + it
					+ '</td><td>' + (buffer[it].STATU ? 'ON' : 'OFF')
					+ '</td><td>' + buffer[it].SENSOR_CONTROL
					+ '</td><td>' + buffer[it].WAIT1
					+ '</td><td>' + (buffer[it].PUMP ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].TWA ? '養液' : '清水')
					+ '</td><td>' + buffer[it].CWLEVEL
					+ '</td><td>' + buffer[it].FWLEVEL
					+ '</td></tr>';
			}
			loopdata.innerHTML = temp;
		}
	};
	xhttp.open("GET", filename);
	xhttp.send();
};