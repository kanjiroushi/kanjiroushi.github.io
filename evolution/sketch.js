
//canvas
let canvasWidth = 400*2;
let canvasHeight = 268*2;

//points parameters
let minPoints = 900;
let maxPoints = 900;
let nbPaints = 10;

let mutationRate = 0.10;
let newGeneRate = 1;

var paints = [];

var showImage = false;

var sourceImgColors = [];
var resolution = 10; //nb pixels per square

var minFitness = 100000;
var imageNum = 1;
var generation = 1;

var img;
function preload() {
  img = loadImage('https://upload.wikimedia.org/wikipedia/commons/a/a5/Tsunami_by_hokusai_19th_century.jpg');

}


function loadImg() {
  background(0);
  //We load the image pixels
  let destWidth = canvasWidth;
  let destHeight = canvasHeight;
  if(img.width*canvasHeight > img.height*canvasWidth ) {
    destWidth = canvasWidth;
    destHeight = floor(img.height * canvasHeight / img.width);
  } else {
    destWidth = floor(img.width * canvasWidth / img.height);
    destHeight = canvasHeight;
  }

  imgX = floor((canvasWidth - destWidth)/2);
  imgY = floor((canvasHeight - destHeight)/2);
  image(img,imgX ,imgY,destWidth,destHeight,0,0,img.width,img.height);
  loadPixels(); 



  for(var x=0;x<width;x++) {
    for(var y=0;y<height;y++) {

      colX = floor(x/resolution);
      colY = floor(y/resolution);

      if(!sourceImgColors[colX]) sourceImgColors[colX] = [];
      if(!sourceImgColors[colX][colY]) sourceImgColors[colX][colY] = {'R':0,'G':0,'B':0};

      sourceImgColors[colX][colY].R += pixels[(x+y*canvasWidth)*4];
      sourceImgColors[colX][colY].G += pixels[(x+y*canvasWidth)*4+1];
      sourceImgColors[colX][colY].B += pixels[(x+y*canvasWidth)*4+2];
    }
  }

  //We linearize the color
  for(var colX=0;colX<floor(width/resolution);colX++) {
    for(var colY=0;colY<floor(height/resolution);colY++) {
      sourceImgColors[colX][colY].R  = floor(sourceImgColors[colX][colY].R  / resolution / resolution);
      sourceImgColors[colX][colY].G  = floor(sourceImgColors[colX][colY].G  / resolution / resolution);
      sourceImgColors[colX][colY].B  = floor(sourceImgColors[colX][colY].B  / resolution / resolution);
    }
  }

  //We load the initial paints
  for(var i=0;i<nbPaints;i++) {
    paints[i] = new Paint();
    paints[i].calcTriangles();
    paints[i].calcFitness();
  }


  //Now we hide the image to display the circle
  if(!showImage) background(0);

/*
  for(var x=0;x<width;x++) {
    for(var y=0;y<height;y++) {

      colX = floor(x/resolution);
      colY = floor(y/resolution);


      set(x, y, color(sourceImgColors[colX][colY].R ,sourceImgColors[colX][colY].G ,sourceImgColors[colX][colY].B));
    }
  }
  updatePixels();
*/
//  paints[0].show();
}

function setup() {
  background(255);
  //Max canvas Size is 1000x1000

  c = createCanvas(canvasWidth,canvasHeight);
  pixelDensity(1);
  //We load the image
  loadImg();
}


function draw() {
  

  //wan to keep 10% of cars in the second half
  step = floor(nbPaints/10);
  store = [];
  start = nbPaints/2;
  i = 1;
  while(i < nbPaints/2) {
    paintNum = floor(nbPaints/2+i);
    store.push(paints[paintNum]);
    i += step;
  }
 //We kill the slow ones
  paints.splice(nbPaints/2,nbPaints);


  for (var i=0; i < store.length; i++) {
    paints.push( store[i] );
  }

  //only parent can crossFit
  whoCrossFit = floor(paints.length/2);

  
  //storeADN = [];
  //for(var i =whoCrossFit;i>=0;i--) {
  //  paintADN = paints[i].getADN();
  //  if(storeADN.indexOf(paintADN) >= 0) {
  //    console.log('ADN seen '+i+' thus removed');
  //    paints.splice(i,1);
  //    whoCrossFit--;
  //  } else storeADN.push(paintADN);
  //}
  

  while(paints.length != nbPaints) {
    paint = new Paint();
    //We select 2 parents in the existing cars
    var arr = []
    while(arr.length < 2){
        var randomnumber = Math.floor(Math.random()*whoCrossFit);
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    //We keep the best first, so the child gets more gen from the first
    arr.sort((a, b) => a - b);
    paint.crossFit(paints[arr[0]],paints[arr[1]]);
    paints.push(paint);
  }
  //console.log('underlyings pork');
  //We mutate them
  //We keep the best car pristine to have the best one
  for(i=1;i<nbPaints;i++) {
    paints[i].mutate();
  }
  

  //we recalculate the triangles
  for(var i=0;i<nbPaints;i++) {
    paints[i].calcTriangles();
    paints[i].calcFitness();
  }
  //the lower the better (perfect fit being 0)
  paints.sort(function(a,b) {return (a.fitness > b.fitness) ? 1 : -1;} );
  console.log(generation,paints[0].fitness,paints[0].genes.length);
  
  //1 out of 2 we display the best image or a random one
  //if(generation%2 ==0) paints[0].show();
  //else paints[floor(random(1,nbPaints))].show();
  paints[0].show();
/*  fill(0);
  stroke(0)
  text(generation,10,20);
*/
  generation++;
  /* ro record images
  //command line used
  //avconv -r 4 -f image2 -i LinePicture%03d.png  -s 800x600  -vcodec libx264 -r 24 test.mp4

  if(paints[0].fitness < minFitness) {
    saveCanvas(c, 'LinePicture'+imageNum, 'png');
    imageNum++;
    minFitness = paints[0].fitness;
  }
  */
}