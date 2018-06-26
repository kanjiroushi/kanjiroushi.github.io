// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/AaGK-fj-BAM

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];
  this.dead = false;
  this.fitness = 0;

  this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      this.fitness += 10;
      return true;
    } else {
      return false;
    }
  }

  this.dir = function(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.death = function() {
    //we check reach wall
    if(this.x < 0 || this.x > width) this.dead = true;
    if(this.y < 0 || this.y > height) this.dead = true;
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.dead = true;
      }
    }
  }

  this.update = function() {
    for (var i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    if (this.total >= 1) {
      this.tail[this.total - 1] = createVector(this.x, this.y);
    }
    if(!this.dead) this.fitness++;
    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;
  }

  this.show = function() {
    if(this.dead) {
      console.log('you dead');
      return;
    }
    console.log('fitness',this.fitness);
    fill(255);
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
    fill(33,66,99);
    rect(this.x, this.y, scl, scl);

  }
}