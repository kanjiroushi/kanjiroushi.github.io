
//canvas
let canvasWidth = 1000;
let canvasHeight = 1000;




//buttons
let greyScale = false;
let showPoly = false;
let showVectorMask = false;

let timeout;

var paint;
var c;

let imgURL = 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Tsunami_by_hokusai_19th_century.jpg';

var sourceImgColors = [];
var maxProb = 2; //on a un max de 8000 points
var pointBudget = 3000;
var resolution = 10;

var img;

var imagePixels;
var tesselPixels = [];


function preload() {
  img = loadImage(imgURL);
}






function loadImg() {


  


  background(255);
  //We load the image pixels
  canvasHeight =  ceil(canvasWidth * img.height / img.width);
  resizeCanvas(canvasWidth,canvasHeight);
  image(img,0 ,0,canvasWidth,canvasHeight,0,0,img.width,img.height);
  
  if(greyScale) filter(GRAY);
  loadPixels(); 

  //If the alpha is 0, we put it white
  for(var x=0;x<width;x++) {
    for(var y=0;y<height;y++) {
      if(pixels[(x+y*width)*4 + 3] == 0) {
        pixels[(x+y*width)*4] = 255;
        pixels[(x+y*width)*4+1] = 255;
        pixels[(x+y*width)*4+2] = 255;
        pixels[(x+y*width)*4+3] = 255;
      }
    }
  }
  //We pixelate a bit
  //LenaJS.pixelate(pixels,3);
  updatePixels();


  var imageDataCopyBis = new ImageData(pixels, width, height);
  imagePixels = imageDataCopyBis.data;


  let imageData = Object.assign(c.elt.getContext("2d").getImageData(0, 0, width, height));
  let imageDataCopy = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  imageDataCopy = LenaJS.grayscale(imageDataCopy);
  imageDataCopy = LenaJS.pixelate(imageDataCopy,10);
  imageDataCopy = LenaJS.canny(imageDataCopy);
  imageDataCopy = LenaJS.invert(imageDataCopy);
  imageDataCopy = LenaJS.bigGaussian(imageDataCopy);
  imageDataCopy = LenaJS.pixelate(imageDataCopy,10);
  imageDataCopy = LenaJS.bigGaussian(imageDataCopy);
  imageDataCopy = LenaJS.boost(imageDataCopy,254,40);
  //imageDataCopy = LenaJS.lowpass5(imageDataCopy);
  //

  if(showVectorMask) {
    for(var x=0;x<width;x++) {
      for(var y=0;y<height;y++) {

        pixels[(x+y*width)*4] = imageDataCopy.data[(x+y*width)*4];
        pixels[(x+y*width)*4+1] = imageDataCopy.data[(x+y*width)*4+1];
        pixels[(x+y*width)*4+2] = imageDataCopy.data[(x+y*width)*4+1];
      }
    }
    updatePixels();
    return;
  }
  let averageColor = 0;
  for(var x=0;x<width;x++) {
    for(var y=0;y<height;y++) {

      colX = floor(x/resolution);
      colY = floor(y/resolution);
      tesselPixels[(x+y*width)*4] = imageDataCopy.data[(x+y*width)*4];
      tesselPixels[(x+y*width)*4+1] = imageDataCopy.data[(x+y*width)*4+1];
      tesselPixels[(x+y*width)*4+2] = imageDataCopy.data[(x+y*width)*4+2];

      averageColor += (tesselPixels[(x+y*width)*4] +tesselPixels[(x+y*width)*4+1]+tesselPixels[(x+y*width)*4+2])/3;
    }
  }
  averageColor = floor(averageColor / width / height);

  maxProb = pointBudget / canvasWidth / canvasHeight * 100 * map(averageColor,0,255,1,5) * 2 ;
  console.log('average color for image '+averageColor+' and probability '+maxProb);

  background(255);
  paint = new Paint();
  paint.show();

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
  
  checkbox1 = createCheckbox('Grey scale', greyScale);
  checkbox1.changed(setGreyScale);

  checkbox1 = createCheckbox('show triangles', showPoly);
  checkbox1.changed(setShowPoly);

  checkbox1 = createCheckbox('show vector mask', showVectorMask);
  checkbox1.changed(setShowVectorMask);


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
  paint.displayTriangles();
}
function setShowVectorMask() {
  if (this.checked()) {
    showVectorMask= true;
  } else {
    showVectorMask = false;
  }
  loadImg();
}

function changeNbPoints() {
  points = this.value();
}

function mouseClicked() {
  clearTimeout(timeout);
  paint.addPoint(mouseX,mouseY);
  fill(0);
  stroke(255);
  ellipse(mouseX,mouseY,5);
  timeout = setTimeout(addPointRedraw,1000);
}
function addPointRedraw() {
  console.log('redrawing');
  paint.calcTriangles();
  paint.displayTriangles();
}

function draw() {
  if (mouseIsPressed) {
    if(random() > 0.5) return;
    clearTimeout(timeout);
    paint.addPoint(mouseX,mouseY);
    fill(0);
    stroke(255);
    ellipse(mouseX,mouseY,5);
    timeout = setTimeout(addPointRedraw,300);
  }
}
