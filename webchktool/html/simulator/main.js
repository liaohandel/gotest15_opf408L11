var socket = io.connect();
var UUID = { value: 0 };
socket.on('message', function (data) {
	let cmd = data.CMD;
	let pos = data.POS;
	let subcmd = data.Action;
	let stu = data.STU;
	let subkey;
	let vlu;
	let group = data.GROUP;

	if (cmd != 'UUID') {
		subkey = stu.substr(0, 2);
		vlu = stu.substr(2, 4);
		if (!(pos in devtab)) return;
		if (!(cmd in cmdtab)) return;
		if (!(cmd in devtab[pos])) return;

		if (!(subcmd in subcmdtab)) return;
		if (!(subkey in devtab[pos][cmd])) return;
	}

	let stunamearr = [pos, cmd, 'stu', 'R' + subkey];
	let stuname = '';
	let stuname2 = '';

	let obj = { "CMD": "WATERLEVEL", "POS": "E002", "Action": "SET", "STU": "000000", "GROUP": "00" };
	obj.POS = pos;
	obj.CMD = cmd;

	switch (cmd) {
		case 'PUMP':
			if (Number(subkey) >= 0 && Number(subkey) <= 2) {
				stuname = [pos, cmd, 'act', 'R' + '00'].join('_');
				switch (subkey) {
					case '00':
						window[stuname].style.backgroundColor = '#0ff';
						window[stuname].innerHTML = '絕對';
						break;
					case '01':
						window[stuname].style.backgroundColor = '#f0f';
						window[stuname].innerHTML = '下降';
						break;
					case '02':
						window[stuname].style.backgroundColor = '#ff0';
						window[stuname].innerHTML = '上升';
						break;
					default:
						break;
				}
				stuname = [pos, cmd, 'stu', 'R' + '00'].join('_');
				window[stuname].innerHTML = 100 - Number('0x' + stu.substr(4, 2));
			} else if (pos == 'E003') {
				stuname = [pos, cmd, 'stu', 'R' + subkey].join('_');
				if (devtab.E003.PUMP[subkey].stu == 0) {
					switch (subcmd) {
						case 'ON':
							window[stuname].style.backgroundColor = '#0f0';
							window[stuname].innerHTML = '噴';
							break;
						case 'OFF':
							window[stuname].style.backgroundColor = '#fff';
							window[stuname].innerHTML = '流';
							break;
						default:
							break;
					}
				} else {
					switch (subcmd) {
						case 'ON':
							window[stuname].style.backgroundColor = '#0f0';
							window[stuname].innerHTML = '肥';
							break;
						case 'OFF':
							window[stuname].style.backgroundColor = '#fff';
							window[stuname].innerHTML = '清';
							break;
						default:
							break;
					}
				}
			} else {
				stuname = [pos, cmd, 'stu', 'R' + subkey].join('_');
				switch (subcmd) {
					case 'ON':
						window[stuname].style.backgroundColor = '#0f0';
						window[stuname].innerHTML = '開';
						break;
					case 'OFF':
						window[stuname].style.backgroundColor = '#fff';
						window[stuname].innerHTML = '關';
						break;
					default:
						break;
				}
			}
			break;
		case 'WATERLEVEL':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			stuname2 = [pos, cmd, 'stu', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'SET':
					if (vlu != '0000') {
						window[stuname].value = Number('0x' + vlu);
						window[stuname2].value = window[stuname].value / sensorvalue[cmd].div;
					} else {
						obj.Action = 'SET';
						obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
						socket.emit('client_data', obj);
					}
					break;
				case 'LOAD':
					obj.Action = 'SET';
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'TEMPERATURE':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			stuname2 = [pos, cmd, 'stu', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'SET':
					if (vlu != '0000') {
						window[stuname].value = Number('0x' + vlu);
						window[stuname2].value = window[stuname].value / sensorvalue[cmd].div;
					} else {
						obj.Action = 'SET';
						obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
						socket.emit('client_data', obj);
					}
					break;
				case 'LOAD':
					obj.Action = 'SET';
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'RH':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			stuname2 = [pos, cmd, 'stu', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'SET':
					if (vlu != '0000') {
						window[stuname].value = Number('0x' + vlu);
						window[stuname2].value = window[stuname].value / sensorvalue[cmd].div;
					} else {
						obj.Action = 'SET';
						obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
						socket.emit('client_data', obj);
					}
					break;
				case 'LOAD':
					obj.Action = 'SET';
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'CO2':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			stuname2 = [pos, cmd, 'stu', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'SET':
					if (vlu != '0000') {
						window[stuname].value = Number('0x' + vlu);
						window[stuname2].value = window[stuname].value / sensorvalue[cmd].div;
					} else {
						obj.Action = 'SET';
						obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
						socket.emit('client_data', obj);
					}
					break;
				case 'LOAD':
					obj.Action = 'SET';
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'ELECTRONS':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			stuname2 = [pos, cmd, 'stu', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'SET':
					if (vlu != '0000') {
						window[stuname].value = Number('0x' + vlu);
						window[stuname2].value = window[stuname].value / sensorvalue[cmd].div;
					} else {
						obj.Action = 'SET';
						obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
						socket.emit('client_data', obj);
					}
					break;
				case 'LOAD':
					obj.Action = 'SET';
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'PH':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			stuname2 = [pos, cmd, 'stu', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'SET':
					if (vlu != '0000') {
						window[stuname].value = Number('0x' + vlu);
						window[stuname2].value = window[stuname].value / sensorvalue[cmd].div;
					} else {
						obj.Action = 'SET';
						obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
						socket.emit('client_data', obj);
					}
					break;
				case 'LOAD':
					obj.Action = 'SET';
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'LED':
			stuname = [pos, cmd, 'stu', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'ON':
					window[stuname].style.backgroundColor = '#0f0';
					window[stuname].innerHTML = '開';
					break;
				case 'OFF':
					window[stuname].style.backgroundColor = '#fff';
					window[stuname].innerHTML = '關';
					break;
				default:
					break;
			}
			stuname = [pos, cmd, 'lum', 'R' + subkey].join('_');
			window[stuname].innerHTML = 100 - Number('0x' + stu.substr(4, 2));
			break;
		case 'AIRFAN':
			stuname = [pos, cmd, 'stu', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'ON':
					window[stuname].style.backgroundColor = '#0f0';
					window[stuname].innerHTML = '開';
					break;
				case 'OFF':
					window[stuname].style.backgroundColor = '#fff';
					window[stuname].innerHTML = '關';
					break;
				default:
					break;
			}
			stuname = [pos, cmd, 'ch', 'R' + subkey].join('_');
			switch (stu.substr(2, 2)) {
				case '00':
					window[stuname].style.backgroundColor = '#0f0';
					window[stuname].innerHTML = '自動';
					break;
				case '01':
					window[stuname].style.backgroundColor = '#77f';
					window[stuname].innerHTML = '冷氣';
					break;
				case '02':
					window[stuname].style.backgroundColor = '#f00';
					window[stuname].innerHTML = '暖氣';
					break;
				default:
					break;
			}
			stuname = [pos, cmd, 'tm', 'R' + subkey].join('_');
			window[stuname].innerHTML = Number('0x' + stu.substr(4, 2));
			break;
		case 'UUID':
			if (subcmd == 'SET') {
				UUID.value = stu;
				if (!isinit) {
					isinit = true;
					init();
				}
			}
			break;

		default:
			break;
	}
});

function buildsensor(stunamearr, sv) {
	let ss = '';
	let stuname = '';

	stunamearr[2] = 'sub';
	stuname = stunamearr.join('_');
	ss += '<input type="button" value="-' + sv.add / sv.div + '" id="' + stuname + '">';
	stunamearr[2] = 'dec';
	stuname = stunamearr.join('_');
	ss += '<input type="button" value="-' + sv.inc / sv.div + '" id="' + stuname + '">';
	stunamearr[2] = 'stu';
	stuname = stunamearr.join('_');
	ss += '<input type="text" value="' + sv.stu / sv.div + '" maxlength="' + sv.maxlength + '" id="' + stuname + '">';
	stunamearr[2] = 'inc';
	stuname = stunamearr.join('_');
	ss += '<input type="button" value="+' + sv.inc / sv.div + '" id="' + stuname + '">';
	stunamearr[2] = 'add';
	stuname = stunamearr.join('_');
	ss += '<input type="button" value="+' + sv.add / sv.div + '" id="' + stuname + '">';
	stunamearr[2] = 'range';
	stuname = stunamearr.join('_');
	ss += '<input type="range" value="' + sv.stu + '" min="' + sv.min + '" max="' + sv.max + '" id="' + stuname + '">';
	return ss;
}
function setsensor(stunamearr, sv, obj) {
	stunamearr[2] = 'sub';
	let stunamesub = stunamearr.join('_');
	stunamearr[2] = 'dec';
	let stunamedec = stunamearr.join('_');
	stunamearr[2] = 'stu';
	let stunamestu = stunamearr.join('_');
	stunamearr[2] = 'inc';
	let stunameinc = stunamearr.join('_');
	stunamearr[2] = 'add';
	let stunameadd = stunamearr.join('_');
	stunamearr[2] = 'range';
	let stunamerange = stunamearr.join('_');

	let it = stunamearr[3].substr(1, 2);
	obj.Action = 'LOAD';
	obj.STU = it + '0000';
	socket.emit('client_data', obj);

	let setss = function (test) {
		console.log(test);
		obj.Action = 'SET';
		obj.STU = it + paddingLeft((window[stunamerange].value * 1).toString(16), 4);
		socket.emit('client_data', obj);
	}
	window[stunamesub].onclick = function () {
		window[stunamerange].stepDown(sv.add);
		window[stunamestu].value = window[stunamerange].value / sv.div;
		setss('sub onclick');
	};
	window[stunamedec].onclick = function () {
		window[stunamerange].stepDown(sv.inc);
		window[stunamestu].value = window[stunamerange].value / sv.div;
		setss('dec onclick');
	};
	window[stunameinc].onclick = function () {
		window[stunamerange].stepUp(sv.inc);
		window[stunamestu].value = window[stunamerange].value / sv.div;
		setss('inc onclick');
	};
	window[stunameadd].onclick = function () {
		window[stunamerange].stepUp(sv.add);
		window[stunamestu].value = window[stunamerange].value / sv.div;
		setss('add onclick');
	};
	window[stunamerange].onmousedown = function () {
		window[stunamerange].onmousemove = function () {
			window[stunamestu].value = window[stunamerange].value / sv.div;
		};
	};
	window[stunamerange].onmouseup = function () {
		window[stunamerange].onmousemove = function () {
		};
	};
	window[stunamestu].onchange = function () {
		if (window[stunamestu].value < sv.min)
			window[stunamestu].value = sv.min;
		if (window[stunamestu].value > sv.max)
			window[stunamestu].value = sv.max;
		window[stunamerange].value = window[stunamestu].value * sv.div;
		setss('stu onchange');
	};
	window[stunamerange].onclick = function () {
		window[stunamestu].value = window[stunamerange].value / sv.div;
		setss('range onclick');
	};
}
function E002PUMP() {
	let keyarr = Object.keys(devtab.E002.PUMP).sort();

	let ssarr = [];
	for (let si = 0; si < 10; si++) {
		ssarr[si] = '<tr>';
	}
	for (let i = 0; i < keyarr.length; i++) {
		let it = keyarr[i];
		let si = Math.floor((i) % 10);
		ssarr[si] += '<td>' + 'R' + it
			+ '</td><td>' + devtab.E002.PUMP[it].name
			+ '</td><td id="E002_PUMP_stu_R' + it + '" style="width: 60px;">'
			+ '</td>';
	}
	let ss = '<tr><td colspan="4">E002繼電器</td></tr>';
	for (let si = 0; si < 10; si++) {
		ssarr[si] += '</tr>';
		ss += ssarr[si];
	}
	E002PUMPstatu.innerHTML += ss;
	for (let i = 0; i < keyarr.length; i++) {
		let it = keyarr[i];
		let obj = { "CMD": "PUMP", "POS": "E002", "Action": "LOAD", "STU": "000000", "GROUP": "00" };
		obj.STU = it + '0000';
		socket.emit('client_data', obj);
	}
}
function E002WATERLEVEL() {
	let keyarr = Object.keys(devtab.E002.WATERLEVEL).sort();
	let ss = '<tr><td colspan="4">水位感測器</td></tr>';
	for (let i = 0; i < keyarr.length; i++) {
		let it = keyarr[i];
		ss += '<tr>';
		ss += '<td>' + 'R' + it + '</td>';
		ss += '<td>' + devtab.E002.WATERLEVEL[it].name + '</td>';
		ss += '<td>' + buildsensor(['E002', 'WATERLEVEL', 'stu', 'R' + it], sensorvalue['WATERLEVEL']) + '</td>';
		ss += '</tr>';
	}
	E002WATERLEVELstatu.innerHTML += ss;
	for (let i = 0; i < keyarr.length; i++) {
		let it = keyarr[i];
		setsensor(['E002', 'WATERLEVEL', 'stu', 'R' + it], sensorvalue['WATERLEVEL'],
			{ "CMD": "WATERLEVEL", "POS": "E002", "Action": "LOAD", "STU": "000000", "GROUP": "00" });
	}
}
function TMRHCO2() {
	let devarr = Object.keys(devtab).sort();
	let ssall = '<tr><td colspan="3">溫溼度CO2</td></tr><tr><td>代號</td><td>功能</td><td>溫度(°C)</td><td>濕度(%)</td><td>CO2(ppm)</td></tr>';
	let sensor = ['TEMPERATURE', 'RH', 'CO2'];
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		let ss = '<tr><td>' + pos + '</td>'
			+ '<td>' + devtab[pos].name + '</td>';
		let b = false;
		for (let k = 0; k < sensor.length; k++) {
			if (sensor[k] in devtab[pos]) {
				b = true;
				ss += '<td>' + buildsensor([pos, sensor[k], 'stu', 'R' + Object.keys(devtab[pos][sensor[k]])[0]], sensorvalue[sensor[k]]) + '</td>';
			} else {
				ss += '<td></td>';
			}
		}
		ss += '</tr>';
		if (b) ssall += ss;
	}
	TMRHCO2statu.innerHTML += ssall;
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		for (let k = 0; k < sensor.length; k++) {
			if (sensor[k] in devtab[pos]) {
				setsensor([pos, sensor[k], 'stu', 'R' + Object.keys(devtab[pos][sensor[k]])[0]], sensorvalue[sensor[k]],
					{ "CMD": sensor[k], "POS": pos, "Action": "LOAD", "STU": "000000", "GROUP": "00" });
			}
		}
	}
}
function ECPH() {
	let sensor = ['ELECTRONS', 'PH'];
	let ss = '<tr><td colspan="4">EC & pH</td></tr>';
	for (let k = 0; k < sensor.length; k++) {
		let keyarr = Object.keys(devtab.E002[sensor[k]]).sort();
		let it = keyarr[0];
		ss += '<tr>';
		ss += '<td>' + 'R' + it + '</td>';
		ss += '<td>' + devtab.E002[sensor[k]][it].name + '</td>';
		ss += '<td>' + buildsensor(['E002', sensor[k], 'stu', 'R' + it], sensorvalue[sensor[k]]) + '</td>';
		ss += '<td>';
		let stuname = ['E002', sensor[k], 'api', 'R' + it].join('_');
		ss += '<input type="button" value="' + apicmd[sensor[k]].keyname + '" id="' + stuname + '" style="width:70px;">';
		ss += '</td>';
		ss += '</tr>';
	}
	ECPHstatu.innerHTML += ss;
	for (let k = 0; k < sensor.length; k++) {
		let keyarr = Object.keys(devtab.E002[sensor[k]]).sort();
		let it = keyarr[0];

		setsensor(['E002', sensor[k], 'stu', 'R' + it], sensorvalue[sensor[k]],
			{ "CMD": sensor[k], "POS": 'E002', "Action": "LOAD", "STU": "000000", "GROUP": "00" });

		let stuname = ['E002', sensor[k], 'api', 'R' + it].join('_');
		let acc = [apicmd[sensor[k]].cmd];
		window[stuname].onclick = function () {
			sendaapicmd(acc);
		};

	}
}
function LED() {
	let devarr = Object.keys(devtab).sort();
	let ssall = '<tr><td colspan="4">LED開關 & 亮度</td></tr><tr><td>代號</td><td>功能</td><td colspan="2">白光</td><td colspan="2">紅光</td></tr>';
	let color = ['22', '21'];
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		if (!('LED' in devtab[pos])) continue;
		let ss = '<tr><td>' + pos + '</td>'
			+ '<td>' + devtab[pos].name + '</td>';
		for (let k = 0; k < color.length; k++) {
			if (color[k] in devtab[pos]['LED']) {
				let stunamearr = [pos, 'LED', 'stu', 'R' + color[k]];
				let stuname = '';
				stunamearr[2] = 'stu'
				stuname = stunamearr.join('_');
				ss += '<td id="' + stuname + '"></td>';
				stunamearr[2] = 'lum'
				stuname = stunamearr.join('_');
				ss += '<td id="' + stuname + '"></td>';
			} else {
				ss += '<td></td><td></td>';
			}
		}
		ss += '</tr>';
		ssall += ss;
	}
	LEDstatu.innerHTML += ssall;
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		if (!('LED' in devtab[pos])) continue;
		for (let k = 0; k < color.length; k++) {
			if (color[k] in devtab[pos]['LED']) {
				let obj = { "CMD": "LED", "POS": "A031", "Action": "LOAD", "STU": "000000", "GROUP": "00" };
				obj.POS = pos;
				obj.STU = color[k] + '0000';
				socket.emit('client_data', obj);
			}
		}
	}
}
function LEDPUMP() {
	let devarr = Object.keys(devtab).sort();
	let ssall = '<tr><td colspan="4">LED升降馬達</td></tr><tr><td>代號</td><td>功能</td><td>動作</td><td>高度</td></tr>';
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		if (!('PUMP' in devtab[pos])) continue;
		if (!('00' in devtab[pos]['PUMP'])) continue;
		let ss = '<tr><td>' + pos + '</td>'
			+ '<td>' + devtab[pos].name + '</td>';
		let stunamearr = [pos, 'PUMP', 'stu', 'R' + '00'];
		let stuname = '';
		stunamearr[2] = 'act'
		stuname = stunamearr.join('_');
		ss += '<td id="' + stuname + '"></td>';
		stunamearr[2] = 'stu'
		stuname = stunamearr.join('_');
		ss += '<td id="' + stuname + '"></td>';
		ss += '</tr>';
		ssall += ss;
	}
	LEDPUMPstatu.innerHTML += ssall;
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		if (!('PUMP' in devtab[pos])) continue;
		if (!('00' in devtab[pos]['PUMP'])) continue;
		let obj = { "CMD": "PUMP", "POS": "B001", "Action": "LOAD", "STU": "000000", "GROUP": "00" };
		obj.POS = pos;
		socket.emit('client_data', obj);
	}
}

