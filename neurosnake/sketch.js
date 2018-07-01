// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/AaGK-fj-BAM

var snakes = [];
var scl = 20;
var nbSquares = 20;
var nbSnakes = 40;
var starve = 60;
var maxDist = 0;
var foodLocations = [];
var generationNum = 0;
var mutationRate = 0.1;
var speed = 4;
var fitnessAlive = 0.1;
var nbDirections = 4;

function setup() {
  pixelDensity(1);
  createCanvas(scl*nbSquares, scl*nbSquares);
  maxDist = Math.sqrt(2*Math.pow(scl*nbSquares,2));

  //allare fighting for same food
  for(i=0; i<100;i++) {
    var cols = floor(width/scl);
    var rows = floor(height/scl);
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scl);
    foodLocations.push(food);
  }
  for(var i = 0;i<nbSnakes;i++) snakes.push(new Snake(i));
}


function draw() {

  for(var i = 0;i<nbSnakes;i++) {
    snakes[i].death();
    snakes[i].eat();
    snakes[i].calculateDirection();
    snakes[i].update();
  }
  
  background(51);
  remainingSnakes = 0;
  for(var i = 0;i<nbSnakes;i++) {
    if(!snakes[i].dead) remainingSnakes++;
    snakes[i].show(false);
  }
  if(!remainingSnakes) {


    snakes.sort(function(a,b) {return (a.fitness > b.fitness) ? -1 : 1;} ); 
    mean = snakes.reduce((acc, c) => acc + c.fitness,0) / nbSnakes;
    maxVal  = snakes.reduce((acc, c) => (c.fitness > acc)?c.fitness:acc,0);
    generationNum++;

    console.log(generationNum,mean,maxVal);

   //wan to keep 10% of snakes in the second half
    step = floor(nbSnakes/10);
    store = [];
    start = nbSnakes/2;
    i = 1;
    while(i < nbSnakes/2) {
      snakeNum = floor(nbSnakes/2+i);
      store.push(snakes[snakeNum]);
      i += step;
    }

    //We kill the slow ones
    snakes.splice(nbSnakes/2,nbSnakes);


    for (var i=0; i < store.length; i++) {
      snakes.push( store[i] );
    }
    //only parent can crossFit
    whoCrossFit = floor(snakes.length/2);
    
    while(snakes.length != nbSnakes) {
      snake = new Snake();
      //We select 2 parents in the existing snakes
      var arr = []
      while(arr.length < 2){
          var randomnumber = Math.floor(Math.random()*whoCrossFit);
          if(arr.indexOf(randomnumber) > -1) continue;
          arr[arr.length] = randomnumber;
      }
      //We keep the best first, so the child gets more gen from the first
      arr.sort((a, b) => a - b);
      snake.crossFit(snakes[arr[0]],snakes[arr[1]]);
      snakes.push(snake);
    }
//console.log('underlyings pork');
    //We mutate them
    //We keep the best car pristine to have the best one
    for(i=1;i<nbSnakes;i++) {
      snakes[i].mutate();
    }

    //We reset the food and the snakes positions
    foodLocations = [];
    for(i=0; i<100;i++) {
      var cols = floor(width/scl);
      var rows = floor(height/scl);
      food = createVector(floor(random(cols)), floor(random(rows)));
      food.mult(scl);
      foodLocations.push(food);
    }

    colX = floor(random(600/scl))*scl;
    colY = floor(random(600/scl))*scl;
    colX = 10*scl;
    colY = 10*scl;
    for(i=0;i<nbSnakes;i++) {
      snakes[i].restart(i,colX,colY);
    }
  }
}

