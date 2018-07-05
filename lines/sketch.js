
//canvas
let canvasWidth = 1000;
let canvasHeight = 1000;


let points = [];

let timeout;

var c;

let imgURL = 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Tsunami_by_hokusai_19th_century.jpg';

var img;


var nbDirections = 32;
var nbPointPerRound = 50;
var threshold = 130;
var thresholdEcartType = 110;

var whiteOnBlack = false;

function preload() {
  img = loadImage(imgURL);
}






function loadImg() {

  background(255);
  points = [];
  //We load the image pixels
  canvasHeight =  ceil(canvasWidth * img.height / img.width);
  resizeCanvas(canvasWidth,canvasHeight);
  image(img,0 ,0,canvasWidth,canvasHeight,0,0,img.width,img.height);
  filter(GRAY);
  loadPixels(); 
  if(whiteOnBlack) background(0);
  else background(255);
}

function setup() {




  background(255);
  //Max canvas Size is 1000x1000

  c = createCanvas(canvasWidth,canvasHeight);
  pixelDensity(1);
  //We load the image
  loadImg();


  createElement('h2','Paramètres');


  createElement('h3','File');
  createFileInput(fileLoaded);
  createElement('br');
  createElement('div','Or image URL');
  var inp35 = createInput(imgURL,'text');
  inp35.input(changeImgURL);
  buttLoadURL = createButton('Load URL');
  buttLoadURL.mousePressed(loadURL);


  createElement('br');
  createElement('br');

  createDiv('canvas Width');
  var inp1 = createInput(canvasWidth,'number');
  inp1.input(changeCanvasWidth);

  buttReload = createButton('Reload');
  buttReload.mousePressed(reloadImg);

  createElement('br');
  createElement('br');
  createDiv('nb points per frame');

  var inp15 = createInput(nbPointPerRound,'number');
  inp15.input(changeNbPoints);

  createElement('br');
  createDiv('threshold average color');
  var inp16 = createInput(threshold,'number');
  inp15.input(changeThreshold);
  createElement('br');
  createDiv('threshold standard deviation');
  var inp16 = createInput(thresholdEcartType,'number');
  inp16.input(changeThresholdEcartType);
  

  createElement('br');
  checkbox1 = createCheckbox('White on black', whiteOnBlack);
  checkbox1.changed(setWhiteOnBlack);

  createElement('br');
  buttReload2 = createButton('Reload');
  buttReload2.mousePressed(reloadImg);

  
  createElement('br');
  createElement('br');


  button4 = createButton('Save Image');
  button4.mousePressed(saveImage);


}

function redrawImage() {
  paint = new Paint();
  paint.show();
}
function saveImage() {
  saveCanvas(c, 'lines', 'png');
}

function fileLoaded(file) {
  console.log(file); 
  if (file.type === 'image') { 
      loadImage(file.data,function(newImg) { 
      console.log(newImg);
      img = newImg;
      loadImg();
    });
    } else alert('this is not an image');
}

function reloadImg() {
  loadImg();
}

function loadURL() {
  img = loadImage(imgURL, function() {
    loadImg();
  }, function() {
    alert('Issue loading image');
  });
}
function changeImgURL() {
  imgURL = this.value();
}

function changeCanvasWidth() {
  canvasWidth = parseInt(this.value());
}
function changeNbPoints() {
  nbPointPerRound = parseInt(this.value());
}

function changeThreshold() {
  threshold = parseInt(this.value());
  if(threshold < 5) threshold = 5;
  if(threshold > 250) threshold = 250;
}

function changeThresholdEcartType() {
  thresholdEcartType = parseInt(this.value());
  if(thresholdEcartType < 1) thresholdEcartType = 1;
  if(thresholdEcartType > 254) thresholdEcartType = 254;
}

function setWhiteOnBlack() {
  if (this.checked()) {
    whiteOnBlack = true;
  } else {
    whiteOnBlack = false;
  }
}


function draw() {
 // background(255);
  stroke(0);
  //We add the points
  if(!pixels[(1+width)*4]) return;

  for(var i=0;i<nbPointPerRound;i++) {
    x = floor(random(0,width));
    y  = floor(random(0,width));
    r = floor(random(5,30));
    v = createVector(1,0);
    //console.log(x,y,r);
    let maximum = [];
    for(var u=0;u<nbDirections;u++) {
      let angle = u * 2*PI / nbDirections;
      v.rotate(angle);
      v.setMag(1);
      
      for(var dist=1;dist<r;dist++) {
        v.setMag(dist);
        if(!maximum[u]) maximum[u] = 0;
        maximum[u] += pixels[(floor(x+v.x)+floor(y+v.y)*width)*4];
      }
      //console.log(x,y,x+v.x,y+v.y);
      //line(x,y,x + v.x,y + v.y);
    }
    
    if(whiteOnBlack) var indexOfPickedValue = maximum.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    else var indexOfPickedValue = maximum.reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);
    
    if (isNaN(maximum[indexOfPickedValue])) continue;
    v = createVector(1,0);
    let angle = indexOfPickedValue * 2*PI / nbDirections;
    v.rotate(angle);
    v.setMag(r);
    let avColor = floor(maximum[indexOfPickedValue])/r;

    variance = 0;

    if(whiteOnBlack) var test = avColor > threshold;
    else var test = avColor < threshold;
    if(test) {
      
      for(var dist=1;dist<r;dist++) {
        v.setMag(dist);
        variance += Math.pow(pixels[(floor(x+v.x)+floor(y+v.y)*width)*4] - avColor,2);
        //if(pixels[(floor(x+v.x)+floor(y+v.y)*width)*4] > 255) pixels[(floor(x+v.x)+floor(y+v.y)*width)*4] = 255;
      }
      ecartType = Math.sqrt(variance / dist);
      
      if(ecartType <= thresholdEcartType) {
        for(var dist=1;dist<r;dist++) {
          v.setMag(dist);
          if(whiteOnBlack) pixels[(floor(x+v.x)+floor(y+v.y)*width)*4] = 0;
          else pixels[(floor(x+v.x)+floor(y+v.y)*width)*4] = 255;
          //if(pixels[(floor(x+v.x)+floor(y+v.y)*width)*4] > 255) pixels[(floor(x+v.x)+floor(y+v.y)*width)*4] = 255;
        }

        stroke(avColor);
        line(x,y,x + v.x,y + v.y);
      }
    }


    
    
  }
}
