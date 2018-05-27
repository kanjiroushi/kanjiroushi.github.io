let trackWidth = 70;

function Track() {
	this.vectors = [
		createVector(50, 50),
		createVector(50,200),
		createVector(150, 400),
		createVector(50, 600),
		createVector(130, 700),
		createVector(200, 700),
		createVector(400, 650),
		createVector(700, 700),
		createVector(650, 400),
		createVector(750, 50),
		createVector(150, 50),

	];
	//We store the track length that is max fitness
	var dist = 0;
	for(var i=0;i < this.vectors.length-1;i++) {
		dist += this.getSegmentSize(i);
	}
	this.trackSize = dist;
}

Track.prototype.draw = function() {
	noFill();
	stroke(30,30,200);
	strokeWeight(trackWidth);
	beginShape();
	for(var i=0;i < this.vectors.length;i++) {
		vertex(this.vectors[i].x,this.vectors[i].y);
	}
	endShape();

}

Track.prototype.isCrashed = function(car) {
	let color = pixels[(floor(car.pos.x)+floor(car.pos.y)*width)*4];
	//console.log(color);
	if(color == 255) {
		car.isCrashed = true;
		return true;
	}
	return false;
}

Track.prototype.getCurrentSegmentAndDistance = function(car) {
	let start,end,normalPoint,color;
	var selectedSegment;
	var distToBeg = 0;
	for(var i=0;i < this.vectors.length-1;i++) {
		start = this.vectors[i];
		end = this.vectors[i+1];
		normalPoint = this.getNormalPoint(car.pos.copy(), start.copy(), end.copy());
		color = pixels[(floor(normalPoint.x)+floor(normalPoint.y)*width)*4];

		if(color == 255) continue;

		
		//point(car.pos.x,car.pos.y);
		let distToCenter = normalPoint.dist(car.pos);

		if(distToCenter > trackWidth) continue;
		
		

		var v1 = p5.Vector.sub(normalPoint, start);
		var v2 = p5.Vector.sub(end,start);

		if(v1.dot(v2) < 0) continue;

		

		var v3 = p5.Vector.sub(normalPoint, end);
		var v4 = p5.Vector.sub(start,end);

		if(v3.dot(v4) < 0) continue;
		//We take the first one that match
		selectedSegment = i;
		distToBeg = normalPoint.dist(start);
	}

	let dist = 0;
	for(i=0;i<=selectedSegment;i++) {
		if(i == selectedSegment) dist += distToBeg;
		else dist += this.getSegmentSize(i);
	}
	let fitness = parseInt(dist*1000)/1000;
	return {'x':car.pos.x,'y':car.pos.y,'segment':selectedSegment,'fitness':fitness};
}


Track.prototype.getFitnessScore = function(car,frameNum) {

	let currentPos = this.getCurrentSegmentAndDistance(car);
	let fitness = currentPos.fitness - frameNum / 30;
	//We store the fitness in the car
	car.fitness = fitness;
	if(currentPos.fitness > this.trackSize - 50 ) {
		//We consider it finish line to advantage faster one
		//and not the one that luckly was just before the line at previous setp
		car.fitness = this.trackSize - 50 - frameNum / 30;
		car.isFinished = true;
	}
	return fitness;
}

Track.prototype.getSegmentSize = function(segmentNum) {
	return this.vectors[segmentNum].dist(this.vectors[segmentNum+1]);
}

Track.prototype.getNormalPoint = function(pos, start, end) {

//*    console.log('pos',pos);    
//*    console.log('start',start);
//*    console.log('end',end);


    // Vector from a to pos
    ap = pos.sub(start);
//*    console.log('ap',ap);
    // Vector from a to b
    ab = end.sub(start);
//*    console.log('ab',ab);
    ab.normalize(); // Normalize the line
    // Project vector "diff" onto line by using the dot product
    dotProduct = ap.dot(ab);
    ab.mult(dotProduct);
    normalPoint = start.add(ab);


    
    
//*    console.log('dot',dotProduct);
//*    console.log('normal',normalPoint);
//*    console.log('distance',normalPoint.dist(car.pos));
    
    return normalPoint;
  }