function NN(layers) {
	this.layers = layers;
	this.weights = [];

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

NN.prototype.pork = function (fatherNN,motherNN) {
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
	//We go through each layer and process the inputs
	for(var layerNum = 1;layerNum < this.layers.length;layerNum++) {

		let nbNeurons = this.layers[layerNum];
		let exitValues = new Array(this.layers[nbNeurons]);
		for(var neuronNum = 0;neuronNum < nbNeurons;neuronNum++) {
			exitValues[neuronNum] = this.processNeuron(inputs,this.weights[layerNum][neuronNum]);
		}
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