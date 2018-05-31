

function Vehicle(x,y) {
  this.pos = createVector(x,y);
  this.vel = p5.Vector.random2D();
  this.acc = createVector();

  //old mode, random based on generation number and hue
  //colorMode(HSB,100);
  this.outboundMode = 'boxed';  //boxed OR loop OR none

  this.target = createVector(random(width), random(height));

  this.r = 10;
  this.maxspeed = 5;
  this.maxforce = 0.5;
}

Vehicle.prototype.setNewDestination = function(x,y) {
  this.target = createVector(x, y);
}

Vehicle.prototype.behaviors = function(vehicles) {
//  var arrive = this.arrive(this.target);
//  arrive.mult(1);
//  this.applyForce(arrive);

  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse);
  flee.mult(2);
  this.applyForce(flee);

  var away = this.awayFromWall();
  away.mult(3);
  this.applyForce(away);
  
  var separate = this.separate(vehicles);
  separate.mult(3);
  this.applyForce(separate);

}


Vehicle.prototype.applyForce = function(f) {
  this.acc.add(f);
}

Vehicle.prototype.update = function() {

  this.previousPos = this.pos.copy();
  this.pos.add(this.vel);

  let deltaPos = p5.Vector.sub(this.pos,this.previousPos);
  //if(deltaPos.mag() < 0.5) this.pos = this.previousPos;


  this.vel.add(this.acc);
  this.acc.mult(0);

  if(this.outboundMode == 'boxed') {
    if(this.pos.x < 0) this.pos.x = 0;
    if(this.pos.x > width) this.pos.x = width;
    if(this.pos.y < 0) this.pos.y = 0;
    if(this.pos.y > height) this.pos.y = height;
  }

  if(this.outboundMode == 'loop') {
    if(this.pos.x < 0) this.pos.x = width;
    if(this.pos.x > width) this.pos.x = 0;
    if(this.pos.y < 0) this.pos.y = height;
    if(this.pos.y > height) this.pos.y = 0;
  }

}

Vehicle.prototype.show = function() {
  
  //Old mode color based on generation number
  fill(0);
  stroke(0);
  ellipse(this.pos.x, this.pos.y,this.r);


  //video based color
  //var px = floor(this.pos.x / vScale);
  //var py = floor(this.pos.y / vScale);
  //var col = video.get(px,py);
  //fill(col);
  //stroke(col);
  //ellipse(this.pos.x, this.pos.y,this.r);

}




//////////////////////
// List of behaviours
//////////////////////


Vehicle.prototype.arrive = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  var speed = this.maxspeed;
  if (d < 50) {
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
}

Vehicle.prototype.flee = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  if (d < 50) {
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

Vehicle.prototype.awayFromWall = function(target) {
  let vectors = [];
  if(this.pos.x < 10) vectors.push(createVector(10,0));
  if(this.pos.x > width - 10) vectors.push(createVector(-10,0));
  if(this.pos.y < 10) vectors.push(createVector(0,10));
  if(this.pos.y > height - 10) vectors.push(createVector(0,-10));
  
  let returnVector = createVector(0, 0);
  if(vectors.length == 0) return returnVector;
  for(var i = 0;i < vectors.length;i++) returnVector.add(vectors[i]);
  returnVector.normalize().mag(this.maxforce);
  return returnVector;
}


Vehicle.prototype.separate = function(vehicles) {
  let desiredSeparation = this.r * 3;
  let sum = createVector(0, 0);
  let count = 0;

  for(var i =0;i< vehicles.length;i++) {
    let other = vehicles[i];
    d = this.pos.dist(other.pos);
    if(d > 0 && d < desiredSeparation) {
      diff = p5.Vector.sub(this.pos,other.pos);
      diff.normalize(); //we want the vector to be length 1, because it is the distance that set the force
      diff.div(d); //the closer the other, the bigger the vector
      sum.add(diff);
      count++;
    }
  }
  //Now we have all the vactors sumed up
  if(count > 0) {
    var steer = p5.Vector.sub(sum, this.vel);
    steer.normalize().mag(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }


}
