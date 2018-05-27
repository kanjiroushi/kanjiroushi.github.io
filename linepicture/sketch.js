
//canvas
let canvasWidth = 1000;
let canvasHeight = 1000;

//sinusoide params
let startR = 1;
let distanceBetweenCircles = 6; //distance between 2 circles
let nbPixelsPerLine = 10; //how many pixels we want the line to represent
let maxAmplitude = 4; //max amplitude of the sinusoid
let maxRotations = 8; //number of oscillation max 
let speed = 30; //number of lines per frame
let drawColor = false; //do we display in color or black and white

////////////////////////////
//internal params
////////////////////////////
let tempResize = 500;
let theta = 0;
let r = startR;
let maxR = canvasWidth/2;
let c;
let previousX = 0;
let previousY = 0;

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
    destWidth = canvasWidth;
    destHeight = floor(img.height * canvasHeight / img.width);
  } else {
    destWidth = floor(img.width * canvasWidth / img.height);
    destHeight = canvasHeight;
  }

  imgX = floor((canvasWidth - destWidth)/2);
  imgY = floor((canvasHeight - destHeight)/2);

console.log(img,imgX ,imgY,destWidth,destHeight,img.width,img.height);


  image(img,imgX ,imgY,destWidth,destHeight,0,0,img.width,img.height);
  //filter(GRAY);

  loadPixels(); 

  //We put white the pixels on top and bottom
  if(imgY > 0) {
    for(let colX = 0;colX< canvasWidth;colX++) {
      for(let colY = 0;colY< imgY;colY++) {
        pixels[(colX+colY*canvasWidth)*4] = 255;
        pixels[(colX+colY*canvasWidth)*4+1] = 255;
        pixels[(colX+colY*canvasWidth)*4+2] = 255;
      }
    }
    for(let colX = 0;colX< canvasWidth;colX++) {
      for(let colY = canvasHeight-imgY;colY< canvasHeight;colY++) {
        pixels[(colX+colY*canvasWidth)*4] = 255;
        pixels[(colX+colY*canvasWidth)*4+1] = 255;
        pixels[(colX+colY*canvasWidth)*4+2] = 255;
      }
    }
  }
  //Now we hide the image to display the circle
  background(255);
}




function setup() {


  background(255);
  //Max canvas Size is 1000x1000

  c = createCanvas(canvasWidth,canvasHeight);

  //We load the image
  loadImg();


  createElement('h3','Paramètres');


  createDiv('Fichier');
  createFileInput(fileLoaded);

  createElement('br');
  createElement('br');

  createDiv('canvasSize');
  var inp1 = createInput(canvasWidth,'number');
  inp1.input(changeCanvasSize);

  buttReload = createButton('resize');
  buttReload.mousePressed(resize);


  createElement('br');
  createElement('br');
  
  checkbox1 = createCheckbox('Color stroke', drawColor);
  checkbox1.changed(setDrawColor);

  createElement('br');
  createElement('br');

  createDiv('drawing speed');
  sliderSpeed = createSlider(1,30,speed,1);


  createDiv('distance between circles');
  sliderDistance = createSlider(1,30,distanceBetweenCircles,1);
  
  
  createDiv('amplitude');
  sliderAmplitude = createSlider(1,15,maxAmplitude,1);
  

  createDiv('nbPixels per line');
  sliderNbPixelsPerLine = createSlider(5,50,nbPixelsPerLine,5);
  

  createDiv('nb sinusoids');
  sliderMaxRotations = createSlider(0,20,maxRotations,1);
  
  createElement('br');
  createElement('br');


  button = createButton('Redraw Image');
  button.mousePressed(redrawSin);

  button = createButton('Save Image');
  button.mousePressed(saveImage);


  redrawSin();

}


function changeCanvasSize() {
  tempResize = this.value();
}
function resize() {

  canvasWidth = parseInt(tempResize);
  canvasHeight = parseInt(tempResize);


  resizeCanvas(canvasWidth, canvasHeight);
  translate(-1*canvasWidth/2,-1*canvasHeight/2);
  loadImg();
  redrawSin();
}

function setDrawColor() {
  if (this.checked()) {
    drawColor = true;
  } else {
    drawColor = false;
  }
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
      translate(-1*canvasWidth/2,-1*canvasHeight/2);
      loadImg();
      redrawSin();
    });
    } else alert('this is not an image');
}


