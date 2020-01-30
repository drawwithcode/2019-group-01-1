// load express library
var express = require('express');
// create the app
var app = express();
// define the port where client files will be provided
var port = process.env.PORT || 3000;
// start to listen to that port
var server = app.listen(port);
// provide static access to the files
// in the "public" folder
app.use(express.static('public'));
// load socket library
var socket = require('socket.io');
// create a socket connection
var io = socket(server);

// define which function should be called
// when a new connection is opened from client
io.on('connection', newConnection);
// callback function: the paramenter (in this case socket)
// will contain all the information on the new connection
function newConnection(socket){
	//when a new connection is created, print its id
	console.log('socket:', socket.id);

	//define what to do on different kind of messages
	socket.on('closepresent', closePresent);

	//Update json
	socket.on('present', jsonUpdate);

	function closePresent(stopIcon){
		var fs = require('fs');
		var m = JSON.parse(fs.readFileSync('./public/presents.json').toString());
		console.log(stopIcon.index);
		m.regali[stopIcon.index].show =  1;
		console.log(m.regali[0].show);
		fs.writeFile('public/presents.json', JSON.stringify(m, null, 2), finished);
		socket.broadcast.emit('Closing', stopIcon);
	}

	function jsonUpdate(request){
		var testo = request.body;
    var fs = require('fs');


		fs.readFile('./public/presents.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
          console.log(err);
        } else {
          //now it an object
          //add some data
          //convert it back to json
          obj = JSON.parse(data);
          obj.regali.push(testo)
          json = JSON.stringify(obj, null, 2);
          //console.log(json)
          fs.writeFile('./public/presents.json', json, finished);

					socket.broadcast.emit('presentBroadcast', request);
          // write it back

          //console.log(data);
        }
      });
	}
}

function finished() {
}

console.log('node server is running')
