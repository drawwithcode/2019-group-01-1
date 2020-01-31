// =============================================================
// =                          GAME                             =
// =============================================================

//Define utility variables
var socket, canvas, givepresent, alfa = 255;

//Define all the variables for the preload (images and position)
var position, yourpresent, importedpresent, database, lobster;

//create a map and load it from mapbox
var myMap;
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

function preload() {
  position = getCurrentPosition();
  yourpresent = loadImage("./assets/png/yourpresent.png");
  importedpresent = loadImage("./assets/png/importedpresent.png");
  database = loadJSON("../presents.json");
  lobster = loadFont('./assets/fonts/Lobster-Regular.ttf');
}

var myLat; //define the position of the user and it's coordinates
var myLon;

var regali = []; //Define arrays holding sent and recieved presents
var regalimported = [];
var i = 0; //Define index for your sent presents

var menu = 0; //Define Variables that stops interactions when a menu is open
var menuOn = false;

function setup() {
  //Create a canvas element and give it "Canvas" class
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.addClass("Canvas");

  //Create socket.io connection
  socket = io();

  //Receive information by the server from other users
  socket.on("Closing", stopIcon);
  socket.on('presentBroadcast', leavePresent);

  //Get Latitude and Longitude of User
  myLat = position.latitude;
  myLon = position.longitude;

  //Change position of the circle on position change
  watchPosition(Movement, 500);

  options.lat = myLat;
  options.lng = myLon;

  //Create the map and put it over the canvas
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  //Create Send Present button
  givepresent = createImg("assets/gif/button.gif");
  givepresent.position(width / 2 - width/6, height / 1.3);
  givepresent.addClass("PresentButton");

  //Scroll through the JSON to place every present in that list on your map
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
  clear(); //Refresh canvas

  //Draw where you are on the map
  push();
  var myPosition = myMap.latLngToPixel(myLat, myLon);
  fill(255, 0, 0, 30);
  stroke(255, 0, 0);
  ellipse(myPosition.x, myPosition.y, 20);

  //Create a Radar effect around your ellipse
  alfa = alfa - 3;
  noFill()
  stroke(255, 0, 0, alfa); //Transparency lessens over time
  ellipse(myPosition.x, myPosition.y, 255 - alfa);  //Radius increases over time
  if (alfa < 0){
    alfa = 255; //If alfa goes under 0 put it back to 255 to restart radar animation
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

  //Display send Menu when you touch the button
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

  //Display receive Menu when you touch a present
  if (menu === 2) {
    push();
    if (menuOn === false) {
      $("#MenuPresent").css({"zIndex": "10", "opacity": "1"});
      $("#Question1").css("opacity", "0");
      $("#QuestionName").css("opacity", "0");
      $("#back").css("opacity", "0");
      $("#Send").css("opacity", "0");
      $("#answer1").css("opacity", "1");
      $("#illustration").css({"pointerEvents": "auto", "opacity": "1"});
      //Choose random illustration by mood of the user that sent the present
      if(document.getElementById("answer1").innerHTML === "I'm not very good"){
        $("#illustration").css("background-image", "url(assets/gif/illustration"+round(random(1)+3)+".gif)");
      } else if(document.getElementById("answer1").innerHTML === "I'm as usual"){
        $("#illustration").css("background-image", "url(assets/gif/illustration"+round(random(1)+1)+".gif)");
      } else if(document.getElementById("answer1").innerHTML === "I'm great!"){
        $("#illustration").css("background-image", "url(assets/gif/illustration5.gif)");
      }
      menuOn = true;
    }
    pop();
  }

  //Don't show the Send Button if the menu is on
  if (menu === 1 || menu === 2) {
    givepresent.style("opacity", "0", "pointerEvents", "none");
  }
}

//Touch events (used only becouse in the Iphone the same function in mouseClicked didn't work)
function touchStarted(){

  //Send Menu disappears when the "Send" button is pressed
  if (menu === 1 && mouseX > width*2.85/8 && mouseX < width * 5.3/8 && mouseY > height*4.4/8 && mouseY < height*5.5/8) {
    if(document.getElementById('sad').checked || document.getElementById('normal').checked || document.getElementById('happy').checked){
      GivePresent();
      menu = 0;
      $("#MenuPresent").css({"zIndex": "0", "opacity": "0"});
      $("#illustration").css({"pointerEvents": "none"});
      menuOn = false;
      givepresent.style("opacity", "1", "pointerEvents", "auto");
    }
  }
}

//Touch events
function mouseClicked() {
  //Go back from Send Menu to Map by touching everywhere else on the screen
  if(menu === 1 && menuOn === true){
    if(mouseY > height*3/4 || mouseY < height/4){
      menu = 0;
      $("#MenuPresent").css({"zIndex": "0", "opacity": "0"});
      $("#illustration").css({"pointerEvents": "none"});
      givepresent.style("opacity", "1", "pointerEvents", "auto");
      setTimeout(function(){menuOn = false;}, 300);
    }
  }

  //Go back from Recieve Menu to Map by touching everywhere on the screen
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

  //Make present appear when the "Send" Button is clicked
  var dbutton = dist(mouseX, mouseY, width / 2, height / 1.2);
  if (dbutton < width / 5 && menuOn  === false && menu === 0) {
    menu = 1;
  }
}

// =============================================================
// =                          OBJECTS                          =
// =============================================================

//Object for Presents that you send
function Regalo() {
  var iconshow = 0; //Defines if the icon should be shown
  var question1; //Holds the answer to the question
  var rx = myLat; //Holds the answer to the question
  var ry = myLon;

  //Defines question answer by checking the radio buttons in the html
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
    //Stop showing icon if the present is clicked
    maX = stopIcon.mx;
    maY = stopIcon.my;
    var d = dist(maX, maY, this.x, this.y);
    if (d < 100 && menu === 0) {
      iconshow = 1;
    }
  }
}

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
}

