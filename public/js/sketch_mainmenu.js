// =============================================================
// =                       MAIN MENU                           =
// =============================================================

//Array that holds the snowflake objects
let snowflakes = [];

//Define variables for all the preload files (images and font)
var menuillustration, logo, lobster;

function preload(){
  menuillustration = loadImage("./assets/png/mainmenu.png");
  logo = loadImage("./assets/png/logo.png");
  lobster = loadFont('./assets/fonts/Lobster-Regular.ttf');
}

function setup(){
  createCanvas(windowWidth,windowHeight);
}

function draw(){
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
    ellipse(windowWidth/2, windowHeight/3, windowWidth/2.5);
    fill(255);
    text("Play", width/2-2, windowHeight/3+12);
    animate();
  } else{
    fill("#ff0160");
    ellipse(windowWidth/2-5, windowHeight/3-10, windowWidth/2.5);
    fill(255);
    text("Play", width/2-5, windowHeight/3+5);
  }
  pop();

  //Show Illustration
  push();
  imageMode(CENTER);
  image(menuillustration, windowWidth/2, windowHeight/1.6, width, width/2);

  //Show Logo
  image(logo, windowWidth/2, windowHeight/8, width/1.2, width/2.4);
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

// snowflake class
function snowflake() {
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(10, 15);
  this.opacità = 255;

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
    this.opacità = this.opacità - frameCount/1000;
    fill(255,255,255,this.opacità);
    ellipse(this.posX, this.posY, this.size);
  };
}

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

function animate(){
  setTimeout(function(){$("#b").addClass("animategoto");}, 200);
  setTimeout(function(){$("#r").addClass("animategoto");}, 400);
  setTimeout(function(){$("#g").addClass("animategoto");}, 600);
  setTimeout(function(){window.location.href = "game.html";}, 1600);
}
