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
	let filename = 'http://192.168.5.230:3500/LOADDATA?DATATYPE=DOSE';
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let temp = '<tr><td colspan="10">加藥馬達狀態監控'
				+ '</td></tr>'
				+ '<tr><td>'
				+ '</td><td colspan="5">狀態'
				+ '</td><td colspan="4">加藥馬達'
				+ '</td></tr>'
				+ '<tr><td>時間'
				+ '</td><td>DOSE'
				+ '</td><td>DOSEA'
				+ '</td><td>DOSEB'
				+ '</td><td>DOSEC'
				+ '</td><td>DOSED'
				+ '</td><td>DOSEA'
				+ '</td><td>DOSEB'
				+ '</td><td>DOSEC'
				+ '</td><td>DOSED'
				+ '</td></tr>';
			console.log(this.responseText);
			let buffer = JSON.parse(this.responseText);
			let keyarr = Object.keys(buffer).sort();
			for (let i = 0; i < keyarr.length; i++) {
				let it = keyarr[i];
				temp += '<tr><td>' + it
					+ '</td><td>' + (buffer[it].STATU ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].STATUA ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].STATUB ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].STATUC ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].STATUD ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].PUMPA ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].PUMPB ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].PUMPC ? 'ON' : 'OFF')
					+ '</td><td>' + (buffer[it].PUMPD ? 'ON' : 'OFF')
					+ '</td></tr>';
			}
			loopdata.innerHTML = temp;
		}
	};
	xhttp.open("GET", filename);
	xhttp.send();
};