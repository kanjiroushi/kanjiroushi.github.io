
//canvas
let canvasWidth = 1000;
let canvasHeight = 1000;

let nbPointPerRound = 50;

let points = [];

let timeout;

var c;

let imgURL = 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Tsunami_by_hokusai_19th_century.jpg';

var img;


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
  
  loadPixels(); 

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
  saveCanvas(c, 'pointspaint', 'png');
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

function draw() {
  background(255);
  noStroke();
  //We add the points

  for(var i=0;i<nbPointPerRound;i++) {
    let pointToAdd = new Point();

    canAdd = true;
    if(!pointToAdd.colorFound()) canAdd = false;

    for(var u=0;u<points.length;u++) {
      if(pointToAdd.tooClose(points[u])) {
        canAdd = false;
        break;
      }
    }
    if(canAdd) points.push(pointToAdd);
  }

  //We draw them
  for(var u=0;u<points.length;u++) points[u].draw();
  for(var u=0;u<points.length;u++) points[u].checkTooClose(points);
}
