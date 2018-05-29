function Poi() {
  this.x = floor(random(0,width-0));
  this.y = floor(random(0,height-0));
  this.adnNum = this.x*this.y;
}

Poi.prototype.getADN = function() {
	return this.x+'@'+this.y+'|';
}