function E003PUMP() {
	let keyarr = Object.keys(devtab.E003.PUMP).sort();

	let region = ['A', 'B'];
	let region2 = [];

	for (let i = 0; i < region.length; i++) {
		for (let j = 0; j < 3; j++) {
			region2[i * 3 + j] = region[i] + '-' + (j + 1);
		}
	}

	let action = ['流噴', '肥清'];

	let ssarr = [];
	for (let k = 0; k < region2.length; k++) {
		ssarr[k] = [];
	}
	for (let i = 0; i < keyarr.length; i++) {
		let it = keyarr[i];
		let narr = devtab.E003.PUMP[it].name.split("區");
		for (let k = 0; k < region2.length; k++) {
			if (narr[0] == region2[k]) {
				for (let m = 0; m < action.length; m++) {
					if (narr[1] == action[m]) {
						let stunamearr = ['E003', 'PUMP', 'stu', 'R' + it];
						ssarr[k][m] = stunamearr.join('_');;
						break;
					}
				}
				break;
			}
		}
	}

	let ss = '<tr><td colspan="4">E003三通閥 肥清流噴</td></tr><tr><td>區域</td><td></td><td></td></tr>';

	for (let k = 0; k < region2.length; k++) {
		ss += '<tr><td>' + region2[k] + '</td>';

		for (let m = 0; m < action.length; m++) {
			if (typeof ssarr[k][m] != 'undefined')
				ss += '<td id="' + ssarr[k][m] + '"></td>';
			else
				ss += '<td></td>'
		}
		ss += '</tr>';
	}

	E003PUMPstatu.innerHTML += ss;
	for (let i = 0; i < keyarr.length; i++) {
		let it = keyarr[i];
		let obj = { "CMD": "PUMP", "POS": "E003", "Action": "LOAD", "STU": "000000", "GROUP": "00" };
		obj.STU = it + '0000';
		socket.emit('client_data', obj);
	}
}

