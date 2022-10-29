let font;
let points;
let bounds;
let sz = 200;
var scl = 50; // number of vectors in row/column
var xvec, yvec;
var noiseInc = 0.001; // zoom/scale of noise. lower number more gradual, higher more erratic.
var particles = [];
var flowfield;
let dir = -1;
let visField = false;
let cntr;
let spd = 0.0001;
let play = false;

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY < height && mouseY > 0) {
    play = !play;
    if (play) {
      loop();
    } else {
      noLoop();
    }
  }
}

function FlowField(origin) {
  xvec = floor((windowWidth + 50) / scl);
  yvec = floor((windowHeight + 50) / scl);
  flowfield = new Array(xvec * yvec);
  for (var y = 0; y < yvec; y++) {
    for (var x = 0; x < xvec; x++) {
      let place = createVector(x * scl, y * scl);
      let lineVector = p5.Vector.sub(origin, place);
      lineVector.setMag(dir * spd);
      var index = x + y * xvec;
      flowfield[index] = lineVector;
      if (visField) {
        stroke(180);
        push();
        stroke(0);
        translate(place.x, place.y);
        line(0, 0, 0 + lineVector.x, 0 + lineVector.y);
        pop();
      }
    }
  }
}

function Particle(ex, why) {
  this.x = ex;
  this.y = why;
  this.pos = createVector(this.x, this.y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.r = 0.5;
  this.maxspd = 100;
  this.update = function() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
    this.vel.limit(this.maxspd);
  };
  this.follow = function(vectors) {
    // flowfield vectors
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * xvec;
    var force = vectors[index];
    this.applyForce(force);
  };
  this.applyForce = function(force) {
    this.acc.add(force);
  };
  this.show = function() {
    fill(0, 0, 0, 100);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  };
  this.edge = function() {
    if (this.pos.x < -this.r) this.pos = createVector(this.x, this.y);
    if (this.pos.y < -this.r) this.pos = createVector(this.x, this.y);
    if (this.pos.x > width + this.r) this.pos = createVector(this.x, this.y);
    if (this.pos.y > height + this.r) this.pos = createVector(this.x, this.y);
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
// P5.js Code remixed from Daniel Shiffman instructional <https://www.youtube.com/watch?v=BjoM9oKOAKY&t=542s>