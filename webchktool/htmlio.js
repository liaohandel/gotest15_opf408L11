console.log('htmlio load...');

var io = require('socket.io');
var serv_io;
var socketlist = {};
var socketcount = 0;
var html = {
	print: function (data, socketid) {
		console.log('chk cmd = ' + JSON.stringify(data));
		console.log('socketid = ' + socketid);
		socketlist[socketid].emit('message', data);
	},
	printall: function (data) {
		console.log('chk cmd = ' + JSON.stringify(data));
		for (let socketid in socketlist) {
			console.log('socketid = ' + socketid);
			socketlist[socketid].emit('message', data);
		}
	},
	printfirst: function (data) {
		console.log('chk cmd = ' + JSON.stringify(data));
		for (let socketid in socketlist) {
			console.log('socketid = ' + socketid);
			socketlist[socketid].emit('message', data);
			break;
		}
	},
	scan: function (data, socketid) {
	}
}
function setserver(server) {
	serv_io = io.listen(server);
	serv_io.sockets.on('connection', function (socket) {
		let socketid = socketcount++;
		socketlist[socketid] = socket;
		console.log('socketid ' + socketid + ' online.');
		socket.on('client_data', function (data) {
			console.log('html cmd = ' + JSON.stringify(data));
			html.scan(data, socketid);
		});
		socket.on('disconnect', function () {
			console.log('socketid ' + socketid + ' close.');
			delete socketlist[socketid];
		});
	});
}

exports.html = html;
exports.setserver = setserver;