function C00AAIRFAN() {
	let ss = '<tr><td colspan="4">空調設定</td></tr>';

	ss += '<tr>';

	let stunamearr = ['C00A', 'AIRFAN', 'stu', 'R' + '31'];
	let stuname = '';
	stunamearr[2] = 'stu';
	stuname = stunamearr.join('_');
	ss += '<td>開關</td><td id="' + stuname + '"></td>';
	ss += '</tr><tr>';
	stunamearr[2] = 'ch';
	stuname = stunamearr.join('_');
	ss += '<td>冷暖氣</td><td id="' + stuname + '"></td>';
	ss += '</tr><tr>';
	stunamearr[2] = 'tm';
	stuname = stunamearr.join('_');
	ss += '<td>溫度(°C)</td><td id="' + stuname + '"></td>';
	ss += '</tr>';
	C00AAIRFANstatu.innerHTML += ss;
	let obj = { "CMD": "AIRFAN", "POS": "C00A", "Action": "LOAD", "STU": "310000", "GROUP": "00" };
	socket.emit('client_data', obj);
}
function PIR() {
	let devarr = Object.keys(devtab).sort();

	let ss = '<tr><td colspan="4">紅外線感測器</td></tr>';
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		if (!('TRIGGER' in devtab[pos])) continue;
		if (!('41' in devtab[pos]['TRIGGER'])) continue;
		if (devtab[pos]['TRIGGER']['41'].name != "PIR") continue;
		let stunamearr = [pos, 'TRIGGER', 'tg', 'R' + '41'];
		let stuname = '';
		ss += '<tr><td>' + pos + '</td>';
		ss += '<td>';
		stunamearr[2] = 'tg';
		stuname = stunamearr.join('_');
		ss += '<input type="button" value="' + devtab[pos].name + '" id="' + stuname + '" style="width:auto;">';
		ss += '</td>';
		ss += '</tr>';
	}
	PIRTRIGGER.innerHTML += ss;
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		if (!('TRIGGER' in devtab[pos])) continue;
		if (!('41' in devtab[pos]['TRIGGER'])) continue;
		if (devtab[pos]['TRIGGER']['41'].name != "PIR") continue;
		let stunamearr = [pos, 'TRIGGER', 'tg', 'R' + '41'];
		let stuname = '';
		stunamearr[2] = 'tg';
		stuname = stunamearr.join('_');
		window[stuname].onclick = function () {
			let obj = { "CMD": "TRIGGER", "POS": "J002", "Action": "ALARM", "STU": "410000", "GROUP": "00" };
			obj.POS = pos;
			socket.emit('client_data', obj);
		};
	}
}
function LEDERROR() {
	let devarr = Object.keys(devtab).sort();

	let ss = '<tr><td colspan="4">亮度感測器報錯</td></tr>';
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		if (!('TRIGGER' in devtab[pos])) continue;
		if (!('20' in devtab[pos]['TRIGGER'])) continue;
		if (devtab[pos]['TRIGGER']['20'].name != "LED") continue;
		let stunamearr = [pos, 'TRIGGER', 'tg', 'R' + '20'];
		let stuname = '';
		ss += '<tr><td>' + pos + '</td>';
		ss += '<td>';
		stunamearr[2] = 'tg';
		stuname = stunamearr.join('_');
		ss += '<input type="button" value="' + devtab[pos].name + '" id="' + stuname + '" style="width:auto;">';
		ss += '</td>';
		ss += '</tr>';
	}
	LEDERRORTRIGGER.innerHTML += ss;
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		if (!('TRIGGER' in devtab[pos])) continue;
		if (!('20' in devtab[pos]['TRIGGER'])) continue;
		if (devtab[pos]['TRIGGER']['20'].name != "LED") continue;
		let stunamearr = [pos, 'TRIGGER', 'tg', 'R' + '20'];
		let stuname = '';
		stunamearr[2] = 'tg';
		stuname = stunamearr.join('_');
		window[stuname].onclick = function () {
			let obj = { "CMD": "TRIGGER", "POS": "J002", "Action": "ALARM", "STU": "200000", "GROUP": "00" };
			obj.POS = pos;
			socket.emit('client_data', obj);
		};
	}
}
function KEYPAD1() {
	let keyarr = Object.keys(keypad.KEYPAD1.KEY).sort();
	let ssarr = [];
	for (let i = 0; i < keyarr.length; i++) {
		let it = keyarr[i];
		let k = keypad.KEYPAD1.KEY[it].stu;
		let stunamearr = ['E001', 'TRIGGER', 'tg', 'R' + it];
		let stuname = '';
		ssarr[k] = '';
		ssarr[k] += '<td>';

		stunamearr[2] = 'stu';
		stuname = stunamearr.join('_');
		ssarr[k] += '<lable id="' + stuname + '"></lable>';

		ssarr[k] += '<br>';

		stunamearr[2] = 'tg';
		stuname = stunamearr.join('_');
		ssarr[k] += '<input type="button" value="' + keypad.KEYPAD1.KEY[it].name + '" id="' + stuname + '" style="width:100px;">';

		ssarr[k] += '</td>';
	}
	let ss = '<tr><td colspan="4">實體鍵盤</td></tr>';
	ss += '<tr>';
	for (let i = 0; i < ssarr.length; i++) {
		ss += ssarr[i];
		if (i + 1 == ssarr.length / 2)
			ss += '</tr><tr>';
	}
	ss += '</tr>';
	KEYPAD1TRIGGER.innerHTML += ss;
	for (let i = 0; i < keyarr.length; i++) {
		let it = keyarr[i];
		let kk = keypad.KEYPAD1.KEY[it];
		let stunamearr = ['E001', 'TRIGGER', 'tg', 'R' + it];
		let stuname = '';
		kk.stu = false;

		stunamearr[2] = 'stu';
		stuname = stunamearr.join('_');
		window[stuname].style.backgroundColor = '#fff';
		window[stuname].innerHTML = '關';


		stunamearr[2] = 'tg';
		stuname = stunamearr.join('_');
		window[stuname].onclick = function () {
			kk.stu = !kk.stu;
			let obj = { "CMD": "TRIGGER", "POS": "E001", "Action": "ALARM", "STU": "100000", "GROUP": "00" };
			obj.STU = '10' + it + Number(kk.stu);
			socket.emit('client_data', obj);
			let stunamearr = ['E001', 'TRIGGER', 'tg', 'R' + it];
			let stuname = '';
			stunamearr[2] = 'stu';
			stuname = stunamearr.join('_');
			if (kk.stu) {
				window[stuname].style.backgroundColor = '#0f0';
				window[stuname].innerHTML = '開';
			} else {
				window[stuname].style.backgroundColor = '#fff';
				window[stuname].innerHTML = '關';
			}
		};
	}
}
function checkfunc() {
	let ck = ["loadcheck", "typecheck"];
	let ss = '<tr><td colspan="9">強制動作按鈕</td></tr>';
	for (let k = 0; k < ck.length; k++) {
		ss += '<tr>';
		for (let i = 0; i < 5; i++) {
			ss += '<td id="CHECK_' + ck[k] + '_stu' + i + '" style="width:10px;"></td>';
		}
		ss += '<td>';
		ss += '<input type="button" value="' + apicmd[ck[k]].keyname + '" id="CHECK_' + ck[k] + '_url" style="width:70px;">';
		ss += '</td>';
		ss += '<td>' + apicmd[ck[k]].name + '</td>';
		ss += '</tr>';
	}
	checktb.innerHTML += ss;
	for (let k = 0; k < ck.length; k++) {
		let keyname = ck[k];
		let acc = apicmd[ck[k]].url;
		window['CHECK_' + keyname + '_url'].onclick = function () {
			generator(function* () {
				for (let i = 0; i < 5; i++) {
					window['CHECK_' + ck[k] + '_stu' + i].style.backgroundColor = '#fff';
				}
				for (let i = 0; i < 5; i++) {
					yield {
						nextfunc: function (...args) {
							setTimeout(...args);
						},
						argsfront: [],
						cbfunc: function () { },
						argsback: [1000]
					};
					window['CHECK_' + ck[k] + '_stu' + i].style.backgroundColor = '#0f0';
					sendurl(acc);
				}
			});
		};
	}
}

var isinit = false;
function init() {
	E002PUMP();
	E002WATERLEVEL();
	TMRHCO2();
	ECPH();
	LED();
	LEDPUMP();
	E003PUMP();
	C00AAIRFAN();
	PIR();
	LEDERROR();
	KEYPAD1();
	checkfunc();
}

window.onload = function () {
	let obj = { "CMD": "UUID", "POS": "E002", "Action": "LOAD", "STU": "000000", "GROUP": "00" };
	socket.emit('client_data', obj);
	// setgetUUID.onclick = function () {
	// 	let obj = { "CMD": "UUID", "POS": "E002", "Action": "SET", "STU": "000000", "GROUP": "00" };
	// 	obj.STU = UUID.value;
	// 	socket.emit('client_data', obj);
	// };
}