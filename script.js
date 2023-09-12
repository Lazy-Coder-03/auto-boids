let flock = [];
let debug = false;
let start = false;
let foods = {
  good: [],
  bad: [],
};
const buffer = 0;
let POPULATION = 200;
const reproductionChance = 0.05;
const FOODBUFF = 200;
const POISONNERF = -400;
const FRICTION = 0.0;
let r;
const MIN_AGE_SEEKING = 0.1; //in percent of max age
const MIN_ENERGY_SEEKING = 0.8; //in percent of max energy
const MIN_AGE_REPRO = 0.25; //in percent of max age
const MIN_ENERGY_REPRO = 0.9; //in percent of max energy
const canvasAspectRatio = 2/1;
let simulationSpeed = 1;

//get HTML elements
const popslider = document.getElementById("populationslider");
const debugbtn = document.getElementById("debug");
const startbtn = document.getElementById("start");
const resetbtn = document.getElementById("reset"); // Add the reset button
const maxpopspan = document.getElementById("maxpopulationspan");
const popspan = document.getElementById("populationspan");
const foodspan = document.getElementById("foodspan");
const poisonspan = document.getElementById("poisonspan");
const popsliderspan = document.getElementById("population-slider-value");
const speedslider = document.getElementById("speedslider");
const speedsliderspan = document.getElementById("speed-slider-value");

function resetSimulation() {
  if (start) {
    start = false;
    startbtn.innerHTML = "Start";
    noLoop();
    popslider.disabled = false;
  }

  const newPopulation = int(popslider.value);
  if (newPopulation !== POPULATION) {
    // Population has changed; update and reset simulation
    POPULATION = newPopulation;
    maxpopspan.innerHTML = POPULATION;
    popspan.innerHTML = POPULATION;
    popsliderspan.innerHTML = POPULATION;
    flock = [];
    foods = { good: [], bad: [] };
    setup();
  } else {
    // Population has not changed; reset the simulation without reinitializing
    flock = [];
    foods = { good: [], bad: [] };
    setup();
  }
}

resetbtn.addEventListener("click", () => {
  if (!start) {
    resetSimulation(); // Call the reset function when the reset button is clicked
    updateMaxPopulationSpan();
    setSliderState();
  }
});

speedslider.addEventListener("input", () => {
  if (!start) {
    simulationSpeed = speedslider.value;
  }
  speedsliderspan.innerHTML = "Speed : "+simulationSpeed;
}
);


popslider.addEventListener("input", () => {
  if (!start) {
    POPULATION = int(popslider.value);
    maxpopspan.innerHTML = POPULATION;
    popsliderspan.innerHTML = "Population : "+POPULATION;
  }
});

// Function to update the max population span
function updateMaxPopulationSpan() {
  maxpopspan.innerHTML = POPULATION;
  popsliderspan.innerHTML = "Population : "+POPULATION;
}

// Function to set the slider's disabled attribute based on the "start" variable
function setSliderState() {
  popslider.disabled = start;
  resetbtn.disabled = start; // Disable the reset button when the simulation is running
}

startbtn.addEventListener("click", () => {
  start = !start;
  if (start) {
      startbtn.innerHTML = "Pause"; // Change the text when starting
      startbtn.classList.add("active"); // Add "active" class for start
      loop();
      popslider.disabled = true; // Disable the slider when starting
      speedslider.disabled = true;
  } else {
      startbtn.innerHTML = "Start"; // Change the text when stopping
      startbtn.classList.remove("active"); // Remove "active" class for stop
      noLoop();
      popslider.disabled = false; // Enable the slider when stopping
      speedslider.disabled = false;
  }

  // Update the button styles
  setSliderState();
});

debugbtn.addEventListener("click", () => {
  debug = !debug;
  if(debug){
    debugbtn.classList.add("active"); // Toggle "active" class based on debug state
  }else{
    debugbtn.classList.remove("active"); // Toggle "active" class based on debug state
  }
});



