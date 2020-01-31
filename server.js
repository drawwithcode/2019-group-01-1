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

	//When a user closes a present start closePresent callback function
	socket.on('closepresent', closePresent);

	//When a user leaves a present start jsonUpdate callback function
	socket.on('present', jsonUpdate);

	function closePresent(stopIcon){
		var fs = require('fs'); //Call FileSystem API to read and modify JSON file
		var m = JSON.parse(fs.readFileSync('./public/presents.json').toString()); //Get text of JSON on a variable
		m.regali[stopIcon.index].show =  1; //Change iconshow variable inside JSON at the index of the closed present
		fs.writeFile('public/presents.json', JSON.stringify(m, null, 2), finished); //Write it in the JSON
		socket.broadcast.emit('Closing', stopIcon); //Send to all clients the update
	}

	function jsonUpdate(request){
		var testo = request.body; //Put the informations of the present that a user sent on the testo variable
    var fs = require('fs'); //As before

		//Read JSON file
		fs.readFile('./public/presents.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
          console.log(err); //If the read produces an error say it on the console
        } else {
          obj = JSON.parse(data); //Convert the JSON into an object
          obj.regali.push(testo) //Put the present informations as a new entry inside the objects
          json = JSON.stringify(obj, null, 2); //Convert the object into a string
          fs.writeFile('./public/presents.json', json, finished); //Write new entry into JSON
					socket.broadcast.emit('presentBroadcast', request); //Send to all clients the update
        }
      });
	}
}

function finished() {
}
