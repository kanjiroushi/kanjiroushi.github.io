function Paint() {
  this.vehicles = [];
  this.triangles = [];
  for(var i = 0;i<points;i++) this.vehicles.push(new Vehicle(floor(width/2 + random(-10,10)),floor(height/2 + random(-10,10))));
}

Paint.prototype.addVehicule = function(x,y) {
  this.vehicles.push(new Vehicle(x,y));
}
Paint.prototype.calcTriangles = function() {
  var vertices = [];
  
  //We push the 4 corners
  vertices.push(new delaunay.Vertex(0,0));
  vertices.push(new delaunay.Vertex(width/2,0));
  vertices.push(new delaunay.Vertex(width,0));
  vertices.push(new delaunay.Vertex(0,height/2));
  vertices.push(new delaunay.Vertex(0,height));
  vertices.push(new delaunay.Vertex(width/2,height));
  vertices.push(new delaunay.Vertex(width,height/2));
  vertices.push(new delaunay.Vertex(width,height));

  for(var i = 0;i<this.vehicles.length;i++) vertices.push(new delaunay.Vertex(this.vehicles[i].pos.x,this.vehicles[i].pos.y));

  this.triangles = delaunay.triangulate(vertices);
}


Paint.prototype.show = function() {
  background(255);

  //We move the vehicles
  for (var i = 0; i < this.vehicles.length; i++) {
    var v = this.vehicles[i];
    v.behaviors(this.vehicles);
    v.update();
  }
  
  //We claculate the new triangles
  this.calcTriangles();

  noStroke();
  noFill();
  for(var i =0;i < this.triangles.length;i++) {
    //We calculate the center of the triangle
    let centerX = floor((this.triangles[i].v0.x + this.triangles[i].v1.x + this.triangles[i].v2.x)/3);
    let centerY = floor((this.triangles[i].v0.y + this.triangles[i].v1.y + this.triangles[i].v2.y)/3);

    //We test taht the triangle is still in the image
    if(centerX < 0) centerX = 0;
    if(centerX >= width) centerX = width - 1;
    if(centerY < 0) centerY = 0;
    if(centerY >= height) centerY = height - 1;
    //We retrieve the color of the underlying image
    colX = floor(centerX/resolution);
    colY = floor(centerY/resolution);
    sColor = sourceImgColors[colX][colY];

    //console.log(sColor.R,sColor.G,sColor.B);
    fill(sColor.R,sColor.G,sColor.B);
    if(!showPoly) stroke(sColor.R,sColor.G,sColor.B);
    else stroke(100);

    
    beginShape();
    vertex(this.triangles[i].v0.x, this.triangles[i].v0.y);
    vertex(this.triangles[i].v1.x, this.triangles[i].v1.y);
    vertex(this.triangles[i].v2.x, this.triangles[i].v2.y);
    endShape(CLOSE);
  }

}