//Object function for Imported presents
function RegaloImported(data) {
  var iconshow = data.show; //Same as Present object
  var question1 = data.q1;
  var posizione;
  rx = data.x;
  ry = data.y;
  index = data.index; //Index of the JSON entry

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

      //Holds location and index of closed Present
      var close = {
        mx: posizione.x,
        my: posizione.y,
        index: index
      }

      //Emit the closing to other users
      socket.emit('closepresent', close);
    }
  }

  this.opened = function() {
    //Write the comment of the Receive Menu when the present is being opened
    if (question1 === 1) {
      document.getElementById("answer1").innerHTML = "I'm not very good";
    } else if (question1 === 2) {
      document.getElementById("answer1").innerHTML = "I'm as usual";
    } else if (question1 === 3) {
      document.getElementById("answer1").innerHTML = "I'm Great!";
  }
}

// =============================================================
// =                      OTHER FUNCTIONS                      =
// =============================================================

//Create a new gift Object when the "Send" button is pressed
function GivePresent() {
  regali[i] = new Regalo();
  i++;
}

//Socket.io called function that comes on when someone opens a present
function stopIcon(stopIcon) {
  regalimported = []; //deletes all the previus shown presents
  database = loadJSON("../presents.json"); //Loads JSON with new informations
  //After some time to ensure that the JSON is loaded recreate all the presents Objects
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
  }, 1000);

  //Checks if the closed present was left by you and removes the icons in affermative case
  for (var j = 0; j < regali.length; j++) {
    regali[j].close(stopIcon);
  }
}

//Socket.io called function that comes on when someone leaves a present
function leavePresent(request) {
  regalimported = []; //As last function
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

//Change of the user position on movement
function Movement(posizione) {
  myLat = posizione.latitude;
  myLon = posizione.longitude;
}

// =============================================================
// =                          UTILITY                          =
// =============================================================

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