function redrawSin() {
  //We reset the background
  background(255);
  //We get the params for the drawing
  distanceBetweenCircles = sliderDistance.value();
  maxAmplitude = sliderAmplitude.value();
  nbPixelsPerLine = sliderNbPixelsPerLine.value();
  maxRotations = sliderMaxRotations.value();
  speed = sliderSpeed.value();

  previousX = 0;
  previousY = 0;
  
  maxR = canvasWidth/2;


  theta = 0;
  r = startR;

  loop();
}



function draw() {
  translate(canvasWidth/2,canvasHeight/2);


  if(r > maxR) noLoop();


  

  for(let lineNum=0;lineNum<speed;lineNum++) {
    let x = r * cos(theta);
    let y = r * sin(theta);




    if(previousX != 0) {
      let previousPos = createVector(previousX,previousY);
      let currentPos = createVector(x,y);


          

      //we take the color average in the box where the sinusoide while be drawn
      let imageX = floor(x) + canvasWidth/2;
      let imageY = floor(y) + canvasHeight/2;
      let previousImageX = floor(previousX) + canvasWidth/2;
      let previousImageY = floor(previousY) + canvasWidth/2;

      


      let startX = previousImageX;
      let endX = imageX;
      if(imageX < previousImageX) {
        startX = imageX;
        endX = previousImageX;
      }

      let startY = previousImageY;
      let endY = imageY;
      if(imageY < previousImageY) {
        startY = imageY;
        endY = previousImageY;
      }

      let RTotal = 0;
      let GTotal = 0;
      let BTotal = 0;
      let nbPoints = 0;
      for(let colX = startX;colX<= endX;colX++) {
        for(let colY = startY;colY<= endY;colY++) {
          RTotal += pixels[(colX+colY*canvasWidth)*4];
          GTotal += pixels[(colX+colY*canvasWidth)*4+1];
          BTotal += pixels[(colX+colY*canvasWidth)*4+2];
          nbPoints++;
        }
      }
      col = floor((RTotal+GTotal+BTotal)/(3*nbPoints));

      if(drawColor) {
        let Rcol = floor(RTotal/nbPoints);
        let GCol = floor(GTotal/nbPoints);
        let BCol = floor(BTotal/nbPoints);

        let maxWhite = 250;
        if(Rcol > maxWhite && GCol > maxWhite && BCol > maxWhite) {
          Rcol = maxWhite;
          GCol = maxWhite;
          BCol = maxWhite;
        }
        stroke(Rcol,GCol,BCol);
      } else stroke(0);
       //We put ourselves in the plane of the vector from previous to current
      translate(previousX,previousY);

      let a = PI/2 - atan2(x -previousX, y - previousY);

      rotate(a); //so the plane is oriented so that previousX previous Y = 0,0 and X, Y 

      //We get the size of the vector
      let distance = previousPos.dist(currentPos);
      
      //We are in the horizontal plane and need to display a sinusoid between 0,0 and distance,0
      
      //we draw a sinusoid
      //max size of sinusoid
      let amplitude = map(col,0,255,maxAmplitude,0);
      //nb rotation
      let nbRotation = floor(map(col,0,255,maxRotations,1));
      
      let nbPointsPerRotation = 16;
      let sinX = 0;
      let sinPrevY = 0;
      let dx = distance/(nbRotation*nbPointsPerRotation);
      n=1;
      
      beginShape();
      while(sinX < distance) {
        sinY = amplitude * sin(n*2*PI/nbPointsPerRotation);
        vertex(sinX,sinY);
        sinX += dx;
        sinPrevY = sinY;
        n++;
      }
      endShape();
      
      //line(0,0,distance,0);

      //We go back to global
      rotate(-a); 
      translate(-1 * previousX,-1 * previousY);

    }
    
    //We store the previous variables
    previousX = x;
    previousY = y;
    previousTheta = theta;
    previousR = r;

    //We calculate the angle
    //idea is to keep the line about the same zie (20px long)
    theta += atan(nbPixelsPerLine/r);
    theta = theta%(2*PI);

    //same for R, we want the distance between each circle to be consistent
    //thus it reduces the farther you are from the center
    let angleDiff = abs(theta-previousTheta)%(2*PI);
    if(angleDiff > PI) angleDiff = 2 * PI - angleDiff;
    r += angleDiff * distanceBetweenCircles / (2 * PI);
  }

}

