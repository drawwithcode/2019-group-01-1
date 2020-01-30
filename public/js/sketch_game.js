// =============================================================
// =                          GAME                             =
// =============================================================

//Define all the variables for the preload (images and position)
var position, yourpresent, importedpresent;

//Add socket.io variable
var socket;

function preload() {
  position = getCurrentPosition();
  yourpresent = loadImage("./assets/png/yourpresent.png");
  importedpresent = loadImage("./assets/png/importedpresent.png");
}

//create a map and load it from mapbox
var myMap;
var canvas;
var mappa = new Mappa('MapboxGL', "pk.eyJ1IjoiZWxsbGxhYXMiLCJhIjoiY2sybWU2c3JhMGZudTNvcDB0MzIybjM1ZiJ9.QEanQ7AjFqMkaCCghI-qig");

//define the style, zoom and rotation of the map
var options = {
  lat: 0,
  lng: 0,
  zoom: 20,
  maxZoom: 18,
  minZoom: 14,
  style: 'mapbox://styles/ellllaas/ck5pegaee60561ijyof7sstlx?optimize=true',
  interactive: true
}

//define the position of the user and it's coordinates
var myLat;
var myLon;

//Define arrays holding presents
var regali = [];
var regalimported = [];

//Define arrays holding positions
var imposition = [];

//Define index for the arrays
var i = 0;
var t = 0;
var o = 0;

var pressed = 0;
var givepresent;

//Boolean that stops interactions when a menu is open
var menu = 0;
var menuOn = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.addClass("Canvas");

  //Create socket.io connection
  socket = io();

  //Get information from other players
  socket.on("presentBroadcast", leavePresent);
  socket.on("Closing", stopIcon);
  socket.on("imposition", addPosition);

  //define that the position of the user will define his lat and his lon
  myLat = position.latitude;
  myLon = position.longitude;

  var impos = {
    x: myLat,
    y: myLon
  }

  //Emit position to other users
  socket.emit('position', impos);

  //Change position of the circle on position change
  watchPosition(Movement, 500);

  options.lat = myLat;
  options.lng = myLon;

  //define that the setup of the project will be the map
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  //Create present button
  givepresent = createImg("assets/gif/caricamento.gif");
  givepresent.position(width / 2 - width/6, height / 1.3);
  givepresent.addClass("PresentButton");
}

function draw() {
  clear();

  //Draw where you are
  push();
  var myPosition = myMap.latLngToPixel(myLat, myLon);
  fill(255, 0, 0, 30);
  stroke(255, 0, 0);
  ellipse(myPosition.x, myPosition.y, 20);
  pop();

  //Display Presents
  for (var j = 0; j < regali.length; j++) {
    regali[j].display();
  }

  //Display imported presents
  var regaloni = regalimported.length;
  for (var k = 0; k < regaloni; k++) {
    regalimported[k].display();
  }

  //Display Presents
  var useroni = imposition.length;
  for (var g = 0; g < useroni; g++) {
    imposition[g].display();
  }

  //Display Menu when you give a present
  if (menu === 1) {
    push();
    if (menuOn === false) {
      $("#MenuPresent").css({"zIndex": "10", "opacity": "1"});
      $("#Question1").css("opacity", "1");
      $("#Send").css("opacity", "1");
      $("#QuestionName").css("opacity", "1");
      $("#answer1").css("opacity", "0");
      $("#illustration").css({"pointerEvents": "none", "opacity": "0"});
      menuOn = true;
    }
    pop();
  }

  //Display Menu when the present is clicked
  if (menu === 2) {
    push();
    if (menuOn === false) {
      $("#MenuPresent").css({"zIndex": "10", "opacity": "1"});
      $("#Question1").css("opacity", "0");
      $("#QuestionName").css("opacity", "0");
      $("#Send").css("opacity", "0");
      $("#answer1").css("opacity", "1");
      $("#illustration").css({"pointerEvents": "auto", "opacity": "1", "background-image": "url(assets/gif/illustration"+round(random(2)+1)+".gif)"});
      menuOn = true;
    }
    pop();
  }

  //Don't show present button if the menu is on
  if (menu === 1 || menu === 2) {
    givepresent.style("opacity", "0", "pointerEvents", "none");
  }
}

