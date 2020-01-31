// =============================================================
// =                       MAIN MENU                           =
// =============================================================

//Array that holds the snowflake objects
let snowflakes = [];

//Define variables for all the preload files (images and font)
var menuillustration, logo, lobster, lato;

function preload(){
  menuillustration = loadImage("./assets/png/mainmenu.png");
  logo = loadImage("./assets/png/logo.png");
  lobster = loadFont('./assets/fonts/Lobster-Regular.ttf');
  lato = loadFont('./assets/fonts/Lato-Regular.ttf');
}

function setup(){
  createCanvas(windowWidth,windowHeight); //Create canvas
}

function draw(){
  clear(); //Refresh canvas
  background("#b3f1f4"); //Set background to color

  //create distance variable for the Play button
  var d = dist(mouseX, mouseY, windowWidth/2-10, windowHeight/3-20);

  //Create Play button
  push();
  textAlign(CENTER);
  textSize(height/16);
  textFont(lobster);
  noStroke();
  fill(255);
  ellipse(windowWidth/2, windowHeight/3, height/5+20);
  fill("#d5004d");
  ellipse(windowWidth/2, windowHeight/3, height/5);
  //Add animation on press
  if(mouseIsPressed && d < height/10){
    fill("#ff0160");
    ellipse(windowWidth/2, windowHeight/3, height/5);
    fill(255);
    text("Play", width/2-2, windowHeight/3+12);
    animate();
  } else{
    fill("#ff0160");
    ellipse(windowWidth/2-5, windowHeight/3-10, height/5);
    fill(255);
    text("Play", width/2-5, windowHeight/3+5);
  }
  pop();

  //Show Illustration
  push();
  imageMode(CENTER);
  image(menuillustration, windowWidth/2, height/1.7, height/2.5, height/5);

  //Show Logo
  image(logo, windowWidth/2, windowHeight/8, height/2.5, height/5);
  pop();

  //Create snowflakes for added Christmas
  let t = frameCount / 60;

  //create a random number of snowflakes each frame
  for (let i = 0; i < random(0.5); i++) {
    snowflakes.push(new snowflake()); // append snowflake object
  }

  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }
}

// =============================================================
// =                          OBJECTS                          =
// =============================================================

//Snowflake Object
function snowflake() {
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(10, 15);

  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  this.display = function() {
    noStroke();
    fill(255,255,255,200);
    ellipse(this.posX, this.posY, this.size);
  };
}

// =============================================================
// =                          UTILITY                          =
// =============================================================

this.touchMoved = function() {
  return false;
}

//Ask permission on IOs s devices
function touchEnded(event) {
  DeviceOrientationEvent.requestPermission()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// =============================================================
// =                LOAD AND GOTO ANIMATION                    =
// =============================================================

$( document ).ready(function(){
  setTimeout(function(){$("#g").addClass("animateload");}, 1600);
  setTimeout(function(){$("#b").addClass("animateload");}, 1800);
  setTimeout(function(){$("#r").addClass("animateload");}, 2000);
});

function animate(){
  setTimeout(function(){$("#r").addClass("animategoto");}, 200);
  setTimeout(function(){$("#b").addClass("animategoto");}, 400);
  setTimeout(function(){$("#g").addClass("animategoto");}, 600);
  setTimeout(function(){window.location.href = "game.html";}, 1600);
}
