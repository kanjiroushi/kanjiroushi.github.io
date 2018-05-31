function Paint() {
  this.points = [];
  this.triangles = [];
}


Paint.prototype.calcTriangles = function() {
  var vertices = [];


  for(var i = 0;i<this.points.length;i++) vertices.push(new delaunay.Vertex(this.points[i].x,this.points[i].y));

  this.triangles = delaunay.triangulate(vertices);
}


Paint.prototype.show = function() {
  background(255);

console.log('calculating points');
  //Need to calculate the points per square
  for(var x =0;x < width;x++) {
    for(var y =0;y < height;y++) {
      sColor = {R:0,G:0,B:0};
      sColor.R = pixels[(x+y*width)*4];
      sColor.G = pixels[(x+y*width)*4+1];
      sColor.B = pixels[(x+y*width)*4+2];
      probability = map((255 - (sColor.R + sColor.G + sColor.B) / 3),0,255,0,maxProb) / 100;
      if(random() < probability) {
        this.points.push({x:x,y:y});
      }
    }
  }
console.log(this.points.length + ' points to display');
if(this.points.length > 8000) {
  console.log('too many points');
  return;
}
console.log('calculating triangles');
  this.calcTriangles();
console.log(this.triangles.length + ' triangles'); 

console.log('displaying the triangles'); 
  noFill();
  stroke(100);
  for(var i =0;i < this.triangles.length;i++) {

    let centerX = floor((this.triangles[i].v0.x + this.triangles[i].v1.x + this.triangles[i].v2.x)/3);
    let centerY = floor((this.triangles[i].v0.y + this.triangles[i].v1.y + this.triangles[i].v2.y)/3);
    sColor = {R:0,G:0,B:0};
    sColor.R = pixels[(centerX+centerY*width)*4];
    sColor.G = pixels[(centerX+centerY*width)*4+1];
    sColor.B = pixels[(centerX+centerY*width)*4+2];
    fill(sColor.R,sColor.G,sColor.B);
    if(!showPoly) stroke(sColor.R,sColor.G,sColor.B);
    beginShape();
    vertex(this.triangles[i].v0.x, this.triangles[i].v0.y);
    vertex(this.triangles[i].v1.x, this.triangles[i].v1.y);
    vertex(this.triangles[i].v2.x, this.triangles[i].v2.y);
    endShape(CLOSE);
  }
}


