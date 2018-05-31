
//canvas
let canvasWidth = 1000;
let canvasHeight = 1000;




//buttons
let greyScale = false;
let sliderPoints;
let showPoly = false;

var paint;

var sourceImgColors = [];
var maxProb = 0; //on a un max de 8000 points
var pointBudget = 8000;
var img;

function preload() {
  img = loadImage('https://upload.wikimedia.org/wikipedia/commons/a/a5/Tsunami_by_hokusai_19th_century.jpg');
}


function loadImg() {
  background(255);
  //We load the image pixels
  let destWidth = canvasWidth;
  let destHeight = canvasHeight;

  canvasHeight =  ceil(canvasWidth * img.height / img.width);
  resizeCanvas(canvasWidth,canvasHeight);
  

  image(img,0 ,0,canvasWidth,canvasHeight,0,0,img.width,img.height);
  
  if(greyScale) filter(GRAY);
  loadPixels(); 


  let averageColor = 0;
  for(var x=0;x<width;x++) {
    for(var y=0;y<height;y++) {
      averageColor += (pixels[(x+y*width)*4] +pixels[(x+y*width)*4+1]+pixels[(x+y*width)*4+2])/3;
   }
  }
  averageColor = floor(averageColor / width / height);
  
  maxProb = pointBudget / canvasWidth / canvasHeight * 100 * map(averageColor,0,255,1,5);
  console.log('average color for image '+averageColor+' and probability '+maxProb);


  //We load the initial paint
  paint = new Paint();
  paint.show();



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


  createElement('h3','Paramètres');

  createFileInput(fileLoaded);

  createElement('br');
  createElement('br');
  
  checkbox1 = createCheckbox('Grey scale', greyScale);
  checkbox1.changed(setGreyScale);

  checkbox1 = createCheckbox('show border', showPoly);
  checkbox1.changed(setShowPoly);


  createElement('br');
  createElement('br');

  createDiv('canvas Width');
  var inp1 = createInput(canvasWidth,'number');
  inp1.input(changeCanvasWidth);

  buttReload = createButton('Reload');
  buttReload.mousePressed(reloadImg);

  createElement('br');
  createElement('br');
  createDiv('point budget');

  var inp15 = createInput(pointBudget,'number');
  inp15.input(changePointBudget);

  buttReload2 = createButton('Reload');
  buttReload2.mousePressed(reloadImg);

  


  createElement('br');
  createElement('br');


  button4 = createButton('Save Image');
  button4.mousePressed(saveImage);

  createElement('br');
  createElement('br');

  button4 = createButton('Redraw');
  button4.mousePressed(redrawImage);
}


function redrawImage() {
  paint = new Paint();
  paint.show();
}
function saveImage() {
  saveCanvas(c, 'tesselation', 'png');
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

function changeCanvasWidth() {
  canvasWidth = parseInt(this.value());
}
function changePointBudget() {
  pointBudget = parseInt(this.value());
}

function setGreyScale() {
  if (this.checked()) {
    greyScale = true;
  } else {
    greyScale = false;
  }
  loadImg();
}
function setShowPoly() {
  if (this.checked()) {
    showPoly= true;
  } else {
    showPoly = false;
  }
  redrawImage();
}

function changeNbPoints() {
  points = this.value();
}