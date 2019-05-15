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
	let filename = 'http://192.168.5.230:3500/LOADDATA?DATATYPE=TM';
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let temp = '<tr><td colspan="5">溫控流程監控'
				+ '</td><td colspan="3">內溫度'
				+ '</td><td>'
				+ '</td><td colspan="4">LED開關'
				+ '</td><td colspan="4">LED亮度'
				+ '</td><td colspan="4">排風扇'
				+ '</td><td colspan="3">'
				+ '</td><td colspan="2">水溫'
				+ '</td></tr>'
				+ '<tr><td>時間'
				+ '</td><td>開關'
				+ '</td><td>狀態基'
				+ '</td><td>延遲計數器'
				+ '</td><td>模式紀錄'
				+ '</td><td>H002'
				+ '</td><td>H004'
				+ '</td><td>H005'
				+ '</td><td>外溫度'
				+ '</td><td>A白'
				+ '</td><td>A紅'
				+ '</td><td>B白'
				+ '</td><td>B紅'
				+ '</td><td>A白'
				+ '</td><td>A紅'
				+ '</td><td>B白'
				+ '</td><td>B紅'
				+ '</td><td>1'
				+ '</td><td>2'
				+ '</td><td>3'
				+ '</td><td>4'
				+ '</td><td>空調'
				+ '</td><td>冷水機'
				+ '</td><td>熱水機'
				+ '</td><td>清水'
				+ '</td><td>肥水'
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
					+ '</td><td>' + buffer[it].INSTCODEALL
					+ '</td><td>' + buffer[it].H002 / 10
					+ '</td><td>' + buffer[it].H004 / 10
					+ '</td><td>' + buffer[it].H005 / 10
					+ '</td><td>' + buffer[it].E002 / 10
					+ '</td><td>' + (buffer[it].LEDSAW ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].LEDSAR ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].LEDSBW ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].LEDSBR ? 'ON' : 'OFF')
					+ '</td><td>' + (100 - Number(paddingLeft(buffer[it].LEDAW, 6).substr(4, 2)))
					+ '</td><td>' + (100 - Number(paddingLeft(buffer[it].LEDAR, 6).substr(4, 2)))
					+ '</td><td>' + (100 - Number(paddingLeft(buffer[it].LEDBW, 6).substr(4, 2)))
					+ '</td><td>' + (100 - Number(paddingLeft(buffer[it].LEDBR, 6).substr(4, 2)))
					+ '</td><td>' + (buffer[it].FAN1 ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].FAN2 ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].FAN3 ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].FAN4 ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].AIR ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].COOL ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].HOT ? 'ON' : 'OFF')
					+ '</td><td>' + buffer[it].H010 / 10
					+ '</td><td>' + buffer[it].H011 / 10
					+ '</td></tr>';
			}
			loopdata.innerHTML = temp;
		}
	};
	xhttp.open("GET", filename);
	xhttp.send();
};