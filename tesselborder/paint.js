function Paint() {
  this.points = [];
  this.triangles = [];
}


Paint.prototype.addPoint = function(x,y) {
  this.points.push({x:x,y:y});
}

Paint.prototype.calcTriangles = function() {
  var vertices = [];

    //We push the 4 corners
  vertices.push(new delaunay.Vertex(0,0));
  vertices.push(new delaunay.Vertex(width,0));
  vertices.push(new delaunay.Vertex(0,height));
  vertices.push(new delaunay.Vertex(width,height));



  for(var i = 0;i<this.points.length;i++) vertices.push(new delaunay.Vertex(this.points[i].x,this.points[i].y));

  this.triangles = delaunay.triangulate(vertices);
}


Paint.prototype.show = function() {
  background(255);

console.log('calculating points');
  //Need to calculate the points per square
  this.calculePointsFromMap();
console.log('calculating triangles');
  this.calcTriangles();
console.log(this.triangles.length + ' triangles'); 

console.log('displaying the triangles'); 
  this.displayTriangles();
}

Paint.prototype.calculePointsFromMap = function() {
  this.points = [];
  for(var x =0;x < width;x++) {
    for(var y =0;y < height;y++) {
      sColor = {R:0,G:0,B:0};
      sColor.R = tesselPixels[(x+y*width)*4];
      sColor.G = tesselPixels[(x+y*width)*4+1];
      sColor.B = tesselPixels[(x+y*width)*4+2];

      probability = map((255 - (sColor.R + sColor.G + sColor.B) / 3),0,255,maxProb/50,maxProb) / 100;
      if(random() < probability) {
        this.points.push({x:x,y:y});
      }
    }
  }
  console.log(this.points.length + ' points to display');
  if(this.points.length > pointBudget) {
    var nbPointsToRemove = this.points.length - pointBudget;
    console.log('too many points, over budget '+ pointBudget +', removing random points '+nbPointsToRemove);
    for(var i=0;i<nbPointsToRemove;i++) {
      this.points.splice(floor(random(0,this.points.length)),1);
    }
    console.log('better: '+this.points.length);
  }
}

Paint.prototype.displayTriangles = function() {
  noFill();
  for(var i =0;i < this.triangles.length;i++) {

    let centerX = floor((this.triangles[i].v0.x + this.triangles[i].v1.x + this.triangles[i].v2.x)/3);
    let centerY = floor((this.triangles[i].v0.y + this.triangles[i].v1.y + this.triangles[i].v2.y)/3);
    sColor = {R:0,G:0,B:0};
    sColor.R = imagePixels[(centerX+centerY*width)*4];
    sColor.G = imagePixels[(centerX+centerY*width)*4+1];
    sColor.B = imagePixels[(centerX+centerY*width)*4+2];

    


    fill(sColor.R,sColor.G,sColor.B);
    if(!showPoly) stroke(sColor.R,sColor.G,sColor.B);
    beginShape();
    vertex(this.triangles[i].v0.x, this.triangles[i].v0.y);
    vertex(this.triangles[i].v1.x, this.triangles[i].v1.y);
    vertex(this.triangles[i].v2.x, this.triangles[i].v2.y);
    endShape(CLOSE);
  }
}


