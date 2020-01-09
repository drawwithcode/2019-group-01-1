//create a map and load it from mapbox
var myMap;
var canvas;
var mappa = new Mappa('MapboxGL', "pk.eyJ1IjoiYW5kcmVhYmVuZWRldHRpIiwiYSI6ImNqNWh2eGh3ejFqOG8zM3BrZjRucGZkOGEifQ.SmdBpUoSe3s0tm-OTDFY9Q");

//define the style, zoom and rotation of the map
var options = {
  	lat: 0,
  	lng: 0,
  	zoom: 20,
    maxZoom: 20.5,
    minZoom: 18,
    pitch: 40,
    bearing: -60,
  	style: 'mapbox://styles/mapbox/light-v10',
    interactive: true
}

//define the position of the user and it's coordinates
var myLat;
var myLon;
var position;

//Define all the other variables
var regali = [];
var i = 0;
var presentImage;

//load the user position
function preload() {
  	position = getCurrentPosition();
	presentimage = loadImage("./assets/png/regalo.png");
}

function setup() {
  	canvas = createCanvas(windowWidth, windowHeight);
    
    //define that the position of the user will define his lat and his lon
	myLat = position.latitude;
	myLon = position.longitude;
	
	//Change position of the circle on position change
	watchPosition(Movement, 500);
    
    options.lat = myLat;
    options.lng = myLon;

	//define that the setup of the project will be the map
	myMap = mappa.tileMap(options);
	myMap.overlay(canvas);  
}

function draw() {
	clear();

  	//draw a circle where the user is
	push();
  	var myPosition = myMap.latLngToPixel(myLat, myLon);
  	fill(255, 0, 0);
  	noStroke();
  	ellipse(myPosition.x, myPosition.y, 20);
	pop();
	
	//Display Presents
	for (var j = 0; j < regali.length; j++) {
      regali[j].display();
    }
    
    options.lat = 43.872256;
    options.lng = 10.2490112;
}

function GivePresent(){
	regali[i] = new Regalo();
	i++;
}

function Regalo(){
	this.x = myLat;
	this.y = myLon;
	this.regalo = presentImage;
	
	this.display = function(){
		push();
        fill("blue");
        noStroke();
		ellipse(this.x, this.y, 20);
        console.log(this.x, this.y);
		pop();
	}
}

function Movement(posizione) {
	myLat = posizione.latitude;
	myLon = posizione.longitude;
}