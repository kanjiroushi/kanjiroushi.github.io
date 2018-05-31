
//canvas
let canvasWidth = 600;
let canvasHeight = 600;

//points parameters
let points = 300;


//buttons
let greyScale = false;
let showPoly = false;

var paint;

var sourceImgColors = [];
var resolution = 10; //nb pixels per square

var img;

function preload() {
  img = loadImage('https://upload.wikimedia.org/wikipedia/commons/a/a5/Tsunami_by_hokusai_19th_century.jpg');
}


function loadImg() {
  background(255);
  
  canvasHeight =  ceil(canvasWidth * img.height / img.width);
  c = createCanvas(canvasWidth,canvasHeight);
  image(img,0 ,0,canvasWidth,canvasHeight,0,0,img.width,img.height);
  
  if(greyScale) filter(GRAY);
  loadPixels(); 


  sourceImgColors = [];
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

  //We load the initial paint
  paint = new Paint();
  paint.show();



  for(var x=0;x<width;x++) {
    for(var y=0;y<height;y++) {

      colX = floor(x/resolution);
      colY = floor(y/resolution);


      set(x, y, color(sourceImgColors[colX][colY].R ,sourceImgColors[colX][colY].G ,sourceImgColors[colX][colY].B));
    }
  }
  updatePixels();

//  paints[0].show();
}

function setup() {
  background(255);
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
  buttReload.mousePressed(loadImg);

  createElement('br');
  createElement('br');


  createDiv('nb points');
  var inp10 = createInput(points,'number');
  inp10.input(changeNbPoints);
  buttredrawPoints = createButton('Redraw');
  buttredrawPoints.mousePressed(redrawImage);


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

function changeCanvasWidth() {
  canvasWidth = parseInt(this.value());
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
  loadImg();
}

function changeNbPoints() {
  points = this.value();
}

function draw() {
  if (mouseIsPressed) {
    paint.addVehicule(mouseX,mouseY);
  }
  paint.show();
}
