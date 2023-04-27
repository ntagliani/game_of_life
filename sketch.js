
let cell_x = 100;
let cell_y = 50;
let cell_size = 15;
let gBuffers = []
gBuffers.push(new Grid(cell_x, cell_y));
gBuffers.push(new Grid(cell_x, cell_y));

//let buffers = new Array(2);
//buffers[0] = new Array(cell_x * cell_y);
//buffers[1] = new Array(cell_x * cell_y);

let data_buffer = 0;
let play = false;
let time = 0;
let simulationDuration = 200;
let lastPositionX = -1;
let lastPositionY = -1;

function setup() {
  createCanvas(cell_x * cell_size, cell_y * cell_size);
  
  let buttonPlay = createButton('Play/Pause');
  buttonPlay.position(10, cell_y * cell_size + 10);
  buttonPlay.mousePressed(playPause);
  
  let buttonClear = createButton('Clear');
  buttonClear.position(buttonPlay.position().x + 100 , cell_y * cell_size + 10);
  buttonClear.mousePressed(clearGrid);
  
 

  background(220);
  frameRate(30);


  for (y = 0; y < cell_y; y++) {
    for (x = 0; x < cell_x; x++) {
      rect(cell_size * x, cell_size * y, cell_size, cell_size);
    }
  }
 // buffers[data_buffer] = buffers[data_buffer].fill(false);
 // buffers[data_buffer + 1] = buffers[data_buffer + 1].fill(false);
}

function mousePressed() {
  if (
    play === false &&
    mouseX < cell_x * cell_size &&
    mouseY < cell_y * cell_size
  ) {
    //  console.log("[" + mouseX + ", " + mouseY + "]")
    let x = int(mouseX / cell_size);
    let y = int(mouseY / cell_size);
    if (x == lastPositionX && y == lastPositionY){
      return;
    }
    // console.log("[" + x + ", " + y + "]")
  
    //  index = int(cell_x * y + x);
  //  buffers[data_buffer][index] = !buffers[data_buffer][index];

    gBuffers[data_buffer].flip(x, y);

    lastPositionX = x;
    lastPositionY = y;
  }
}

function mouseReleased(){
  lastPositionX = -1;
  lastPositionY = -1;
}

function mouseDragged() {
  if (
    play === false &&
    mouseX < cell_x * cell_size &&
    mouseY < cell_y * cell_size &&
    mousePressed
  ) {
    
    //  console.log("[" + mouseX + ", " + mouseY + "]")
    let x = int(mouseX / cell_size);
    let y = int(mouseY / cell_size);
    if (x == lastPositionX && y == lastPositionY){
      return;
    }
    // console.log("[" + x + ", " + y + "]")
 //   index = int(cell_x * y + x);
 //   buffers[data_buffer][index] = !buffers[data_buffer][index];

    gBuffers[data_buffer].flip(x, y);


    lastPositionX = x;
    lastPositionY = y;
  }
}

function keyReleased() {
  if (key === "s") {
    playPause();
  }
  if (key === "p") {
    playPause();
  }
  return false; // prevent any default behavior
}

function start() {
  play = true;
  time = 0;
}

function stop() {
  play = false;
}

function playPause() {
  if (play === false){
    play = true;
    time = 0;
  } else {
    play = false;
  }
}

function clearGrid() {
  gBuffers.forEach((item) => item.clear());
}

function pos(x, y) {
  return "[" + (x +1) + "," + (y + 1) + "]";
}

function liveNeighbors(x, y) {
  // const current_cell = int(cell_x * y + x);
  // const alive = buffers[data_buffer][current_cell] === true;
  const alive = gBuffers[data_buffer].get(x, y) === true;
  if (alive) {
    console.log("Testing neighbours of live cell: " + pos(x, y));
  }
  let count = 0;
  for (let nx = x - 1; nx < x + 2; nx++) {
    for (let ny = y - 1; ny < y + 2; ny++) {
      if (
        nx < 0 ||
        ny < 0 ||
        nx >= cell_x ||
        ny >= cell_y ||
        (nx == x && ny == y)
      ) {
        continue;
      }
      // console.log("checking [" + nx + ", " + ny + "]")
      //if (nx >= 0 && ny >= 0 && nx < cell_x && ny < cell_y && nx != x && ny != y) {
      //let index = int(cell_x * ny + nx);

      //if (buffers[data_buffer][index] === true) {
      if (gBuffers[data_buffer].get(nx, ny) === true) {
        // console.log("[" + x + ", " + y + "] ->  neighbours : [" + nx + ", " + ny + "]")
        count++;
      }
      //}
    }
  }
  if (alive) {
    console.log("count=" + count);
  }
  return count;
}

function runSimulation() {
  console.log("Running");
//  buffers[data_buffer + 1] = [...buffers[data_buffer]];
  //gBuffers[data_buffer + 1] =  Object.assign(Object.create(Object.getPrototypeOf(gBuffers[data_buffer])), gBuffers[data_buffer]);
  gBuffers[data_buffer + 1] = gBuffers[data_buffer].clone();


  for (let y = 0; y < cell_y; y++) {
    for (let x = 0; x < cell_x; x++) {
      //const index = int(cell_x * y + x);
      const count = liveNeighbors(x, y);
      //if (buffers[data_buffer][index] === true) {
      if (gBuffers[data_buffer].get(x, y) === true) {
        console.log(pos(x, y) + " -> " + count + " neighbours");
        if (count < 2 || count > 3) {
          console.log(
            "cell at " + pos(x, y) + " has " + count + " neighbors and will die"
          );
          //buffers[data_buffer + 1][index] = false;
          gBuffers[data_buffer + 1].unset(x, y);
        }
      } else {
        if (count == 3) {
          console.log(
            "cell at " + pos(x, y) + " has 3 neighbors and will come to alive"
          );
          //buffers[data_buffer + 1][index] = true;
          gBuffers[data_buffer + 1].set(x, y);
        }
      }
    }
  }
  //buffers[data_buffer] = [...buffers[data_buffer + 1]];
  // gBuffers[data_buffer] =  Object.assign(Object.create(Object.getPrototypeOf(gBuffers[data_buffer + 1])), gBuffers[data_buffer + 1]);
  gBuffers[data_buffer] = gBuffers[data_buffer + 1].clone();

}

function draw() {
//  buffers[data_buffer + 1] = [...buffers[data_buffer]];
  // gBuffers[data_buffer + 1] =  Object.assign(Object.create(Object.getPrototypeOf(gBuffers[data_buffer])), gBuffers[data_buffer]);
  gBuffers[data_buffer + 1] = gBuffers[data_buffer].clone();

  if (play === true) {
    time += deltaTime;
    if (time / simulationDuration > 1) {
      runSimulation();
      time = time % simulationDuration;
    }
  }
  //console.log("Begin draw")
  for (y = 0; y < cell_y; y++) {
    for (x = 0; x < cell_x; x++) {
  //    const index = int(cell_x * y + x);
      //    console.log(index)
    //  if (buffers[data_buffer + 1][index] === true) {
     
      if((gBuffers[data_buffer + 1].get(x, y)) === true) {
        //        console.log("[" + x + ", " + y + "] -> grey")

        fill(128);
      } else {
        //      console.log("[" + x + ", " + y + "] -> white")

        fill(255);
      }
      rect(cell_size * x, cell_size * y, cell_size, cell_size);
    }
  }
}
