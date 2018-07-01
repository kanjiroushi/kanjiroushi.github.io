let nnStartX = 820;
let nnStartY = 0;
let nnHeight = 400;
let nnWidth = 380;


function NN(layers) {
	

	this.layers = layers;
	this.weights = [];
	this.storeOutputs = [];
	this.neuronesPos = [];
	let previousNbNeurons = this.layers[0];
	for(var layerNum = 1;layerNum < this.layers.length;layerNum++) {
		//We instantiate the layer
		this.weights[layerNum] = [];
		let nbNeurons = this.layers[layerNum];
		for(var neuronNum = 0;neuronNum < nbNeurons;neuronNum++) {
			//We create the weights (the +1 is for the bias)
			this.weights[layerNum][neuronNum] = new Array(previousNbNeurons + 1);
			//We fill with random values
			for(var weightNum=0;weightNum <previousNbNeurons+1;weightNum++) {
				this.weights[layerNum][neuronNum][weightNum] = this.randomWeight();
			}
		}
		previousNbNeurons = nbNeurons;
	}
}

NN.prototype.crossFit = function (fatherNN,motherNN) {
	let previousNbNeurons = this.layers[0];
	for(var layerNum = 1;layerNum < this.layers.length;layerNum++) {
		//We instantiate the layer
		let nbNeurons = this.layers[layerNum];
		for(var neuronNum = 0;neuronNum < nbNeurons;neuronNum++) {
			for(var weightNum=0;weightNum <previousNbNeurons+1;weightNum++) {
				let weight = (Math.random() > 0.3)? fatherNN.weights[layerNum][neuronNum][weightNum]:motherNN.weights[layerNum][neuronNum][weightNum];
				this.weights[layerNum][neuronNum][weightNum] = weight;
			}
		}
		previousNbNeurons = nbNeurons;
	}
}

NN.prototype.mutate = function () {
	let previousNbNeurons = this.layers[0];
	for(var layerNum = 1;layerNum < this.layers.length;layerNum++) {
		//We instantiate the layer
		let nbNeurons = this.layers[layerNum];
		for(var neuronNum = 0;neuronNum < nbNeurons;neuronNum++) {
			for(var weightNum=0;weightNum <previousNbNeurons+1;weightNum++) {
				if(Math.random() < mutationRate) {
					//We change a little bit the value
					this.weights[layerNum][neuronNum][weightNum] = this.randomWeight();
				}
			}
		}
		previousNbNeurons = nbNeurons;
	}
}

//it should return the output for the exit neurons
NN.prototype.processInput = function(inputs) {
	this.storeOutputs = [];
	this.storeOutputs[0] = Object.assign(inputs);
	//We go through each layer and process the inputs
	for(var layerNum = 1;layerNum < this.layers.length;layerNum++) {

		let nbNeurons = this.layers[layerNum];
		let exitValues = new Array(this.layers[nbNeurons]);
		for(var neuronNum = 0;neuronNum < nbNeurons;neuronNum++) {
			exitValues[neuronNum] = this.processNeuron(inputs,this.weights[layerNum][neuronNum]);
		}
		this.storeOutputs[layerNum] = exitValues;
		inputs = exitValues;
	}
	return inputs;
}

NN.prototype.processNeuron = function(inputs,weights) {
	let total = 0;
	for(var inputNum = 0;inputNum < inputs.length;inputNum++) {
		total += inputs[inputNum] * weights[inputNum];
	}
	//We add the bias
	total += weights[weights.length-1];

	return this.sigmoid(total);
}
NN.prototype.show = function() {

	textSize(20);
	fill(0);
	text('Best car network',nnStartX+10,nnStartY+20);
	let x = nnStartX + 50;
	let y = nnStartY + 50;

	let stepX = (nnWidth - 2 * 50) / this.layers.length;
	let StepY = 0;
	fill(150);
	noStroke();
	for(var layerNum = 0; layerNum < this.layers.length;layerNum++) {
		nbNeurons = this.layers[layerNum];
		this.neuronesPos[layerNum] = [];
		StepY = (nnHeight - 2 * 50) / nbNeurons;
		y = nnStartY + 50;
		for(var neuronNum = 0;neuronNum < nbNeurons;neuronNum++) {
			
			this.neuronesPos[layerNum][neuronNum] = createVector(x-10,y);

			stroke(120,120,120,100);
			if(layerNum > 0) {
				for(var prevNeuroneNum=0;prevNeuroneNum < this.layers[layerNum-1];prevNeuroneNum++) {
					let w = this.weights[layerNum][neuronNum][prevNeuroneNum];
					if(w >= 0) stroke(30,150,30,100);
					else stroke(150,30,30,100);
					strokeWeight(map(Math.abs(w),0,1,0,8));
					line(
						this.neuronesPos[layerNum-1][prevNeuroneNum].x+10,
						this.neuronesPos[layerNum-1][prevNeuroneNum].y,
						x,
						y);
				}
				//bias
				let w = this.weights[layerNum][neuronNum][prevNeuroneNum];
				if(w >= 0) stroke(30,150,30,100);
				else stroke(150,30,30,100);
				strokeWeight(map(Math.abs(w),0,1,1,5));
				line(
				x,
				y-20,
				x,
				y);
				
			}

			if(this.storeOutputs[layerNum][neuronNum] > 0) fill(30,150,30,255);
			else fill(150,30,30,255);
			noStroke();
			ellipse(x,y,20);
			textSize(12);
			text(parseInt(this.storeOutputs[layerNum][neuronNum]*1000)/1000, x-20,y+20);

			y += StepY;
		}
		x += stepX;
	}
	//We name some neurons
	noStroke();
	fill(0,0,0,255);
	text('ACC', this.neuronesPos[layerNum-1][0].x+22,this.neuronesPos[layerNum-1][0].y+5);
	text('steering', this.neuronesPos[layerNum-1][1].x+22,this.neuronesPos[layerNum-1][1].y+3);

	text('dist left', this.neuronesPos[0][0].x-40,this.neuronesPos[0][0].y+5);
	text('dist front', this.neuronesPos[0][1].x-50,this.neuronesPos[0][Math.floor(this.neuronesPos[0].length/2)].y+5);
	text('dist right', this.neuronesPos[0][2].x-50,this.neuronesPos[0][this.neuronesPos[0].length-1].y+5);
	stroke(80);
}
//////////////
//// utilities
//////////////

NN.prototype.randomWeight = function() {
	return Math.random()*2-1;
}

//We return a number between -1 and 1
NN.prototype.sigmoid = function(t) {
    return (1/(1+Math.pow(Math.E, -t)))*2-1;
}