function setup() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let canvasWidth, canvasHeight;

  if (windowWidth / windowHeight > canvasAspectRatio) {
    // Window is wider than canvas aspect ratio
    canvasWidth = windowHeight * canvasAspectRatio;
    canvasHeight = windowHeight;
  } else {
    // Window is narrower than canvas aspect ratio
    canvasWidth = windowWidth;
    canvasHeight = windowWidth / canvasAspectRatio;
  }

  const canvas = createCanvas(800, 600);
  canvas.parent("canvas-container");
  background(0);
  background(0);
  frameRate(60);
  start = false;
  POPULATION = int(popslider.value);


  maxpopspan.innerHTML = POPULATION;
  popspan.innerHTML = POPULATION;

  //let idealGene = [0.5, 150, -1, 20, 150, 4];
  flock.push(
    new AutoBoid(width / 2, height / 2, [1, -0.5, 1, 120, 32, 150, 8], "ideal")
  );
  for (let i = 1; i < POPULATION; i++) {
    flock.push(
      new AutoBoid(
        random(buffer, width - buffer),
        random(buffer, height - buffer)
      )
    );
  }
  for (let j = 0; j < 2 * POPULATION; j++) {
    foods.good.push(
      new Food(
        random(buffer, width - buffer),
        random(buffer, height - buffer),
        "good"
      )
    );
  }

  for (let j = 0; j < POPULATION; j++) {
    foods.bad.push(
      new Food(
        random(buffer, width - buffer),
        random(buffer, height - buffer),
        "bad"
      )
    );
  }
  window.addEventListener("resize", () => {
    // Recalculate canvas size on window resize
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let canvasWidth, canvasHeight;

    if (windowWidth / windowHeight > canvasAspectRatio) {
      // Window is wider than canvas aspect ratio
      canvasWidth = windowHeight * canvasAspectRatio;
      canvasHeight = windowHeight;
    } else {
      // Window is narrower than canvas aspect ratio
      canvasWidth = windowWidth;
      canvasHeight = windowWidth / canvasAspectRatio;
    }

    resizeCanvas(800, 600);
    //resetSimulation()
    redraw(); // Redraw the canvas when the window is resized
  });
}

function draw() {
  background(0);
  //CHANGE THE SPAN WITH ID POPULATION
  popspan.innerHTML = flock.length;
  foodspan.innerHTML = foods.good.length;
  poisonspan.innerHTML = foods.bad.length;
  if (start) {
    for(let i=0;i<simulationSpeed;i++){
    //noLoop()
    for (let boid of flock) {
      if (!boid.isAlive()) {
        addFood(boid.pos.x, boid.pos.y,"good");
        let index = flock.indexOf(boid);
        flock.splice(index, 1);
      } else {
        r = random(1);
        boid.avoidEdges();
        //boid.loopAroundEdges()
        boid.update();
       //boid.show();

        // Find the closest food
        let closestFood = null;
        let closestFoodDistance = Infinity;

        for (let type in foods) {
          for (let food of foods[type]) {
            let d = p5.Vector.dist(boid.pos, food.pos);

            if (d < closestFoodDistance) {
              closestFoodDistance = d;
              closestFood = food;
            }
          }
        }

        if (closestFood !== null) {
          boid.seekFood(closestFood);
          if (boid.eat(closestFood)) {
            boid.energy += closestFood.type === "good" ? FOODBUFF : POISONNERF;
            let index = foods[closestFood.type].indexOf(closestFood);
            foods[closestFood.type].splice(index, 1);
          }
        }
      }
      //reproduction loop
      for (let j = 0; j < flock.length; j++) {
        //if(flock.length<POPULATION/2&&boid != flock[j] && r<reproductionChance && boid.energy>AutoBoid.MAXENERGY/2 && flock[j].energy>flock[j].energy/2){
        if (
          boid != flock[j] &&
          boid.energy > boid.maxEnergy * MIN_ENERGY_SEEKING &&
          flock[j].energy > flock[j].maxEnergy * MIN_ENERGY_SEEKING &&
          boid.age > MIN_AGE_SEEKING * AutoBoid.MAXAGE &&
          flock[j].age > MIN_AGE_SEEKING * AutoBoid.MAXAGE
        ) {
          boid.seekPartner(flock[j]);
        }
        if (
          flock.length < POPULATION &&
          boid != flock[j] &&
          r < reproductionChance &&
          boid.energy > boid.maxEnergy * MIN_ENERGY_REPRO &&
          flock[j].energy > flock[j].maxEnergy * MIN_ENERGY_REPRO &&
          boid.age > MIN_AGE_REPRO * AutoBoid.MAXAGE &&
          flock[j].age > MIN_AGE_REPRO * AutoBoid.MAXAGE
        ) {
          boid.seekPartner(flock[j]);
          //if (r < reproductionChance) {
          let child = boid.procreate(flock[j]);
          if (child) {
            //console.log("boid born with gene : " + child.gene);
            flock.push(child);
            break; //very important to break out of the loop, otherwise the child will be added to the flock multiple times
            //  }
          }
        }
      }
    }

    if (foods.good.length < POPULATION) {
      foods.good.push(
        new Food(
          random(buffer, width - buffer),
          random(buffer, height - buffer),
          "good"
        )
      );
    }
    if (foods.bad.length < POPULATION / 5) {
      foods.bad.push(
        new Food(
          random(buffer, width - buffer),
          random(buffer, height - buffer),
          "bad"
        )
      );
    }
  }
  for(let boid of flock){
    boid.show();
  }

    for (let type in foods) {
      for (let food of foods[type]) {
        food.show();
      }
    }
    
  } else {
    for (let boid of flock) {
      boid.show();
    }
    for (let type in foods) {
      for (let food of foods[type]) {
        food.show();
      }
    }
  }
}

function addFood(x, y,type) {
  if (type == "good") {
    foods.good.push(new Food(x, y, "good"));
  } else {
    foods.bad.push(new Food(x, y, "bad"));
  }
}

function limitThis(x, min, max) {
  if (x <= min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
}
