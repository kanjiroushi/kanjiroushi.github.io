function Paint() {
  this.genes = [];
  this.triangles = [];
  this.fitness = 0;
  this.mutated = true;
  for(var i = 0;i<minPoints;i++) this.genes.push(new Poi());
}

Paint.prototype.getADN = function() {
  this.genes.sort(function(a,b) {return (a.adnNum > b.adnNum) ? 1 : -1;});
  return this.genes.reduce((acc,o) => acc + o.getADN(),'');
}

Paint.prototype.calcTriangles = function() {
  //we don t recalculate if no change
  if(!this.mutated) return;
  var vertices = [];
  
  //We push the 4 corners
  vertices.push(new delaunay.Vertex(0,0));
  vertices.push(new delaunay.Vertex(width,0));
  vertices.push(new delaunay.Vertex(0,height));
  vertices.push(new delaunay.Vertex(width,height));

  for(var i = 0;i<this.genes.length;i++) vertices.push(new delaunay.Vertex(this.genes[i].x,this.genes[i].y));

  this.triangles = delaunay.triangulate(vertices);
  this.mutated = false;
}


Paint.prototype.show = function() {
  background(150);
  
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

Paint.prototype.calcFitness = function() {
  this.show();
  loadPixels();
  let destImageColors = [];
  for(x=0;x<width;x++) {
    for(y=0;y<=height;y++) {

      colX = floor(x/resolution);
      colY = floor(y/resolution);

      if(!destImageColors[colX]) destImageColors[colX] = [];
      if(!destImageColors[colX][colY]) destImageColors[colX][colY] = {'R':0,'G':0,'B':0};

      destImageColors[colX][colY].R += pixels[(x+y*canvasWidth)*4];
      destImageColors[colX][colY].G += pixels[(x+y*canvasWidth)*4+1];
      destImageColors[colX][colY].B += pixels[(x+y*canvasWidth)*4+2];
    }
  }

  let fitness = 0;
  for(x=0;x<floor(width/resolution);x++) {
    for(y=0;y<floor(height/resolution);y++) {
        deltaR = floor(destImageColors[x][y].R  / resolution / resolution) - sourceImgColors[x][y].R;
        deltaG = floor(destImageColors[x][y].G  / resolution / resolution) - sourceImgColors[x][y].G;
        deltaB = floor(destImageColors[x][y].B  / resolution / resolution) - sourceImgColors[x][y].B;
        fitness += (deltaR * deltaR + deltaG * deltaG + deltaB * deltaB)/ 10000; //if too big a number the sort fails
    }
  }
  this.fitness = round(fitness*1000)/1000;
  return fitness;
}


Paint.prototype.crossFit = function(father,mother) {

//  console.log('crossfit');
  let maxGenes = max(father.genes.length,mother.genes.length);
  for(var geneNum=0;geneNum <maxGenes;geneNum++) {
    if(!father.genes[geneNum]) {
      this.genes[geneNum] = Object.assign(mother.genes[geneNum]);
    //  console.log(geneNum+' NO father');
    } else if(!mother.genes[geneNum]) {
      this.genes[geneNum] = Object.assign(father.genes[geneNum]);
    //  console.log(geneNum+' NO mother');
    } else {
      if(Math.random() > 0.5) {
      //  console.log(geneNum+' father selected');
        this.genes[geneNum] = Object.assign(father.genes[geneNum]);
      } else {
      //  console.log(geneNum+' mother selected');
        this.genes[geneNum] = Object.assign(mother.genes[geneNum]);
      }
    }
  }
}

Paint.prototype.mutate = function() {
  for(var geneNum=0;geneNum < this.genes.length;geneNum++) {
    if(Math.random() < mutationRate) {
      ////console.log(geneNum+' mutation');
      this.genes[geneNum].x += round(random(-20,20));
      if(this.genes[geneNum].x < 0 )this.genes[geneNum].x = 0;
      if(this.genes[geneNum].x >= width )this.genes[geneNum].x = width-1;
      this.genes[geneNum].y += round(random(-20,20));
      if(this.genes[geneNum].y < 0 )this.genes[geneNum].y = 0;
      if(this.genes[geneNum].y >= height )this.genes[geneNum].y = height-1;
      this.mutated = true;
    }
  }
  if(Math.random() < newGeneRate && this.genes.length < maxPoints) {
    this.genes.push(new Poi());
    this.mutated = true;
  }
}


