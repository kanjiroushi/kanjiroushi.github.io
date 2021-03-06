var cars = [];
var track;

var speedSelect;

var started = false;
var startDate;
var endDate;
var frameNum = 0;

var mode = 'race'; //race or drawTrack

var trackPoints = [];


var defaultTrackPoints = [
  { x :50, y: 50 },
  { x :50, y: 200 },
  { x :150, y: 400 },
  { x :50, y: 600 },
  { x :130, y: 700 },
  { x :200, y: 700 },
  { x :400, y: 650 },
  { x :700, y: 700 },
  { x :650, y: 400 },
  { x :750, y: 50 },
  { x :150, y: 50 },
];

var mapSpeed = {
  'X1':1,
  'X2':2,
  'X4':4,
  'X8':8,
};

let raceOngoing = false;

let remainingCars = 0;

let bestUId = '';
let genFinish = '';
////genetic algo params
var nbCars = 80;
var generationNum = 0;
var mutationRate = 0.05; //number of genes we mutate


var stats = [];
function setup() {

  speedSelect = createSelect();
  speedSelect.position(1000, 5);
  speedSelect.option('X1');
  speedSelect.option('X2');
  speedSelect.option('X4');
  speedSelect.option('X8');


  button = createButton('draw race / race');
  button.position(1050, 5);
  button.mousePressed(changeMode);



  angleMode(RADIANS);
  createCanvas(1200,800);
  console.log('previous pixelDensity:'+pixelDensity());
  pixelDensity(1);
  //We create the track to get the pixels
  background(255);

  if(trackPoints.length == 0) trackPoints = defaultTrackPoints;

  track = new Track(trackPoints);
  track.draw();
  loadPixels();
  if(pixels[(50+50*width)*4] == 255) {
    alert('Issue loading pixels, this won t work');
    console.log(pixels[(50+50*width)*4]);
    noLoop();
  }

  restart(initCars = true);
}


function repositionCars() {
  //We put back the cars on the starting line
  for(var i=0;i<nbCars;i++) {
    cars[i].pos = createVector(50,70);
    cars[i].heading = createVector(0,50);
    cars[i].steering = 0; 
    cars[i].accelerator = 0; 
    cars[i].vel = createVector();
    cars[i].acc = createVector();
    cars[i].fitness = 0;
    cars[i].isCrashed = false;
    cars[i].isFinished = false;
    cars[i].distanceToWalls = [];
    cars[i].distanceToWallsPixels = [];
  }
}

function restart(initCars) {
  if(initCars) for(var i =0;i <nbCars;i++) cars.push(new Car());
  else {
    repositionCars();
  }
  frameNum = 0;
  startDate = new Date();
  generationNum++;

  console.log('starting generation '+generationNum);
}

function changeMode() {
  if(mode == 'race') {
    mode = 'drawTrack';
    trackPoints = [
      { x :50, y: 50 },
      { x :50, y: 200 }
    ];
    track = new Track(trackPoints);
  }
  else if(mode == 'drawTrack') {
    //We recalculate the pixels
    track = new Track(trackPoints);
    track.draw();
    loadPixels();
    repositionCars();
    genFinish = 0;
    mode = 'race';
  }
}

function mouseClicked() {

  if(mode == 'drawTrack') {
    if(mouseX < 40 || mouseY < 40 || mouseX > 750 || mouseY > 750) return;
    trackPoints.push({x:mouseX, y:mouseY});
    track = new Track(trackPoints);
  }
}


