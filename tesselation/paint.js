function Paint() {
  this.points = [];
  this.triangles = [];
  for(var i = 0;i<points;i++) this.points.push({x:floor(random(0,width)),y:floor(random(0,height))});
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
  background(150);
  if(this.triangles.length ==0) this.calcTriangles();
  noStroke();
  for(var i =0;i < this.triangles.length;i++) {
    //We calculate the center of the triangle
    let centerX = floor((this.triangles[i].v0.x + this.triangles[i].v1.x + this.triangles[i].v2.x)/3);
    let centerY = floor((this.triangles[i].v0.y + this.triangles[i].v1.y + this.triangles[i].v2.y)/3);
    //We retrieve the color of the underlying image
    colX = floor(centerX/resolution);
    colY = floor(centerY/resolution);
    sColor = sourceImgColors[colX][colY];
    fill(sColor.R,sColor.G,sColor.B);

    beginShape();
    vertex(this.triangles[i].v0.x, this.triangles[i].v0.y);
    vertex(this.triangles[i].v1.x, this.triangles[i].v1.y);
    vertex(this.triangles[i].v2.x, this.triangles[i].v2.y);
    endShape(CLOSE);
  }
}


