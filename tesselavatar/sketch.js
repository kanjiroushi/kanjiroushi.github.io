
//canvas
let ratio = 2;
let canvasWidth = 256 * ratio;
let canvasHeight = 256 * ratio;

var c;

var string = 'Please change me and click Redraw';



function setup() {
  pixelDensity(1);
  c = createCanvas(canvasWidth,canvasHeight);
  
  drawImage();


  //Max canvas Size is 1000x1000

  
  
  createElement('h2','Paramètres');


  createElement('br');
  createElement('br');

  createDiv('canvas ratio');
  var inp1 = createInput(ratio,'number');
  inp1.input(changeRatio);

  createElement('br');
  createElement('br');

  createDiv('text to create the paint');
  var inp15 = createInput(string,'text');
  inp15.input(changeString);

  createElement('br');
  createElement('br');

  button4 = createButton('Save Image');
  button4.mousePressed(saveImage);

  createElement('br');
  createElement('br');

  button4 = createButton('Redraw');
  button4.mousePressed(drawImage);
}

function saveImage() {
  saveCanvas(c, 'tesselavatar', 'png');
}

function changeRatio() {
  ratio = parseInt(this.value());
  canvasWidth = 256 * ratio;
  canvasHeight = 256 * ratio;
}
function changeString() {
  string = this.value();
}


function drawImage() {
  let parts = [string.slice(0,string.length/2),string.slice(string.length/2)];

  //transform an array of number to an array of x - y
  const reducer = (acc,x) => {
    if(acc.length == 0) {
      acc.push({'x':x*ratio});
      return acc;
    }
    if(acc[acc.length-1].x != undefined && acc[acc.length-1].y != undefined) {
      acc.push({'x':x*ratio});
      return acc;
    }
    acc[acc.length-1].y = x*ratio;
    return acc;
  };
  
  points = sha512(parts[1]).match(/.{1,2}/g).map(x => parseInt(x,16)).reduce(reducer,[]);
  colors = sha512(parts[0]).match(/.{1,2}/g).map(x => parseInt(x,16));

  //we color the canvas
  colorMode(HSB,256);
  for(let i=0;i<256;i++) {
    colorNum = i%64;
    stroke(colors[colorNum],160,256);
    fill(colors[colorNum],160,256);
    let x = i%16 * 16 * ratio;
    let y = floor(i/16) * 16 * ratio;
    rect(x, y, 32,32);
  }

  loadPixels();
  colorMode(RGB);
  background(255);


  let vertices = [];

    //We push the 4 corners
  vertices.push(new delaunay.Vertex(0,0));
  vertices.push(new delaunay.Vertex(width,0));
  vertices.push(new delaunay.Vertex(0,height));
  vertices.push(new delaunay.Vertex(width,height));



  for(var i = 0;i<points.length;i++) vertices.push(new delaunay.Vertex(points[i].x,points[i].y));

  let triangles = delaunay.triangulate(vertices);

  noFill();
  for(var i =0;i < triangles.length;i++) {

    let centerX = floor((triangles[i].v0.x + triangles[i].v1.x + triangles[i].v2.x)/3);
    let centerY = floor((triangles[i].v0.y + triangles[i].v1.y + triangles[i].v2.y)/3);
    sColor = {R:0,G:0,B:0};
    sColor.R = pixels[(centerX+centerY*width)*4];
    sColor.G = pixels[(centerX+centerY*width)*4+1];
    sColor.B = pixels[(centerX+centerY*width)*4+2];

    


    fill(sColor.R,sColor.G,sColor.B);
    stroke(60,60,60);
    beginShape();
    vertex(triangles[i].v0.x, triangles[i].v0.y);
    vertex(triangles[i].v1.x, triangles[i].v1.y);
    vertex(triangles[i].v2.x, triangles[i].v2.y);
    endShape(CLOSE);
  }
}