function mouseClicked() {
  //Send Menu disappears when the button is pressed
  if (menu === 1 && mouseX > width*2.85/8 && mouseX < width * 5.3/8 && mouseY > height*4.4/8 && mouseY < height*5.5/8) {
    GivePresent();
    menu = 0;
    $("#MenuPresent").css({"zIndex": "0", "opacity": "0"});
    $("#illustration").css({"pointerEvents": "none"});
    menuOn = false;
    givepresent.style("opacity", "1", "pointerEvents", "auto");
  }

  //Receive Menu disappears when pressed
  if (menu === 2) {
    menu = 0;
    $("#MenuPresent").css({"zIndex": "0", "opacity": "0"});
    menuOn = false;
    givepresent.style("opacity", "1", "pointerEvents", "auto");
  }

  //Make present disappear after clicked
  for (var k = 0; k < regalimported.length; k++) {
    regalimported[k].clicked();
  }

  //Make present appear when the Button is clicked
  var dbutton = dist(mouseX, mouseY, width / 2, height / 1.2);
  if (dbutton < width / 5) {
    PresentMenu();
  }
}

function PresentMenu() {
  menu = 1;
}

function addPosition(impos) {
  imposition[o] = new Imposition(impos);
  o++;
}

function Imposition(impos) {
  var rx = impos.x;
  var ry = impos.y;
  var g = random(255);
  var b = random(255);

  this.display = function() {
    var posizione = myMap.latLngToPixel(rx, ry);
    this.x = posizione.x;
    this.y = posizione.y;
    fill(0, g, b, 15);
    stroke(0, g, b);
    ellipse(this.x, this.y, 20);
  }
}

function GivePresent() {
  regali[i] = new Regalo();
  i++;
}

function stopIcon(stopIcon) {
  for (var j = 0; j < regali.length; j++) {
    regali[j].close(stopIcon);
  }
}

//Object for Presents that you send
function Regalo() {
  //Variable that says if the present icon should be showed
  var iconshow = 0;
  var question1;
  var rx = myLat;
  var ry = myLon;

  if (document.getElementById('normal').checked) {
    question1 = 1;
  } else if (document.getElementById('smily').checked) {
    question1 = 2;
  } else if (document.getElementById('happy').checked) {
    question1 = 3;
  }

  this.display = function() {
    //Define dinamically the position of the icon on the map
    var posizione = myMap.latLngToPixel(rx, ry);
    this.x = posizione.x;
    this.y = posizione.y;

    //Create an icon where the present is left
    if (iconshow === 0) {
      push();
      imageMode(CENTER);
      icon = image(yourpresent, this.x, this.y, 60, 60);
      pop();
    }
  }

  this.close = function(stopIcon) {
    maX = stopIcon.mx;
    maY = stopIcon.my;
    var d = dist(maX, maY, this.x, this.y);
    if (d < 50 && menu === 0) {
      iconshow = 1;
    }
  }

  this.opened = function() {
    if (question1 === 1) {
      document.getElementById("answer1").innerHTML = "normal";
    } else if (question1 === 2) {
      document.getElementById("answer1").innerHTML = "smily";
    } else if (question1 === 3) {
      document.getElementById("answer1").innerHTML = "happy";
    }
  }

  var data = {
    x: rx,
    y: ry,
    q1: question1,
    show: iconshow
  }

  //Emit the present data to other people
  socket.emit('present', data);
}

function leavePresent(data) {
  regalimported[t] = new RegaloImported(data);
  t++;
}

function RegaloImported(data) {
  //Define the icon boolean that will say to show the image
  var iconshow = data.show;
  var question1 = data.q1;
  rx = data.x;
  ry = data.y;

  this.display = function() {
    //Define dinamically the position of the icon on the map
    var posizione = myMap.latLngToPixel(rx, ry);
    this.x = posizione.x;
    this.y = posizione.y;

    //Create an icon where the present is
    if (iconshow === 0) {
      push();
      imageMode(CENTER);
      icon = image(importedpresent, this.x, this.y, 60, 60);
      pop();
    }
  }

  this.clicked = function() {
    //Remove the present when you click on it
    var d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 50 && iconshow === 0 && menu === 0) {
      iconshow = 1;
      menu = 2;
      this.opened();

      var close = {
        mx: mouseX,
        my: mouseY
      }

      socket.emit('closing', close);
    }
  }

  this.opened = function() {
    if (question1 === 1) {
      document.getElementById("answer1").innerHTML = "normal";
    } else if (question1 === 2) {
      document.getElementById("answer1").innerHTML = "smily";
    } else if (question1 === 3) {
      document.getElementById("answer1").innerHTML = "happy";
    }
  }
}

//Change of the user position on movement
function Movement(posizione) {
  myLat = posizione.latitude;
  myLon = posizione.longitude;
}

//Stops screen from being dragged
this.touchMoved = function() {
  return false;
}

// =============================================================
// =                LOAD AND GOTO ANIMATION                    =
// =============================================================

$( document ).ready(function(){
  setTimeout(function(){$("#g").addClass("animateload");}, 1600);
  setTimeout(function(){$("#r").addClass("animateload");}, 1800);
  setTimeout(function(){$("#b").addClass("animateload");}, 2000);
});
