let view = 0;

function scrollToAnchor(aid) {
  // console.log(aid);
  // var target = $(aid).offset().top
  // console.log(target);
  // // The magic...smooth scrollin' goodness.
  // $("html, body").animate({
  //   scrollTop: target
  // }, 500);
  // //prevent the page from jumping down to our section.
  $('html, body').animate({
    scrollTop: $(`${aid}`).offset().top
  }, 10000);
}

function preload() {
  font = loadFont("js/VT323-Regular.ttf");
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('integration');
  noLoop();
  rectMode(CENTER);
  cntr = createVector(width / 2, height / 2);
  points = font.textToPoints("integration", 0, 0, sz, {
    sampleFactor: 5,
    simplifyThreshold: 1,
  });
  bounds = font.textBounds(" p5 ", 0, 0, sz);
  for (var i = 0; i < points.length; i++) {
    particles[i] = new Particle(
      (points[i].x + bounds.w / 2),
      (points[i].y) + (height / 2) + bounds.h / 2);
  }
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    if (view > 0) {
      view--;
    }
  } else if (keyCode == DOWN_ARROW) {
    view++;
  }
  scrollToAnchor(views[view]);
  document.getElementById("counter").innerHTML = view;
}

function draw() {
  background(255);
  stroke(0);
  strokeWeight(2);
  FlowField(cntr);
  for (var k = 0; k < particles.length; k++) {
    particles[k].update();
    particles[k].edge();
    particles[k].follow(flowfield);
  }
  beginShape();
  for (p = 0; p < particles.length; p++) {
    curveVertex(particles[p].pos.x, particles[p].pos.y);
  }
  endShape();
}