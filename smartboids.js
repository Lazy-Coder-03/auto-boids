// Define a class called AutoBoid
class AutoBoid {
  // Define static constants for various parameters
  static MINSEEKG = -1;
  static MAXSEEKG = 1;
  static MINSEEKB = -1;
  static MAXSEEKB = 1;
  static MINSEEKP = -1;
  static MAXSEEKP = 1;
  static MINGOODR = 32;
  static MAXGOODR = 150;
  static MINBADR = 32;
  static MAXBADR = 120;
  static MINPARTNER = 32;
  static MAXPARTNER = 200;
  static MINSIZE = 4;
  static MAXSIZE = 8;
  static MINVEL = 4;
  static MAXVEL = 16;
  static MAXENERGY = 1200;
  static MAXAGE = 1800; // 30 seconds (60 frames per second)
  static REPROCOST = 0.25;

  // Constructor for the AutoBoid class
  constructor(x, y, gene, btype, parent1, parent2) {
    // Initialize position, velocity, acceleration, and other properties
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.alive = true;
    this.maxSteerForce = 0.3;

    // Set gene values based on input or random values
    if (Array.isArray(gene)) {
      this.gene = gene.slice(); // Copy the array
    } else if (gene == undefined) {
      this.gene = [];
      this.gene[0] = float(nf(random(AutoBoid.MINSEEKG, AutoBoid.MAXSEEKG), 0, 2)); // Seek good food
      this.gene[1] = float(nf(random(AutoBoid.MINSEEKB, AutoBoid.MAXSEEKB), 0, 2)); // Seek bad food
      this.gene[2] = float(nf(random(AutoBoid.MINSEEKP, AutoBoid.MAXSEEKP), 0, 2)); // Seek partner
      this.gene[3] = int(random(AutoBoid.MINGOODR, AutoBoid.MAXGOODR)); // Good food radius
      this.gene[4] = int(random(AutoBoid.MINBADR, AutoBoid.MAXBADR)); // Bad food radius
      this.gene[5] = int(random(AutoBoid.MINPARTNER, AutoBoid.MAXPARTNER)); // Procreate radius
      this.gene[6] = int(random(AutoBoid.MINSIZE, AutoBoid.MAXSIZE)); // Size
    } else {
      this.gene = gene;
    }

    // Set default values for btype if not provided
    if (btype == undefined) {
      this.btype = "random";
    } else {
      this.btype = btype;
    }

    // Set parent IDs for reproduction tracking
    this.parentIds = parent1 && parent2 ? [parent1.id, parent2.id] : ["None", "None"];
    this.id = this.generateId(); // Generate a unique ID
    this.pid = this.generatepid(); // Generate a unique parent ID

    // Extract values from the gene for easier access
    this.goodFactor = this.gene[0];
    this.badFactor = this.gene[1];
    this.partnerFactor = this.gene[2];
    this.goodRadius = this.gene[3];
    this.badRadius = this.gene[4];
    this.partnerRadius = this.gene[5];
    this.r = this.gene[6];
    this.age = 0;

    this.m = 2; // Mass (for now, making it 1)
    this.maxSpeed = map(this.r, AutoBoid.MINSIZE, AutoBoid.MAXSIZE, AutoBoid.MAXVEL, AutoBoid.MINVEL);

    this.avoidEdgeRadius = 64;
    this.maxEnergy = AutoBoid.MAXENERGY;
    this.energy = this.maxEnergy;
    this.mutationRate = 0.1;
  }

  // Apply a force to the boid, considering its mass
  applyForce(force) {
    let f = force.copy();
    if (this.m) {
      f.div(this.m);
    }
    this.acc.add(f);
  }

  // Check if the boid is alive
  isAlive() {
    return this.alive;
  }

  // Update velocity and position of the boid
  update() {
    // Handle energy and age
    if (this.energy > this.maxEnergy) {
      this.energy = this.maxEnergy;
    }
    if (this.energy < 0 || this.age > AutoBoid.MAXAGE) {
      this.alive = false;
    }

    // Apply random force to add some randomness to movement
    let rand = createVector(random(-1, 1), random(-1, 1));
    rand.normalize();
    rand.mult(0.3);
    this.applyForce(rand);

    // Update velocity, position, and other properties
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(this.maxSpeed);
    this.vel.mult(1 - FRICTION);
    this.acc.mult(0);

    // Decrease energy based on velocity
    if (this.vel.mag() < this.maxSpeed * 0.2) {
      this.energy -= 5;
    } else {
      this.energy -= 1;
    }
    this.age += 1;
  }

  // Draw the boid as a triangle
  show() {
    // Calculate the angle of rotation based on velocity
    let theta = this.vel.heading() + PI / 2;

    // Set fill and stroke colors based on boid type and energy
    if (this.btype == "random") {
      let col = lerpColor(color(255, 0, 0), color(0, 255, 0), this.energy / this.maxEnergy);
      fill(col);
      stroke(col);
    } else if (this.btype == "ideal") {
      let col = lerpColor(color(0), color(255), this.energy / this.maxEnergy);
      fill(col);
      stroke(col);
    }

    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);

