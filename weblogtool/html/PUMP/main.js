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
	let filename = 'http://192.168.5.230:3500/LOADDATA?DATATYPE=PUMP';
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let temp = '<tr><td colspan="4">打水流程監控'
				+ '</td><td colspan="2">水位'
				+ '</td><td colspan="2">打水馬達'
				+ '</td><td colspan="2">三通閥A1'
				+ '</td><td colspan="2">三通閥A2'
				+ '</td><td colspan="2">三通閥A3'
				+ '</td><td colspan="2">三通閥B1'
				+ '</td><td colspan="2">三通閥B2'
				+ '</td><td colspan="2">三通閥B3'
				+ '</td></tr>'
				+ '<tr><td>時間'
				+ '</td><td>開關'
				+ '</td><td>狀態基'
				+ '</td><td>延遲計數器'
				+ '</td><td>清水'
				+ '</td><td>養液'
				+ '</td><td>清水'
				+ '</td><td>養液'
				+ '</td><td>清肥'
				+ '</td><td>流噴'
				+ '</td><td>清肥'
				+ '</td><td>流噴'
				+ '</td><td>清肥'
				+ '</td><td>流噴'
				+ '</td><td>清肥'
				+ '</td><td>流噴'
				+ '</td><td>清肥'
				+ '</td><td>流噴'
				+ '</td><td>清肥'
				+ '</td><td>流噴'
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
					+ '</td><td>' + buffer[it].CWLEVEL
					+ '</td><td>' + buffer[it].FWLEVEL
					+ '</td><td>' + (buffer[it].CWPUMP ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].FWPUMP ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].CFA1 ? '養液' : '清水')
					+ '</td><td>' + (buffer[it].FPA1 ? '噴霧' : '流水')
					+ '</td><td>' + (buffer[it].CFA2 ? '養液' : '清水')
					+ '</td><td>' + (buffer[it].FPA2 ? '噴霧' : '流水')
					+ '</td><td>' + (buffer[it].CFA3 ? '養液' : '清水')
					+ '</td><td>' + (buffer[it].FPA3 ? '噴霧' : '流水')
					+ '</td><td>' + (buffer[it].CFB1 ? '養液' : '清水')
					+ '</td><td>' + (buffer[it].FPB1 ? '噴霧' : '流水')
					+ '</td><td>' + (buffer[it].CFB2 ? '養液' : '清水')
					+ '</td><td>' + (buffer[it].FPB2 ? '噴霧' : '流水')
					+ '</td><td>' + (buffer[it].CFB3 ? '養液' : '清水')
					+ '</td><td>' + (buffer[it].FPB3 ? '噴霧' : '流水')
					+ '</td></tr>';
			}
			loopdata.innerHTML = temp;
		}
	};
	xhttp.open("GET", filename);
	xhttp.send();
};