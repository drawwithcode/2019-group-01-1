// =============================================================
// =                          GAME                             =
// =============================================================

//Define all the variables for the preload (images and position)
var position, yourpresent, importedpresent, database, lobster;

//Add socket.io variable
var socket;

function preload() {
  position = getCurrentPosition();
  yourpresent = loadImage("./assets/png/yourpresent.png");
  importedpresent = loadImage("./assets/png/importedpresent.png");
  database = loadJSON("../presents.json");
  lobster = loadFont('./assets/fonts/Lobster-Regular.ttf');
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

//Define index for the arrays
var i = 0;

var pressed = 0;
var givepresent;

//Boolean that stops interactions when a menu is open
var menu = 0;
var menuOn = false;
var alfa = 255;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.addClass("Canvas");

  //Create socket.io connection
  socket = io();

  //Get information from other players
  socket.on("Closing", stopIcon);
  socket.on('presentBroadcast', leavePresent);

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

  //Create present button
  givepresent = createImg("assets/gif/button.gif");
  givepresent.position(width / 2 - width/6, height / 1.3);
  givepresent.addClass("PresentButton");

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

  //Create a radar effect around you
  push();
  var myPosition = myMap.latLngToPixel(myLat, myLon);
  alfa = alfa - 3;
  noFill()
  stroke(255, 0, 0, alfa);
  ellipse(myPosition.x, myPosition.y, 255 - alfa);
  if (alfa < 0){
    alfa = 255;
  }
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

  //Display Menu when you give a present
  if (menu === 1) {
    push();
    if (menuOn === false) {
      $("#MenuPresent").css({"zIndex": "10", "opacity": "1"});
      $("#Question1").css("opacity", "1");
      $("#Send").css("opacity", "1");
      $("#QuestionName").css("opacity", "1");
      $("#back").css("opacity", "1");
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
      $("#back").css("opacity", "0");
      $("#Send").css("opacity", "0");
      $("#answer1").css("opacity", "1");
      $("#illustration").css({"pointerEvents": "auto", "opacity": "1", "background-image": "url(assets/gif/illustration"+round(random(4)+1)+".gif)"});
      if(document.getElementById("answer1").innerHTML === "sad"){
        $("#illustration").css("background-image", "url(assets/gif/illustration"+round(random(1)+3)+".gif)");
      } else if(document.getElementById("answer1").innerHTML === "normal"){
        $("#illustration").css("background-image", "url(assets/gif/illustration"+round(random(1)+1)+".gif)");
      } else if(document.getElementById("answer1").innerHTML === "happy"){
        $("#illustration").css("background-image", "url(assets/gif/illustration5.gif)");
      }
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

  if(mouseX > width/4 && mouseX < width*3/4){
    console.log("manuelita");
  }
  //Send Menu disappears when the button is pressed
  if (menu === 1 && menuOn === true && mouseX > width*2.85/8 && mouseX < width * 5.3/8 && mouseY > height*4.4/8 && mouseY < height*5.5/8) {
    GivePresent();
    menu = 0;
    $("#MenuPresent").css({"zIndex": "0", "opacity": "0"});
    $("#illustration").css({"pointerEvents": "none"});
    menuOn = false;
    givepresent.style("opacity", "1", "pointerEvents", "auto");
  }

  if(menu === 1 && menuOn === true){
    if(mouseY > height*3/4 || mouseY < height/4){
      menu = 0;
      $("#MenuPresent").css({"zIndex": "0", "opacity": "0"});
      $("#illustration").css({"pointerEvents": "none"});
      givepresent.style("opacity", "1", "pointerEvents", "auto");
      setTimeout(function(){menuOn = false;}, 300);
    }
  }

  //Receive Menu disappears when pressed
  if (menu === 2 && menuOn === true) {
    menu = 0;
    $("#MenuPresent").css({"zIndex": "0", "opacity": "0"});
    givepresent.style("opacity", "1", "pointerEvents", "auto");
    setTimeout(function(){menuOn = false;}, 300);
  }

  //Make present disappear after clicked
  for (var k = 0; k < regalimported.length; k++) {
    regalimported[k].clicked();
  }

  //Make present appear when the Button is clicked
  var dbutton = dist(mouseX, mouseY, width / 2, height / 1.2);
  if (dbutton < width / 5 && menuOn  === false && menu === 0) {
    PresentMenu();
  }
}

function PresentMenu() {
  menu = 1;
}

function GivePresent() {
  regali[i] = new Regalo();
  i++;
}

function stopIcon(stopIcon) {
  regalimported = [];
  database = loadJSON("../presents.json");
  setTimeout(function(){
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
  }, 1500);

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

  if (document.getElementById('sad').checked) {
    question1 = 1;
  } else if (document.getElementById('normal').checked) {
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
    console.log(maX,maY,this.x,this.y);
    var d = dist(maX, maY, this.x, this.y);
    console.log(d);
    if (d < 100 && menu === 0) {
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

  var json = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  }

  //Emit the present data to other people
  socket.emit('present', json);
}

function leavePresent(request) {
  regalimported = [];
  database = loadJSON("../presents.json");
  setTimeout(function(){
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
  },1000);
}

function RegaloImported(data) {
  //Define the icon boolean that will say to show the image
  var iconshow = data.show;
  var question1 = data.q1;
  var posizione;
  rx = data.x;
  ry = data.y;
  index = data.index;

  this.display = function() {
    //Define dinamically the position of the icon on the map
    posizione = myMap.latLngToPixel(rx, ry);
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
        mx: posizione.x,
        my: posizione.y,
        index: index
      }

      socket.emit('closepresent', close);
    }
  }

  this.opened = function() {
    if (question1 === 1) {
      document.getElementById("answer1").innerHTML = "sad";
    } else if (question1 === 2) {
      document.getElementById("answer1").innerHTML = "normal";
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

//Ask permission on IOs s devices
function touchEnded(event) {
  DeviceOrientationEvent.requestPermission()
}

// =============================================================
// =                LOAD AND GOTO ANIMATION                    =
// =============================================================

$( document ).ready(function(){
  setTimeout(function(){$("#g").addClass("animateload");}, 1600);
  setTimeout(function(){$("#b").addClass("animateload");}, 1800);
  setTimeout(function(){$("#r").addClass("animateload");}, 2000);
});
