
//canvas
let canvasWidth = 1200;
let canvasHeight = 1200;

//sinusoide params
let minRadius = 10;
let maxRadius = 10;
let minSize = 2;
let maxSize = 2;
let alpha = 255;

let border = 50;

let greyScale = false;
let showImage = false;
let crossPattern = false;

let pixelRatio = 1;
//internal params
let c;


var img;
function preload() {
  img = loadImage('https://upload.wikimedia.org/wikipedia/commons/a/a5/Tsunami_by_hokusai_19th_century.jpg');

}


function loadImg() {
  pixelDensity(1);
  background(255);
  //We load the image pixels
  let destWidth = canvasWidth;
  let destHeight = canvasHeight;
  if(img.width > img.height ) {
    destWidth = canvasWidth-2*border;
    destHeight = floor(img.height * canvasHeight / img.width);
  } else {
    destWidth = floor(img.width * canvasWidth / img.height);
    destHeight = canvasHeight-2*border;
  }

  imgX = floor((canvasWidth - destWidth)/2);
  imgY = floor((canvasHeight - destHeight)/2);
  image(img,imgX ,imgY,destWidth,destHeight,0,0,img.width,img.height);

  if(greyScale) filter(GRAY);

  loadPixels(); 

  //Now we hide the image to display the circle
  if(!showImage) background(255);
}

function setup() {


  background(255);
  //Max canvas Size is 1000x1000

  c = createCanvas(canvasWidth,canvasHeight);

  //We load the image
  loadImg();

  createElement('h3','Paramètres');

  createFileInput(fileLoaded);

  createElement('br');
  createElement('br');

  createDiv('canvasSize');
  var inp1 = createInput(canvasWidth,'number');
  inp1.input(changeCanvasWidth);
  var inp2 = createInput(canvasHeight,'number');
  inp2.input(changeCanvasHeight);

  buttReload = createButton('Reload');
  buttReload.mousePressed(reloadImg);


  createElement('br');
  createElement('br');

  checkbox1 = createCheckbox('Grey scale', greyScale);
  checkbox1.changed(setGreyScale);

  checkbox2 = createCheckbox('Show image', showImage);
  checkbox2.changed(setShowImage);

  checkbox3 = createCheckbox('Cross Pattern', crossPattern);
  checkbox3.changed(setCrossPattern);

  createElement('br');

  button1 = createButton('Start drawing');
  button1.mousePressed(startDrawing);

  button2 = createButton('Stop drawing');
  button2.mousePressed(stopDrawing);

  createElement('br');
  createElement('br');

  createDiv('minRadius');
  sliderMinRadius = createSlider(1,30,minRadius,1);
  
  createDiv('maxRadius');
  sliderMaxRadius = createSlider(1,30,maxRadius,1);
  
  createDiv('minSize');
  sliderMinSize = createSlider(2,50,minSize,1);
  
  createDiv('maxSize');
  sliderMinSize = createSlider(2,50,maxSize,1);
  
  createDiv('alpha');
  sliderAlpha = createSlider(0,255,alpha,1);

  createElement('br');
  createElement('br');

  button4 = createButton('Save Image');
  button4.mousePressed(saveImage);

  createElement('br');
  createElement('br');

  createElement('br');
  createElement('br');


  button3 = createButton('Erase Canvas');
  button3.mousePressed(Erase);


}


function reloadImg() {
  resizeCanvas(canvasWidth, canvasHeight);
  loadImg();
}


function changeCanvasWidth() {
  canvasWidth = this.value();
}
function changeCanvasHeight() {
  canvasHeight = this.value();
}

function setGreyScale() {
  if (this.checked()) {
    greyScale = true;
  } else {
    greyScale = false;
  }
  loadImg();
}

function setShowImage() {
  if (this.checked()) {
    showImage = true;
  } else {
    showImage = false;
  }
  loadImg();
}

function setCrossPattern() {
   if (this.checked()) {
    crossPattern = true;
  } else {
    crossPattern = false;
  }
}

function Erase() {
  console.log('erasing');
  background(255);
}
function saveImage() {
  saveCanvas(c, 'LinePicture', 'png');
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


function draw() {

  for(let u=0;u<100;u++) {
    drawVector(random(border,canvasWidth-border),random(border,canvasHeight-border));
  }
  //noLoop();
  /*
  distanceBetweenCircles = sliderDistance.value();
  maxAmplitude = sliderAmplitude.value();
  nbPixelsPerLine = sliderNbPixelsPerLine.value();
  maxRotations = sliderMaxRotations.value();
  */
}


function drawVector(x,y) {

  minRadius = sliderMinRadius.value();
  maxRadius = sliderMaxRadius.value();
  minSize = sliderMinSize.value();
  maxSize = sliderMinSize.value();
  alpha = sliderAlpha.value();


  let startVector = createVector(x,y); 
  let endVector = startVector.copy();

  let radius = floor(random(minRadius,maxRadius));

  let theta = random(0,360)*2*PI/360;
  let distance = random(minSize,maxSize);

  endVector.normalize();
  endVector.rotate(theta);
  endVector.setMag(distance);
  
  let RTotal = 0;
  let GTotal = 0;
  let BTotal = 0;
  let nbPoints = 0;

  let stars =[];

  if(crossPattern) {
    for(let i=1;i<4;i++) {
      stars[i] = endVector.copy();
      stars[i].rotate(i*PI/2);
    }
  }

  for(let i=1;i<distance;i++) {
    endVector.setMag(i);
    colX = floor(startVector.x + endVector.x);
    colY = floor(startVector.y + endVector.y);

    RTotal += pixels[(colX+colY*canvasWidth)*4];
    GTotal += pixels[(colX+colY*canvasWidth)*4+1];
    BTotal += pixels[(colX+colY*canvasWidth)*4+2];
    nbPoints++;
    if(crossPattern) {
      for(let j=1;j<4;j++) {
        stars[j].setMag(i);
        colX = floor(startVector.x + stars[j].x);
        colY = floor(startVector.y + stars[j].y);

        RTotal += pixels[(colX+colY*canvasWidth)*4];
        GTotal += pixels[(colX+colY*canvasWidth)*4+1];
        BTotal += pixels[(colX+colY*canvasWidth)*4+2];
        nbPoints++;
      }
    }
  }

  endVector.setMag(distance);
  stroke(floor(RTotal/nbPoints),floor(GTotal/nbPoints),floor(BTotal/nbPoints),alpha);
  fill(floor(RTotal/nbPoints),floor(GTotal/nbPoints),floor(BTotal/nbPoints),alpha);

  

  translate(startVector.x,startVector.y);
  for(let i=1;i<distance;i++) {
    endVector.setMag(i);
    //console.log('ellipse',colX,colY,radius,radius);
    ellipse(floor(endVector.x),floor(endVector.y),radius,radius);

    if(crossPattern) {
      for(let j=1;j<4;j++) {
        stars[j].setMag(i);
        ellipse(floor(stars[j].x),floor(stars[j].y),radius,radius);
      }
    }
  }
  translate(-1 * startVector.x,-1 * startVector.y);
  
}

function keyPressed() {
  console.log('key '+keyCode);
  if (keyCode === LEFT_ARROW) {
    stopDrawing();
  } else if (keyCode === RIGHT_ARROW) {
    startDrawing();
  }
}

function stopDrawing() {
  noLoop();
}
function startDrawing() {
  loop();
}


function mouseClicked() {
  drawVector(mouseX, mouseY);
}

function mouseDragged() {
  drawVector(mouseX, mouseY);
}