    // Draw a concave kite shape
    let scalefact = 1;
    beginShape();
    vertex(0, -this.r * 1.5 * scalefact);
    vertex(-this.r * scalefact, this.r * scalefact);
    vertex(0, this.r * 0.8 * scalefact);
    vertex(this.r * scalefact, this.r * scalefact);
    endShape(CLOSE);

    pop();

    // Optionally, draw debug info
    if (debug) {
      this.drawDebugInfo();
    }
  }

  // Draw debug information for the boid
  drawDebugInfo() {
    // Calculate the angle of rotation based on velocity
    let theta = this.vel.heading() + PI / 2;

    // Draw circles representing various radii
    noFill();
    stroke(0, 255, 0, 100);
    ellipse(this.pos.x, this.pos.y, this.goodRadius * 2, this.goodRadius * 2);
    stroke(255, 0, 0, 100);
    ellipse(this.pos.x, this.pos.y, this.badRadius * 2, this.badRadius * 2);
    stroke(0, 0, 255, 100);
    ellipse(this.pos.x, this.pos.y, this.partnerRadius * 2, this.partnerRadius * 2);

    push();
    translate(this.pos.x, this.pos.y);

    // Draw health and age bars
    stroke(0);
    strokeWeight(1);
    fill(255, 0, 0);
    rect(-this.r, -20, 20, 3);
    fill(0, 255, 0);
    rect(-this.r, -20, map(this.energy, 0, this.maxEnergy, 0, 20), 3);
    fill(0, 0, 255);
    rect(-this.r, -15, 20, 3);
    fill(255, 255, 0);
    rect(-this.r, -15, map(this.age, 0, AutoBoid.MAXAGE, 0, 20), 3);

    // Draw lines representing various factors
    rotate(theta);
    stroke(0, 0, 255);
    strokeWeight(1);
    line(0, 0, 0, -this.partnerFactor * 25);
    stroke(0, 255, 0);
    strokeWeight(1);
    line(0, 0, 0, -this.goodFactor * 25);
    stroke(255, 0, 0);
    strokeWeight(2);
    line(0, 0, 0, -this.badFactor * 25);

    pop();
  }

  // Seek a partner boid
  seekPartner(partner) {
    let desired = p5.Vector.sub(partner.pos, this.pos);
    let d = desired.mag();

    if (d < this.partnerRadius && d < partner.partnerRadius && !(this.btype == "ideal" && partner.btype == "ideal")) {
      // Calculate a steering force based on distance
      let scaleFactor = map(d, 0, this.partnerRadius, 0.8, 0.08);
      scaleFactor *= this.partnerFactor;
      desired.mult(scaleFactor);
      desired.limit(this.maxSteerForce);
      if (debug) {
        stroke(0, 0, 255, 100);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, partner.pos.x, partner.pos.y);
      }
      this.applyForce(desired);
    }
  }

  // Wrap around the edges of the canvas
  loopAroundEdges() {
    if (this.pos.x < -this.avoidEdgeRadius) {
      this.pos.x = width + this.avoidEdgeRadius;
    } else if (this.pos.x > width + this.avoidEdgeRadius) {
      this.pos.x = -this.avoidEdgeRadius;
    }

    if (this.pos.y < -this.avoidEdgeRadius) {
      this.pos.y = height + this.avoidEdgeRadius;
    } else if (this.pos.y > height + this.avoidEdgeRadius) {
      this.pos.y = -this.avoidEdgeRadius;
    }
  }

  // Avoid edges of the canvas
  avoidEdges() {
    let desired = null;
    if (this.pos.x < this.avoidEdgeRadius) {
      desired = createVector(this.maxSpeed, this.vel.y);
    } else if (this.pos.x > width - this.avoidEdgeRadius) {
      desired = createVector(-this.maxSpeed, this.vel.y);
    }

    if (this.pos.y < this.avoidEdgeRadius) {
      desired = createVector(this.vel.x, this.maxSpeed);
    } else if (this.pos.y > height - this.avoidEdgeRadius) {
      desired = createVector(this.vel.x, -this.maxSpeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxSteerForce);
      this.applyForce(steer);
    }
  }

  // Seek good or bad food
  seekFood(food) {
    let desired = p5.Vector.sub(food.pos, this.pos);
    let d = desired.mag();

    if (food.type == "good" && d < this.goodRadius) {
      // Calculate a steering force based on distance for good food
      let scaleFactor = map(d, 0, this.goodRadius, 0.8, 0.08);
      scaleFactor *= this.goodFactor;
      desired.mult(scaleFactor);
      desired.limit(this.maxSteerForce);
      this.applyForce(desired);
    } else if (food.type == "bad" && d < this.badRadius) {
      // Calculate a steering force based on distance for bad food
      let scaleFactor = map(d, 0, this.badRadius, 0.8, 0.08);
      scaleFactor *= this.badFactor;
      desired.mult(scaleFactor);
      desired.limit(this.maxSteerForce);
      this.applyForce(desired);
    }
  }

  // Steer towards a desired vector with a given factor
  steerTowards(desired, factor) {
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxSteerForce);
    steer.mult(factor);
    this.applyForce(steer);
  }

  // Check if the boid is close enough to food to eat it
  eat(food) {
    return p5.Vector.dist(this.pos, food.pos) < food.r * 2 + 10;
  }

  // Clone the boid with the same gene
  clone() {
    let childGene = this.gene.slice(); // Copy the gene array
    return new AutoBoid(this.pos.x, this.pos.y, childGene, this.btype);
  }

  // Mutate the gene with a certain probability
  mutate() {
    let mutationRate = this.mutationRate;

    if (random(1) < mutationRate) {
      this.gene[0] = limitThis(this.gene[0] + float(nf(random(-1, 1), 0, 2)), AutoBoid.MINSEEKG, AutoBoid.MAXSEEKG);
      console.log("mutated good factor gene[0] : " + this.gene[0]);
    }
    if (random(1) < mutationRate) {
      this.gene[1] = limitThis(this.gene[1] + float(nf(random(-1, 1), 0, 2)), AutoBoid.MINSEEKB, AutoBoid.MAXSEEKB);
      console.log("mutated bad factor gene[1] : " + this.gene[1]);
    }
    if (random(1) < mutationRate) {
      this.gene[2] = limitThis(this.gene[2] + float(nf(random(-1, 1), 0, 2)), AutoBoid.MINSEEKP, AutoBoid.MAXSEEKP);
      console.log("mutated partner factor gene[2] : " + this.gene[2]);
    }
    if (random(1) < mutationRate) {
      this.gene[3] = limitThis(this.gene[3] + int(random(-100, 100)), AutoBoid.MINGOODR, AutoBoid.MAXGOODR);
      console.log("mutated good radius gene[3] : " + this.gene[3]);
    }

    if (random(1) < mutationRate) {
      this.gene[4] = limitThis(this.gene[4] + int(random(-100, 100)), AutoBoid.MINBADR, AutoBoid.MAXBADR);
      console.log("mutated bad radius gene[4] : " + this.gene[4]);
    }
    if (random(1) < mutationRate) {
      this.gene[5] = limitThis(this.gene[5] + int(random(-100, 100)), AutoBoid.MINPARTNER, AutoBoid.MAXPARTNER);
      console.log("mutated partner radius gene[5] : " + this.gene[5]);
    }
    if (random(1) < mutationRate) {
      const mins = AutoBoid.MINSIZE;
      const maxs = AutoBoid.MAXSIZE;
      const avg = int((mins + maxs) / 2);
      this.gene[6] = limitThis(this.gene[6] + int(random(-avg, avg)), mins, maxs);
      console.log("mutated size gene[6] : " + this.gene[6]);
    }
  }

  // Perform crossover with another boid to create a child
  crossover(partner) {
    let childGene = [];
    let mid = int(random(this.gene.length));
    let childbtype = this.btype;

    for (let i = 0; i < this.gene.length; i++) {
      if (i > mid) {
        childGene[i] = this.gene[i];
      } else {
        childGene[i] = partner.gene[i];
      }
    }

    let child = new AutoBoid(this.pos.x, this.pos.y, childGene, childbtype, this, partner);
    child.id = child.generateId();
    return child;
  }

  // Reproduce with another boid
  procreate(partner) {
    let d = p5.Vector.dist(this.pos, partner.pos);
    if (d < this.partnerRadius && !(this.btype == "ideal" && partner.btype == "ideal")) {
      // Energy cost of reproduction
      this.energy -= this.maxEnergy * AutoBoid.REPROCOST;
      partner.energy -= this.maxEnergy * AutoBoid.REPROCOST;

      let child = this.crossover(partner);
      child.mutate();
      return child;
    } else {
      return null;
    }
  }

  // Generate a hex id based on gene and btype
  generateHexId() {
    let gene = this.gene;
    let btype = this.btype;
    let id = "";
    for (let i = 0; i < gene.length; i++) {
      if (Number.isInteger(gene[i])) {
        id += gene[i].toString(16).toUpperCase();
      } else {
        id += int(gene[i] * 255).toString(16).toUpperCase();
      }
      if (i < gene.length - 1) {
        id += ":";
      }
    }
    id += ":" + btype;
    return id;
  }

  // Generate a pid based on parent ids
  generatepid() {
    const p1id = this.parentIds[0];
    const p2id = this.parentIds[1];
    let pid = "";
    pid += p1id + " :: " + p2id;
    return pid;
  }

  // Generate a normal id not hex, using floats and ints in gene
  generateId() {
    let gene = this.gene;
    let btype = this.btype;
    let id = "";
    for (let i = 0; i < gene.length; i++) {
      id += nf(gene[i], 0, 2);
      if (i < gene.length - 1) {
        id += ":";
      }
    }
    id += ":" + btype;
    return id;
  }
}
