![alt tag](../master/links/banner.png)

## About
Surprise, Surprise! is a Christmas Themed Geolocation WebApp built on [p5.js](https://p5js.org) with the aim of sharing your feelings and spreading positivity.<br>
The app is playable at: https://surprise-surprise.herokuapp.com/<br>
Surprise, Surprise! was developed as a part of the Creative Coding course at Politecnico di Milano.
 
Professors: Michele Mauri, Andrea Benedetti

## Table of Contents
1. [Project Idea](#project-idea)<br>
a. [How does it work?](#how-does-it-work)<br>
b. [The Inspiration](#the-inspiration)<br>
c. [The User Challenge](#the-user-challenge)<br>
d. [The Gifts](#the-gifts)<br>
2. [The Interface](#the-interface)<br>
3. [The Code](#the-code)<br>
a. [The Tools](#the-tools)<br>
4. [The Team](#the-team)<br>

## Project Idea  
The instructions for the group project of the Creative Coding course were to create an online space in which users could interact with each other.  
Our group decided to ponder about the concept of virtual space so we decided to create a space that was not only virtual but also physical; in this way the user could walk around using the geolocalization.  
We searched to see if there were already some applications similar to the one we had in mind (for example YakYak) to understand which were the critical points on the dynamics in a space where users can interact, to try and fix them.  
We found a recurring problem in online space: the total freedom of the user to say everything they want, which may contribute to transforming the online space in an hostile environment (cyber-bulling, etc).  
As a result we decided to create a space in which people could develop a higher sensibility through the expression of their emotions. The app is also Christmas themed because its purpose is very similar to the attitude people feel thanks to the Christmas atmosphere of kindness and gratefulness.

## How does it work?
The user can through the map in any directions, but he will have some restrictions: he won’t be able to zoom back over a certain value, to discourage the user from exploring the places on the man that are not strictly surrounding. The user can move on the map as he moves around in real life; through a button located in the bottom part of the scree he can leave some packets around, which could be opened from other users that find them while exploring the map. The user will be able to leave a content of his choice hidden inside the gifts.

## The inspiration
Our main inspirations have been the social-detox apps that help the users reduce the time spent on social networks. Most of these apps mute the notifications or reward the users in different ways by using less the smartphone.

## The User Challenge
![alt tag](../master/links/challenges.gif)

Every time the user access the app, he will have the chance to collect all the different illustrations and to leave the packets around (so other users can collect them and the game can proceed) until he stays on the website.
Every time he reconnects he will have to start over.

## The Gifts
![alt tag](../master/links/presents.gif)

The user will choose between three emojis to express his mood; in the packets there will be a short message representing the mood of the person who left it and an illustration, Christmas-themed, randomly chosen between five different ones. The one who will find the packets will get the chance to read the emotions of the person around him and in the meantime to collect the illustrations.

## The Interface  
The WebApp works only on mobile platforms and in portrait mode.

![alt tag](../master/links/desktop.png)

In the map in  the user has a limited possibility to move around. He can move the map, but he can't zoom back over a certain value.

  ![alt tag](../master/links/map.jpg)
  
The user, clicking the button in the bottom part of the screen, will be able to leave some presents around. The user can choose three differents mood. 

  ![alt tag](../master/links/mood)
  
The user who leaves the package will see it in greyscale, while the other users will see it in a coloured version.
  
  ![alt tag](../master/links/packages.jpg)
  
When the other users open your packages, they will see some animations that show your chosen mood.

  ![alt tag](../master/links/open.jpg)

## The Code
We used Mapbox for the main part of the WebApp. To intergrate Mapbox GL inside p5.js we used a library called mappa.js, a tool that facilitate work between the canvas element and existing map libraries and APIs.
We slightly changed mappa.js to add a gps button that helps the user go back to his position:
```javascript
map.addControl(
  new mapboxgl.GeolocateControl({
	  positionOptions: {
		  enableHighAccuracy: true
		},
		trackUserLocation: true,
		showUserLocation: false
	})
);
```
The main challenge was based around having so many interactions that have to be registered, remembered and sent to everyone.
We overcame that challenge by relying on a local JSON file that is modified everytime a change with the present happens by sending signals from the client to the server and then to all the clients with socket.io, an engine which enables real-time, bidirectional and event-based communication.
As an example, when someone sends a present automatically will be sent a JSON variable to the server holding all the present informations:
```javascript
//Variable holding the new Present informations
var data = {
  x: rx,
  y: ry,
  q1: question1,
  show: iconshow
}

//JSON variable holding the previus variable
var json = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: data
}

//Emit the Present data to other Users
socket.emit('present', json);
```
When the server receives the signal and the gift Informations it starts a function to change the local JSON by adding this new informations:
```javascript
function jsonUpdate(request){
  var testo = request.body; //Put the informations of the present that a user sent on the variable testo
  var fs = require('fs'); //Call FileSystem API to read and modify JSON file

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
```
And then a signal is emitted to all the clients to update the presents:
```javascript
regalimported = []; //deletes all the previus shown presents
database = loadJSON("../presents.json"); //Loads JSON with new informations
//Recreate all the gifts Objects on the map after some time to ensure that the JSON is loaded
setTimeout(function() {
  for (var t = 0; t < database.regali.length; t++) {
    var data = {
      x: database.regali[t].x,
      y: database.regali[t].y,
      q1: database.regali[t].q1,
      show: database.regali[t].show,
      index: t
    }
    regalimported[t] = new RegaloImported(data);
  }
}, 1000);
```
In general we used mostly p5.js to handle events but for graphics and animations we used JQuery and CSS as it's easier to make the animations more fluid and dynamic.

## The Tools
* p5.js
* Mappa.js
* Mapbox GL
* JQuery

## The Team
* Niccolò Abate   
* Alvise Aspesi  
* Elisa Carbone  
* Davide Perucchini

>CREDITS  
>illustrations by [undraw.co](https://undraw.co/)
