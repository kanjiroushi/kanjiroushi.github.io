// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/AaGK-fj-BAM

function Snake(numSnake) {
  this.restart();
  //new neural network, first number must be number of capteurs and last must be 2, acc and steering
  this.NN = new NN([3*nbDirections,6,1]);
  this.snakeNum = numSnake;
}

Snake.prototype.restart = function(snakeNum,posX = 0,posY = 0) {
  this.pos = createVector(posX,posY);
  this.speed = createVector(1,0);
  this.total = 0;
  this.tail = [];
  this.dead = false;
  this.fitness = 0;
  this.food;
  this.foodNum=0;
  this.pickFoodLocation();
  this.lastEat = 0;
  this.snakeNum = snakeNum;
}

Snake.prototype.eat = function() {
  var d = dist(this.pos.x, this.pos.y, this.food.x, this.food.y);
  if (d < 1) {
    this.total++;
    this.fitness += 10;
    this.lastEat = 0;
    this.pickFoodLocation();
    return true;
  } else {
    return false;
  }
}


Snake.prototype.pickFoodLocation = function() {
  this.food = foodLocations[this.foodNum];
  this.foodNum++;
}



Snake.prototype.crossFit = function(father,mother) {
  this.NN.crossFit(Object.assign(father.NN),Object.assign(mother.NN));
}
Snake.prototype.mutate = function() {
  this.NN.mutate();
}

Snake.prototype.calculateDirection = function() {
  background(51);
  this.show(true);
  loadPixels();
  //Need to calculate the distance to the border and set them
  inputTensor = Array.apply(null, Array(nbDirections*3)).map(Number.prototype.valueOf,1);

  for(var i=0;i<nbDirections;i++) {
    let angle = i * 2*PI / nbDirections;
    let vectorView = this.speed.copy().rotate(angle);
    //console.log(vectorView);
    //We look 45 blocks ahead and check if there is food, out of boud or snake
    let mesures = [undefined,undefined,undefined];
    for(u=1;u<=2*nbSquares;u++) {
      //We calculate the point
      vectorView.setMag(u*scl);
      let point = p5.Vector.add(this.pos,vectorView);
      point.x += scl/2;
      point.y += scl/2;

      //out of bound
      if(
        mesures[0] == undefined && 
        (point.x < 0 || point.x > width || point.y < 0 || point.y > height)
      ) {
        mesures[0] = u;
        break;
      }
      let color = pixels[(floor(point.x)+floor(point.y)*width)*4];
      //snake
      if(color == 255 && mesures[1] == undefined) mesures[1] = u;
      //food
      if(color == 120 && mesures[2] == undefined) mesures[2] = u;
    }
    for(t=0;t<3;t++) {
      if(mesures[t]) inputTensor[3*i+t] = mesures[t]*2/45-1;
    }
    //if(u >= visibilitySteps) this.distanceToWallsPixels[i] = createVector(-50, -50);
    //this.distanceToWalls[i] = map(u, 1, visibilitySteps+1, -1, 1);
  }

  let NNOutput = this.NN.processInput(inputTensor);
  //keep same direction
  if(NNOutput[0] < -0.5) {
    //keep same direction
  } else if(NNOutput[0] < 0) {
    this.speed.rotate(- PI /2); //turn left
  } else if(NNOutput[0] < 0.5) {
    this.speed.rotate(PI /2); //turn right
  } else {
    this.speed.rotate(PI); //other way around
  }
}

Snake.prototype.dir = function(x, y) {
  this.speed.x = x;
  this.speed.y = y;
}

Snake.prototype.death = function() {
  if(this.dead) return;
  //we check reach wall
  if(this.pos.x < 0 || this.pos.x >= width) this.dead = true;
  if(this.pos.y < 0 || this.pos.y >= height) this.dead = true;
  if(this.lastEat > starve) {
    this.dead = true;
    this.lastEat = 0;
    this.fitness -= starve * fitnessAlive;
  }
  for (var i = 0; i < this.tail.length; i++) {
    var pos = this.tail[i];
    var d = dist(this.pos.x, this.pos.y, pos.x, pos.y);
    if (d < 1) {
      this.dead = true;
    }
  }
}

Snake.prototype.update = function() {
  this.lastEat++;
  for (var i = 0; i < this.tail.length - 1; i++) {
    this.tail[i] = this.tail[i + 1];
  }
  if (this.total >= 1) {
    this.tail[this.total - 1] = createVector(this.pos.x, this.pos.y);
  }
  if(!this.dead) {
    //0.5 point for alive
    this.fitness += fitnessAlive;
    //and a bit of point for being closer to the 
    this.fitness += 1 - dist(this.pos.x, this.pos.y, this.food.x, this.food.y) / maxDist;
  }
  this.pos.x = this.pos.x + this.speed.x * scl;
  this.pos.y = this.pos.y + this.speed.y * scl;
}

Snake.prototype.show = function(fakeColor = false) {

  if(this.dead) {
    return;
  }

  if(fakeColor) {
    colorMode(RGB);
    fill(255);
  }
  else {
    colorMode(HSB,nbSnakes);
    fill(this.snakeNum,255,255);
  }
  for (var i = 0; i < this.tail.length; i++) {
    rect(this.tail[i].x, this.tail[i].y, scl, scl);
  }
  rect(this.pos.x, this.pos.y, scl, scl);

  //We display the food
  if(fakeColor) fill(120,120, 120);
  else {
    fill(this.snakeNum,255,255);
  }
  rect(this.food.x, this.food.y, scl, scl);

  if(!fakeColor) {
    fill(0,255,255);
    rect(this.food.x+scl/4, this.food.y+scl/4, scl/2, scl/2);
  } 
}