function draw() {
  if(mode == 'drawTrack') {
    background(255);
    track.draw();

  }
  else if(mode == 'race') {
    background(255);

    
    track.draw();

    raceOngoing = false;

    remainingCars = 0;


    for(var speed=1;speed<=mapSpeed[speedSelect.value()] ;speed++) {
      frameNum++;
      remainingCars = 0;
      for(var i=nbCars-1;i>=0;i--) {
        //We calculate the direction we want to take
        cars[i].calculateSteeringAndAccelerator();
        //We calculate the forces that apply to the car
        cars[i].behaviors();
        //We update the parameters
        cars[i].update();
        
        //We calculate the crashing
        if(!(cars[i].isCrashed || cars[i].isFinished)) {

          
          let tempFitness = track.getFitnessScore(cars[i],frameNum);
          if(!genFinish &&  cars[i].isFinished) genFinish = generationNum;
          remainingCars++;
          track.isCrashed(cars[i]);
          raceOngoing = true;
        }
      }
    }

    for(var i=nbCars-1;i>=0;i--) {
      cars[i].show();
    }
    //We draw th efirst neural network
    if(!(cars[0].isCrashed || cars[0].isFinished)) cars[0].NN.show();

    //We check if the race is over

  /*
    textSize(32);
    fill(0);
    stroke(0);
    text('fitness: '+car.fitness, 300, 200);

    if(startDate && endDate) text('Temps: '+(endDate.getTime() - startDate.getTime())/1000, 300, 250);
    textSize(20);
    /*
    for(var i=0;i<5;i++) {
      let angle = -1 * 90 + i * 90/2;
      text('dist to wall '+angle+'°: '+car.distanceToWalls[i], 300, 350 + 30*i);
    }
    //we also write the sterring and acc
    text('steering: '+car.steering, 300, 500);
    text('accelerator: '+car.accelerator, 300, 530);
  */
    textSize(32);
    fill(0);
    stroke(255);
    text('frame: '+frameNum,810,350);
    text('generation: '+generationNum,810,380);


    text('framerate: '+parseInt(frameRate()),810,410);
    text('nb remains: '+remainingCars,810,440);

    if(genFinish) {
      fill('#EFD807');
      text('gen finish: '+genFinish,810,470);
      fill(0);
    }

    textSize(20);
    textStyle(BOLD);
    text('gen',812,500);
    text('mean',865,500);
    text('max',965,500);
    textStyle(NORMAL);
    for(var i = 1;i <=17;i++ ) {
      pos = stats.length - i;
      if(pos >=0) {
        text(pos+1,820,500 + i *20);
        text(format(stats[pos].mean),860,500 + i *20);
        text(format(stats[pos].max),950,500 + i *20);
      }
    }


    if(raceOngoing) endDate = new Date();
    else {
  //console.log('round finished');
      //We sort the cars by fitness
      cars.sort(function(a,b) {return (a.fitness > b.fitness) ? -1 : 1;} ); 
  //console.log('sorted');
      
      mean = cars.reduce((acc, c) => acc + c.fitness,0) / nbCars;
      max  = cars.reduce((acc, c) => (c.fitness > acc)?c.fitness:acc,0);

      stats.push({'mean':mean,'max':max});


      //wan to keep 10% of cars in the second half
      step = floor(nbCars/10);
      store = [];
      start = nbCars/2;
      i = 1;
      while(i < nbCars/2) {
        carNum = floor(nbCars/2+i);
        store.push(cars[carNum]);
        i += step;
      }

      //We kill the slow ones
      cars.splice(nbCars/2,nbCars);


      for (var i=0; i < store.length; i++) {
        cars.push( store[i] );
      }

      //only parent can crossFit
      whoCrossFit = floor(cars.length/2);
      
      while(cars.length != nbCars) {
        car = new Car();
        //We select 2 parents in the existing cars
        var arr = []
        while(arr.length < 2){
            var randomnumber = Math.floor(Math.random()*whoCrossFit);
            if(arr.indexOf(randomnumber) > -1) continue;
            arr[arr.length] = randomnumber;
        }
        //We keep the best first, so the child gets more gen from the first
        arr.sort((a, b) => a - b);
        car.crossFit(cars[arr[0]],cars[arr[1]]);
        cars.push(car);
      }
  //console.log('underlyings pork');
      //We mutate them
      //We keep the best car pristine to have the best one
      for(i=1;i<nbCars;i++) {
        cars[i].mutate();
      }
      bestUId = cars[0].uid;
      console.log('best',cars[0]);
      restart(false);
    }
  }

} //end draw

function format(number) {
  return parseInt(number * 1000) / 1000;
}