let carWidth = 10;
let maxSteering = 3.141592653589793/3;
let maxSpeed = 2;

let visibilitySteps = 60;
let pixelsBetweenSteps = 3;

function Car() {
  this.fitness = 0;
  this.uid = Math.random().toString(36).substring(7);
  this.pos = createVector(50,70); //Where is the car
  this.heading = createVector(0,50); //which direction the wheels are heading
  this.steering = 0; //beetween -1 and +1 (-1 = -90°)
  this.accelerator = 0; //beetween 0 and +1 (-1 = deceleration 0 same speed +1 = acc)
  this.vel = createVector();
  this.acc = createVector();
  this.isCrashed = false;
  this.isFinished = false;
  this.distanceToWalls = [];
  this.distanceToWallsPixels = []; //for display purpose

  //new neural network with 5 inputs, 6 neurones and 2 outputs (steering and acceleration)
  this.NN = new NN([3,5,2]);
}

Car.prototype.pork = function(father,mother) {
  this.NN.pork(Object.assign(father.NN),Object.assign(mother.NN));
}
Car.prototype.mutate = function() {
  this.NN.mutate();
}

Car.prototype.calculateSteeringAndAccelerator = function() {

  //Need to calculate the distance to the border and set them
  for(var i=0;i<3;i++) {
    let angle = -1 * PI /4 + i * PI/4;
    let vectorView = this.heading.copy().rotate(angle);
    //We look 100 pixel ahead and check if there is road
    for(u=1;u<=visibilitySteps;u++) {
      //We calculate the point
      vectorView.setMag(u*pixelsBetweenSteps);
      let point = p5.Vector.add(this.pos,vectorView);
      let color = pixels[(floor(point.x)+floor(point.y)*width)*4];
      if(color == 255) {
        this.distanceToWallsPixels[i] = createVector(floor(point.x), floor(point.y));
        break;
      }
    }
    if(u >= visibilitySteps) this.distanceToWallsPixels[i] = createVector(-50, -50);
    this.distanceToWalls[i] = map(u, 1, visibilitySteps+1, -1, 1);
  }
  let NNOutput = this.NN.processInput(this.distanceToWalls);
  this.accelerator = (NNOutput[0]+1)/2; //we expect accelerator between 0 and 1
  if(this.accelerator < 0.3) this.accelerator = 0.3;
  this.steering = NNOutput[1];
}

Car.prototype.setSteeringAndAccelerator = function(steering,accelerator) {
  
  this.steering = steering;
  this.accelerator = accelerator;
  //console.log(this.steering,this.accelerator);
}

Car.prototype.behaviors = function() {
  //the steering force
  var steeringForce = this.applySteeringAndAcc();
  this.applyForce(steeringForce);

}


Car.prototype.applyForce = function(f) {
  this.acc.add(f);
}

Car.prototype.update = function() {

  this.pos.add(this.vel);

  this.vel.add(this.acc);
  this.acc.mult(0);

  //We limit the speed
  if(this.vel.mag() > maxSpeed) this.vel.setMag(maxSpeed);

  //We erode a but the speed to make it stop if no accelerator
  this.vel.mult(0.98);

  //if the vel is not 0, we update the heading to match the vel
  let angle = this.heading.angleBetween(this.vel);

//console.log('position',this.pos,this.heading,this.vel,this.vel.mag(),angle);
  if(abs(this.vel.mag()) > 0.01) {
    this.heading = this.vel.copy();
    if(abs(angle) > PI - maxSteering-0.1) this.heading.mult(-1);
  }


}

Car.prototype.show = function() {
    
  if(this.isCrashed || this.isFinished) return false;
  //We display the car
  if(this.uid == bestUId) fill('#EFD807');
  else fill(200,30,30);
  stroke(0);
  strokeWeight(1);
  //We center at the car
  translate(this.pos.x, this.pos.y);
  //We rotate to match the heading
  var a = atan2(this.heading.x, this.heading.y);
  rotate(-a);

  rectMode(CENTER);
  rect(0,0, carWidth,carWidth*2);

  //we display the center of mass of car
  fill(255);
  stroke(255);
  ellipse(0,0,2);
  //We display the direction

  stroke(30,200,30);
  this.heading.setMag(carWidth*2);
  line(0, 0,0,carWidth*3);

  rotate(a);
  translate(-1*this.pos.x, -1*this.pos.y);

  for(var i = 0; i < this.distanceToWallsPixels.length;i++) {
    if(this.distanceToWallsPixels[i] == undefined) continue;
    fill(150);
    stroke(150);
    ellipse(this.distanceToWallsPixels[i].x,this.distanceToWallsPixels[i].y,4);
  }
  return true;
}




//////////////////////
// List of behaviours
//////////////////////
Car.prototype.applySteeringAndAcc = function() {
  //We have the heading
  let force = this.heading.copy();
  force.setMag(1);
  //We add the steering
  let reverse = 1;
  if(this.accelerator < 0) reverse = -1;
  force.rotate(reverse*maxSteering*this.steering);
  
  //The acceleration tells us if we accelerate or decelerate
  force.mult(this.accelerator/10);
  return force;
}




Car.prototype.arrive = function(target) {
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

Car.prototype.flee = function(target) {
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

Car.prototype.separate = function(vehicles) {
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
