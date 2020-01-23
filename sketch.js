
//Define the scenemanager variable
var mgr, position, menuillustration, presentimage, logo, lobster;

function preload(){
  position = getCurrentPosition();
  menuillustration = loadImage("./assets/png/mainmenu.png");
  logo = loadImage("./assets/png/logo.png");
  lobster = loadFont('assets/fonts/Lobster-Regular.ttf');
}

function setup(){
  //Create a SceneManager
  mgr = new SceneManager();

  //Add the scenes
  mgr.addScene ( Play );
  mgr.addScene ( Game );

  //Go to the Main Menu
  mgr.showNextScene();
}

function draw(){
    mgr.draw();
}

// =============================================================
// =                       MAIN MENU                           =
// =============================================================

function Play(){
  this.setup = function(){
    createCanvas(windowWidth,windowHeight);
  }

  this.draw = function(){
    clear();
    background("#b3f1f4");

    //create distance variable for the Play button
    var d = dist(mouseX, mouseY, windowWidth/2-10, windowHeight/3-20);

    //Create Play button
    push();
    textAlign(CENTER);
    textSize(width/8);
    textFont(lobster);
    noStroke();
    fill(255);
    ellipse(windowWidth/2, windowHeight/3, windowWidth/2.3);
    fill("#d5004d");
    ellipse(windowWidth/2, windowHeight/3, windowWidth/2.5);
    if(mouseIsPressed && d < windowWidth/5){
      fill("#ff0160");
      ellipse(windowWidth/2-5, windowHeight/3-10, windowWidth/2.5);
      fill(255);
      text("Play", width/2-5, windowHeight/3+20);
      this.sceneManager.showNextScene();
    } else{
      fill("#ff0160");
      ellipse(windowWidth/2-10, windowHeight/3-20, windowWidth/2.5);
      fill(255);
      text("Play", width/2-10, windowHeight/3+10);
    }
    pop();

    //Show Illustration
    push();
    imageMode(CENTER);
    image(menuillustration, windowWidth/2, windowHeight/1.6, width, width/2);

    //Show Logo
    image(logo, windowWidth/2, windowHeight/8, width/1.2, width/2.4);
    pop();
  }

  this.touchMoved = function() {
    return false;
  }
}

// =============================================================
// =                          GAME                             =
// =============================================================

function Game(){
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
      minZoom: 15,
      pitch: 40,
      bearing: -60,
    	style: 'mapbox://styles/mapbox/light-v10',
      interactive: true
  }

  //define the position of the user and it's coordinates
  var myLat;
  var myLon;

  //Define all the other variables
  var regali = [];
  var i = 0;
  var presentImage;

  this.setup = function() {
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

  this.draw = function() {
    clear();

    //draw a circle where the user is
  	push();
    var myPosition = myMap.latLngToPixel(myLat, myLon);
    fill(255, 0, 0);
    noStroke();
    ellipse(myPosition.x, myPosition.y, options.zoom * 2);
  	pop();

    //Create Present button
    givepresent = createImg("assets/gif/caricamento.gif");
    givepresent.position(width/2-125, height/1.3);
    givepresent.style("width", width/3 + "px");
    var dbutton = dist(mouseX, mouseY, width/2, height/1.3);
    if(dbutton < width/3){
      GivePresent();
    }

  	//Display Presents
  	for (var j = 0; j < regali.length; j++) {
      regali[j].display();
    }
  }

  this.mouseClicked = function() {
    for (var j = 0; j < regali.length; j++) {
      console.log("uee");
      regali[j].clicked();
    }
  }

  function GivePresent(){
  	regali[i] = new Regalo();
  	i++;
  }

  function Regalo(){
  	this.regalo = presentImage;
    this.elldiametro = 20;
  	this.display = function(){
      var posizione = myMap.latLngToPixel(myLat, myLon);
    	this.x = posizione.x;
    	this.y = posizione.y;
  		push();
            fill("blue");
            noStroke();
            ellipse(this.x,this.y, this.elldiametro);

  		pop();
  	}
    this.clicked = function() {
      var d = dist(mouseX, mouseY, this.x, this.y)
      if (d < this.elldiametro/2) {
        this.elldiametro = 0;
      }
    }
  }

  function Movement(posizione) {
  	myLat = posizione.latitude;
  	myLon = posizione.longitude;
  }

  this.touchMoved = function() {
    return false;
  }
}
