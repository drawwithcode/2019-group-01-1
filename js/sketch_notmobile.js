// =============================================================
// =                       MAIN MENU                           =
// =============================================================

//Array that holds the snowflake objects
let snowflakes = [];

//Define variables for all the preload files (images and font)
var menuillustration, logo, lobster;

function preload(){
  menuillustration = loadImage("./assets/png/desktop.png");
  logo = loadImage("./assets/png/logo.png");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
}

function draw(){
  clear();
  background("#b3f1f4");

  //Show Illustration
  push();
  imageMode(CENTER);
  image(menuillustration, windowWidth/2, windowHeight/2, width, width/2);

  //Show Logo
  image(logo, windowWidth/2, windowHeight/8, width/1.2, width/2.4);
  pop();

  //Create snowflakes for added Christmas
  let t = frameCount / 60;

  //create a random number of snowflakes each frame
  for (let i = 0; i < random(1); i++) {
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
  this.size = random(15, 20);

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
    ellipse(this.posX, this.posY, this.size);
  };
}
