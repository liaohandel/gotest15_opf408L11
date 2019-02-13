var socket = io.connect();

socket.on('message', function (data) {
	let cmd = data.CMD;
	let pos = data.POS;
	let subcmd = data.Action;
	let stu = data.STU;
	let subkey = stu.substr(0, 2);
	let group = data.GROUP;

	if (!(pos in devtab)) return;
	if (!(cmd in cmdtab)) return;
	if (!(cmd in devtab[pos])) return;

	if (!(subcmd in subcmdtab)) return;
	if (!(subkey in devtab[pos][cmd])) return;

	let stuname = '';

	switch (cmd) {
		case 'PUMP':
			if (Number(subkey) >= 0 && Number(subkey) <= 2) {
				stuname = [pos, cmd, 'act', 'R' + '00'].join('_');
				switch (subkey) {
					case '00':
						window[stuname].innerHTML = '絕對';
						break;
					case '01':
						window[stuname].innerHTML = '下降';
						break;
					case '02':
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
							window[stuname].style.backgroundColor = '#f00';
							window[stuname].innerHTML = '噴';
							break;
						case 'OFF':
							window[stuname].style.backgroundColor = '#0f0';
							window[stuname].innerHTML = '流';
							break;
						default:
							break;
					}
				} else {
					switch (subcmd) {
						case 'ON':
							window[stuname].style.backgroundColor = '#f00';
							window[stuname].innerHTML = '肥';
							break;
						case 'OFF':
							window[stuname].style.backgroundColor = '#0f0';
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
						window[stuname].style.backgroundColor = '#f00';
						window[stuname].innerHTML = '開';
						break;
					case 'OFF':
						window[stuname].style.backgroundColor = '#0f0';
						window[stuname].innerHTML = '關';
						break;
					default:
						break;
				}
			}
			break;
		case 'WATERLEVEL':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'LOAD':
					let obj = { "CMD": "WATERLEVEL", "POS": "E002", "Action": "SET", "STU": "000000", "GROUP": "00" };
					obj.POS = pos;
					obj.CMD = cmd;
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'TEMPERATURE':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'LOAD':
					let obj = { "CMD": "WATERLEVEL", "POS": "E002", "Action": "SET", "STU": "000000", "GROUP": "00" };
					obj.POS = pos;
					obj.CMD = cmd;
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'RH':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'LOAD':
					let obj = { "CMD": "WATERLEVEL", "POS": "E002", "Action": "SET", "STU": "000000", "GROUP": "00" };
					obj.POS = pos;
					obj.CMD = cmd;
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'CO2':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'LOAD':
					let obj = { "CMD": "WATERLEVEL", "POS": "E002", "Action": "SET", "STU": "000000", "GROUP": "00" };
					obj.POS = pos;
					obj.CMD = cmd;
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'ELECTRONS':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'LOAD':
					let obj = { "CMD": "WATERLEVEL", "POS": "E002", "Action": "SET", "STU": "000000", "GROUP": "00" };
					obj.POS = pos;
					obj.CMD = cmd;
					obj.STU = subkey + paddingLeft((window[stuname].value * 1).toString(16), 4);
					socket.emit('client_data', obj);
					break;
				default:
					break;
			}
			break;
		case 'PH':
			stuname = [pos, cmd, 'range', 'R' + subkey].join('_');
			switch (subcmd) {
				case 'LOAD':
					let obj = { "CMD": "WATERLEVEL", "POS": "E002", "Action": "SET", "STU": "000000", "GROUP": "00" };
					obj.POS = pos;
					obj.CMD = cmd;
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
					window[stuname].style.backgroundColor = '#f00';
					window[stuname].innerHTML = '開';
					break;
				case 'OFF':
					window[stuname].style.backgroundColor = '#0f0';
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
					window[stuname].style.backgroundColor = '#f00';
					window[stuname].innerHTML = '開';
					break;
				case 'OFF':
					window[stuname].style.backgroundColor = '#0f0';
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

		default:
			break;
	}
});

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
		ss += '<td>';
		ss += '<input type="button" value="-10" id="E002_WATERLEVEL_sub5_R' + it + '">';
		ss += '<input type="button" value="-1" id="E002_WATERLEVEL_dec_R' + it + '">';
		ss += '<input type="text" value="3500" maxlength="4" id="E002_WATERLEVEL_stu_R' + it + '">';
		ss += '<input type="button" value="+1" id="E002_WATERLEVEL_inc_R' + it + '">';
		ss += '<input type="button" value="+10" id="E002_WATERLEVEL_add5_R' + it + '">';
		ss += '<input type="range" value="3500" min="3500" max="4000" id="E002_WATERLEVEL_range_R' + it + '">';
		ss += '</td>';
		ss += '</tr>';
	}
	E002WATERLEVELstatu.innerHTML += ss;
	for (let i = 0; i < keyarr.length; i++) {
		let it = keyarr[i];
		window['E002_WATERLEVEL_sub5_R' + it].onclick = function () {
			window['E002_WATERLEVEL_range_R' + it].stepDown(10);
			window['E002_WATERLEVEL_stu_R' + it].value = window['E002_WATERLEVEL_range_R' + it].value;
		};
		window['E002_WATERLEVEL_dec_R' + it].onclick = function () {
			window['E002_WATERLEVEL_range_R' + it].stepDown(1);
			window['E002_WATERLEVEL_stu_R' + it].value = window['E002_WATERLEVEL_range_R' + it].value;
		};
		window['E002_WATERLEVEL_inc_R' + it].onclick = function () {
			window['E002_WATERLEVEL_range_R' + it].stepUp(1);
			window['E002_WATERLEVEL_stu_R' + it].value = window['E002_WATERLEVEL_range_R' + it].value;
		};
		window['E002_WATERLEVEL_add5_R' + it].onclick = function () {
			window['E002_WATERLEVEL_range_R' + it].stepUp(10);
			window['E002_WATERLEVEL_stu_R' + it].value = window['E002_WATERLEVEL_range_R' + it].value;
		};
		window['E002_WATERLEVEL_range_R' + it].onmousedown = function () {
			window['E002_WATERLEVEL_range_R' + it].onmousemove = function () {
				window['E002_WATERLEVEL_stu_R' + it].value = window['E002_WATERLEVEL_range_R' + it].value;
			};
		};
		window['E002_WATERLEVEL_range_R' + it].onmouseup = function () {
			window['E002_WATERLEVEL_range_R' + it].onmousemove = function () {
			};
		};
		window['E002_WATERLEVEL_stu_R' + it].onchange = function () {
			if (window['E002_WATERLEVEL_stu_R' + it].value < 3500)
				window['E002_WATERLEVEL_stu_R' + it].value = 3500;
			if (window['E002_WATERLEVEL_stu_R' + it].value > 4000)
				window['E002_WATERLEVEL_stu_R' + it].value = 4000;
			window['E002_WATERLEVEL_range_R' + it].value = window['E002_WATERLEVEL_stu_R' + it].value;
		};
		window['E002_WATERLEVEL_range_R' + it].onclick = function () {
			window['E002_WATERLEVEL_stu_R' + it].value = window['E002_WATERLEVEL_range_R' + it].value;
		};

	}
}
function TMRHCO2() {
	let devarr = Object.keys(devtab).sort();
	let ssall = '<tr><td colspan="3">溫溼度CO2</td></tr><tr><td>代號</td><td>功能</td><td>溫度(°C)</td><td>濕度(%)</td><td>CO2(ppm)</td></tr>';
	let sensor = ['TEMPERATURE', 'RH', 'CO2'];
	let sensorvalue = [
		{
			inc: 1,
			add: 10,
			stu: 270,
			maxlength: 4,
			min: 0,
			max: 500,
			div: 10
		}, {
			inc: 1,
			add: 10,
			stu: 50,
			maxlength: 3,
			min: 0,
			max: 100,
			div: 1
		}, {
			inc: 1,
			add: 10,
			stu: 700,
			maxlength: 4,
			min: 0,
			max: 3000,
			div: 1
		}
	];
	for (let d = 0; d < devarr.length; d++) {
		let pos = devarr[d];
		let ss = '<tr><td>' + pos + '</td>'
			+ '<td>' + devtab[pos].name + '</td>';
		let b = false;
		for (let k = 0; k < sensor.length; k++) {
			if (sensor[k] in devtab[pos]) {
				b = true;
				let stunamearr = [pos, sensor[k], 'stu', 'R' + Object.keys(devtab[pos][sensor[k]])[0]];
				let stuname = '';
				ss += '<td>';
				stunamearr[2] = 'sub5';
				stuname = stunamearr.join('_');
				ss += '<input type="button" value="-' + sensorvalue[k].add / sensorvalue[k].div + '" id="' + stuname + '">';
				stunamearr[2] = 'dec';
				stuname = stunamearr.join('_');
				ss += '<input type="button" value="-' + sensorvalue[k].inc / sensorvalue[k].div + '" id="' + stuname + '">';
				stunamearr[2] = 'stu';
				stuname = stunamearr.join('_');
				ss += '<input type="text" value="' + sensorvalue[k].stu / sensorvalue[k].div + '" maxlength="' + sensorvalue[k].maxlength + '" id="' + stuname + '">';
				stunamearr[2] = 'inc';
				stuname = stunamearr.join('_');
				ss += '<input type="button" value="+' + sensorvalue[k].inc / sensorvalue[k].div + '" id="' + stuname + '">';
				stunamearr[2] = 'add5';
				stuname = stunamearr.join('_');
				ss += '<input type="button" value="+' + sensorvalue[k].add / sensorvalue[k].div + '" id="' + stuname + '">';
				stunamearr[2] = 'range';
				stuname = stunamearr.join('_');
				ss += '<input type="range" value="' + sensorvalue[k].stu + '" min="' + sensorvalue[k].min + '" max="' + sensorvalue[k].max + '" id="' + stuname + '">';
				ss += '</td>';
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
				let stunamearr = [pos, sensor[k], 'stu', 'R' + Object.keys(devtab[pos][sensor[k]])[0]];
				stunamearr[2] = 'sub5';
				let stunamesub5 = stunamearr.join('_');
				stunamearr[2] = 'dec';
				let stunamedec = stunamearr.join('_');
				stunamearr[2] = 'stu';
				let stunamestu = stunamearr.join('_');
				stunamearr[2] = 'inc';
				let stunameinc = stunamearr.join('_');
				stunamearr[2] = 'add5';
				let stunameadd5 = stunamearr.join('_');
				stunamearr[2] = 'range';
				let stunamerange = stunamearr.join('_');
				let sv = sensorvalue[k];
				window[stunamesub5].onclick = function () {
					window[stunamerange].stepDown(sv.add);
					window[stunamestu].value = window[stunamerange].value / sv.div;
				};
				window[stunamedec].onclick = function () {
					window[stunamerange].stepDown(sv.inc);
					window[stunamestu].value = window[stunamerange].value / sv.div;
				};
				window[stunameinc].onclick = function () {
					window[stunamerange].stepUp(sv.inc);
					window[stunamestu].value = window[stunamerange].value / sv.div;
				};
				window[stunameadd5].onclick = function () {
					window[stunamerange].stepUp(sv.add);
					window[stunamestu].value = window[stunamerange].value / sv.div;
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
					window[stunamerange].value = window[stunamestu].valu * sv.div;
				};
				window[stunamerange].onclick = function () {
					window[stunamestu].value = window[stunamerange].value / sv.div;
				};
			}
		}
	}
}
function ECPH() {
	let sensor = ['ELECTRONS', 'PH'];
	let sensorvalue = [
		{
			inc: 1,
			add: 10,
			stu: 500,
			maxlength: 4,
			min: 0,
			max: 2000,
			div: 1
		}, {
			inc: 1,
			add: 10,
			stu: 70,
			maxlength: 4,
			min: 0,
			max: 140,
			div: 10
		}
	];
	let ss = '<tr><td colspan="4">EC & pH</td></tr>';
	for (let k = 0; k < sensor.length; k++) {
		let keyarr = Object.keys(devtab.E002[sensor[k]]).sort();
		let it = keyarr[0];
		ss += '<tr>';
		ss += '<td>' + 'R' + it + '</td>';
		ss += '<td>' + devtab.E002[sensor[k]][it].name + '</td>';
		ss += '<td>';
		ss += '<input type="button" value="-' + sensorvalue[k].add / sensorvalue[k].div + '" id="E002_' + sensor[k] + '_sub5_R' + it + '">';
		ss += '<input type="button" value="-' + sensorvalue[k].inc / sensorvalue[k].div + '" id="E002_' + sensor[k] + '_dec_R' + it + '">';
		ss += '<input type="text" value="' + sensorvalue[k].stu / sensorvalue[k].div + '" maxlength="' + sensorvalue[k].maxlength + '" id="E002_' + sensor[k] + '_stu_R' + it + '">';
		ss += '<input type="button" value="+' + sensorvalue[k].inc / sensorvalue[k].div + '" id="E002_' + sensor[k] + '_inc_R' + it + '">';
		ss += '<input type="button" value="+' + sensorvalue[k].add / sensorvalue[k].div + '" id="E002_' + sensor[k] + '_add5_R' + it + '">';
		ss += '<input type="range" value="' + sensorvalue[k].stu + '" min="' + sensorvalue[k].min + '" max="' + sensorvalue[k].max + '" id="E002_' + sensor[k] + '_range_R' + it + '">';
		ss += '</td>';
		ss += '<td>';
		ss += '<input type="button" value="' + apicmd[sensor[k]].keyname + '" id="E002_' + sensor[k] + '_api_R' + it + '" style="width:70px;">';
		ss += '</td>';
		ss += '</tr>';
	}
	ECPHstatu.innerHTML += ss;
	for (let k = 0; k < sensor.length; k++) {
		let keyarr = Object.keys(devtab.E002[sensor[k]]).sort();
		let it = keyarr[0];
		let keyname = sensor[k];
		let sv = sensorvalue[k];
		window['E002_' + keyname + '_sub5_R' + it].onclick = function () {
			window['E002_' + keyname + '_range_R' + it].stepDown(sv.add);
			window['E002_' + keyname + '_stu_R' + it].value = window['E002_' + keyname + '_range_R' + it].value / sv.div;
		};
		window['E002_' + keyname + '_dec_R' + it].onclick = function () {
			window['E002_' + keyname + '_range_R' + it].stepDown(sv.inc);
			window['E002_' + keyname + '_stu_R' + it].value = window['E002_' + keyname + '_range_R' + it].value / sv.div;
		};
		window['E002_' + keyname + '_inc_R' + it].onclick = function () {
			window['E002_' + keyname + '_range_R' + it].stepUp(sv.inc);
			window['E002_' + keyname + '_stu_R' + it].value = window['E002_' + keyname + '_range_R' + it].value / sv.div;
		};
		window['E002_' + keyname + '_add5_R' + it].onclick = function () {
			window['E002_' + keyname + '_range_R' + it].stepUp(sv.add);
			window['E002_' + keyname + '_stu_R' + it].value = window['E002_' + keyname + '_range_R' + it].value / sv.div;
		};
		window['E002_' + keyname + '_range_R' + it].onmousedown = function () {
			window['E002_' + keyname + '_range_R' + it].onmousemove = function () {
				window['E002_' + keyname + '_stu_R' + it].value = window['E002_' + keyname + '_range_R' + it].value / sv.div;
			};
		};
		window['E002_' + keyname + '_range_R' + it].onmouseup = function () {
			window['E002_' + keyname + '_range_R' + it].onmousemove = function () {
			};
		};
		window['E002_' + keyname + '_stu_R' + it].onchange = function () {
			if (window['E002_' + keyname + '_stu_R' + it].value < sv.min)
				window['E002_' + keyname + '_stu_R' + it].value = sv.min;
			if (window['E002_' + keyname + '_stu_R' + it].value > sv.max)
				window['E002_' + keyname + '_stu_R' + it].value = sv.max;
			window['E002_' + keyname + '_range_R' + it].value = window['E002_' + keyname + '_stu_R' + it].value * sv.div;
		};
		window['E002_' + keyname + '_range_R' + it].onclick = function () {
			window['E002_' + keyname + '_stu_R' + it].value = window['E002_' + keyname + '_range_R' + it].value / sv.div;
		};
		let acc = [apicmd[sensor[k]].cmd];
		window['E002_' + keyname + '_api_R' + it].onclick = function () {
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
		window[stuname].style.backgroundColor = '#0f0';
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
				window[stuname].style.backgroundColor = '#f00';
				window[stuname].innerHTML = '開';
			} else {
				window[stuname].style.backgroundColor = '#0f0';
				window[stuname].innerHTML = '關';
			}
		};
	}
}
function checkfunc() {
	let ck = ["loadcheck", "typecheck"];
	let ss = '<tr><td colspan="4">強制動作按鈕</td></tr>';
	for (let k = 0; k < ck.length; k++) {
		ss += '<tr>';
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
		window['CHECK_' + ck[k] + '_url'].onclick = function () {
			sendurl(acc);
		};
	}
}
window.onload = function () {
	let getarr = url2array();
	if (typeof getarr.UUID == 'undefined')
		UUID.value = apicmd.UUID;
	else
		UUID.value = getarr.UUID;

	setgetUUID.onclick = function () {
		array2url({ 'UUID': UUID.value });
	};

	E002PUMP();
	E002WATERLEVEL();
	TMRHCO2();
	ECPH();
	LED();
	LEDPUMP();
	E003PUMP();
	C00AAIRFAN();
	PIR();
	KEYPAD1();
	checkfunc();
}