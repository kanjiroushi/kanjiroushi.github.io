function Point() {
  this.x = round(random(0,canvasWidth));
  this.y = round(random(0,canvasHeight));
  this.r = 1;
  this.isGrowing = true;

  var off = (this.y * canvasWidth + this.x) * 4; 
  var components = [ pixels[off], pixels[off + 1], pixels[off + 2]]; 
  if(!components[0]) return;
  this.color = color(components[0],components[1],components[2]);
}

Point.prototype.colorFound = function() {
  if(this.color != undefined) return true;
  return false;
}

Point.prototype.tooClose = function (point){
  if(dist(this.x,this.y,point.x,point.y) < this.r + point.r) return true;
  return false;
}

Point.prototype.draw = function () {
  fill(this.color);
  ellipse(this.x,this.y,this.r*2);
  if(this.isGrowing) this.r++;
}

Point.prototype.checkTooClose = function (points) {
  if(!this.isGrowing) return;
  for(var u=0;u<points.length;u++) {
    if(this.x == points[u].x && this.y == points[u].y ) continue;
    if(this.tooClose(points[u])) this.isGrowing = false;
  }
}