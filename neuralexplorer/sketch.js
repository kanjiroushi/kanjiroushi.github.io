let nn;
let lr_slider;
let resolution = 10;

let training_data = [{
    inputs: [0.1, 0.1],
    outputs: [0]
  },
  {
    inputs: [0.1, 0.9],
    outputs: [1]
  },
  {
    inputs: [0.9, 0.1],
    outputs: [1]
  },
  {
    inputs: [0.9, 0.9],
    outputs: [0]
  },
  {
    inputs: [0.5, 0.5],
    outputs: [1]
  },
  {
    inputs: [0.45, 0.45],
    outputs: [1]
  },
  {
    inputs: [0.55, 0.55],
    outputs: [1]
  },
  {
    inputs: [0.55, 0.45],
    outputs: [1]
  },
  {
    inputs: [0.45, 0.55],
    outputs: [1]
  },
  {
    inputs: [0.3, 0.3],
    outputs: [0]
  },
  {
    inputs: [0.5, 0.3],
    outputs: [0]
  },
  {
    inputs: [0.6, 0.3],
    outputs: [0]
  },
  {
    inputs: [0.7, 0.7],
    outputs: [0]
  },
  {
    inputs: [0.7, 0.4],
    outputs: [0]
  },
  {
    inputs: [0.5, 0.7],
    outputs: [0]
  },
  {
    inputs: [0.3, 0.7],
    outputs: [0]
  },
  {
    inputs: [0.3, 0.5],
    outputs: [0]
  },
  {
    inputs: [0.7, 0.3],
    outputs: [0]
  },
  {
    inputs: [0.7, 0.5],
    outputs: [0]
  },
];

function setup() {
  createCanvas(400, 400);
  nn = new NeuralNetwork(2, 7, 1);
  lr_slider = createSlider(0.01, 0.5, 0.1, 0.01);

}

function draw() {
  background(0);

  for (let i = 0; i < 20; i++) {
    let data = random(training_data);
    nn.train(data.inputs, data.outputs);
  }

  nn.setLearningRate(lr_slider.value());

  let cols = width / resolution;
  let rows = height / resolution;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      let inputs = [x1, x2];
      let y = nn.predict(inputs);
      noStroke();
      fill(y*255);
      rect(i * resolution, j * resolution, resolution, resolution);
    }
  }

  //We draw the points
  for (let i = 0; i < training_data.length; i++) {
    x = map(training_data[i].inputs[0],0,1,0,width);
    y = map(training_data[i].inputs[1],0,1,0,height);
    stroke(120);
    if(training_data[i].outputs[0] == 1 ) fill(255);
    else fill(0); 

    ellipse(x, y, 5);
  } 



}