let flock = [];
let debug = true;
let foods = {
  good: [],
  bad: [],
};
let buffer = 0;
const POPULATION = 200;
const reproductionChance = 0.008;
const FOODBUFF = 200;
const POISONNERF = -400;
const FRICTION = 0.0;
let r;

//remember to add if procreation happened it cost energy

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  frameRate(60);
  //let idealGene = [0.5, 150, -1, 20, 150, 4];
  flock.push(
    new AutoBoid(width / 2, height / 2, [1, -0.5, 1, 128, 32, 256, 8], "ideal")
  );
  for (let i = 0; i < POPULATION; i++) {
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
}

function draw() {
  background(0);

  for (let boid of flock) {
    if (!boid.isAlive()) {
      addFood(boid.pos.x, boid.pos.y);
      let index = flock.indexOf(boid);
      flock.splice(index, 1);
    } else {
      r = random(1);
      boid.avoidEdges();
      //boid.loopAroundEdges()
      boid.update();
      boid.show();

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
      //if(flock.length<POPULATION/2&&boid != flock[j] && r<reproductionChance && boid.energy>AutoBoid.MAXENERGY/2 && flock[j].energy>flock[j].lifeSpan/2){
      if (
        boid != flock[j] &&
        boid.energy > AutoBoid.MAXENERGY * 0.9 &&
        flock[j].energy > flock[j].lifeSpan * 0.9   &&     boid.age > 0.08 * AutoBoid.MAXAGE &&
        flock[j].age > 0.08 * AutoBoid.MAXAGE
      ) {
        boid.seekPartner(flock[j]);
      }
      if (
        flock.length < POPULATION &&
        boid != flock[j] &&
        r < reproductionChance &&
        boid.energy > AutoBoid.MAXENERGY * 0.8 &&
        flock[j].energy > flock[j].lifeSpan * 0.8 &&
        boid.age > 0.25 * AutoBoid.MAXAGE &&
        flock[j].age > 0.25 * AutoBoid.MAXAGE
      ) {
        boid.seekPartner(flock[j]);
        //if (r < reproductionChance) {
          let child = boid.procreate(flock[j]);
          if (child) {
            //console.log("boid born with gene : " + child.gene);
            flock.push(child);
            break;//very important to break out of the loop, otherwise the child will be added to the flock multiple times
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

  for (let type in foods) {
    for (let food of foods[type]) {
      food.show();
    }
  }
  // if (flock.length <= 1) {
  //   flock.push(new AutoBoid(width / 2, height / 2));
  //   let clone = flock[1].clone();
  //   clone.mutate();
  //   flock.push(clone);
  // }
}

function addFood(x, y) {
  if (random(1) < 1) {
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
