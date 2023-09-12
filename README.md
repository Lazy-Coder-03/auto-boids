# AutoBoids Simulation

AutoBoids is a fascinating simulation project that allows you to create and observe autonomous agents known as "boids" as they exhibit various behaviors, such as seeking food, avoiding edges, and reproducing based on their genetic attributes.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Simulation](#running-the-simulation)
- [The AutoBoid Class](#the-autoboid-class)
  - [Class Overview](#class-overview)
  - [Usage Examples](#usage-examples)
- [The Food Class](#the-food-class)
  - [Class Overview](#class-overview-1)
  - [Usage Examples](#usage-examples-1)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Follow these steps to set up and run the AutoBoids simulation on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Git](https://git-scm.com/)

### Installation

1. Clone the AutoBoids repository from GitHub:

   ```bash
   git clone https://github.com/Lazy-Coder-03/auto-boids.git
   ```

2. Change your current directory to the project folder:

   ```bash
   cd auto-boids
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

### Running the Simulation

Once you have the project set up, you can run the AutoBoids simulation:

```bash
npm start
```

This command will start the simulation, and you can access it in your web browser at `http://localhost:3000`.

## The AutoBoid Class

The `AutoBoid` class is the core component of the simulation. It represents autonomous agents with various attributes and behaviors. Below is an overview of this class and how to use it:

### Class Overview

The `AutoBoid` class has the following attributes:

- `pos`: Current position as a vector.
- `vel`: Velocity as a vector.
- `acc`: Acceleration as a vector.
- `alive`: A boolean indicating whether the boid is alive.
- `maxSteerForce`: Maximum steering force allowed for the boid.
- `gene`: An array representing the genetic attributes of the boid.
- `btype`: Type of boid, either "random" or "ideal."
- `parentIds`: An array containing the IDs of the parent boids.
- `id`: The unique ID of the boid.
- Other attributes representing genetic factors, radii, size, energy, age, and more.

### Usage Examples

You can create and manage `AutoBoid` instances as follows:

```javascript
// Import the AutoBoid class
const AutoBoid = require('./AutoBoid'); // Modify the path as needed

// Create a new AutoBoid instance
const boid = new AutoBoid(x, y, gene, btype, parent1, parent2);

// Example: Update and render the boid
function draw() {
  background(255); // Assuming you're using p5.js
  boid.update();
  boid.show();
}
```

For detailed information on the `AutoBoid` class and its methods, refer to the source code in `AutoBoid.js`.

## The Food Class

The `Food` class represents food items in the simulation. Below is an overview of this class and how to use it:

### Class Overview

The `Food` class has the following attributes:

- `pos`: Position vector.
- `r`: Radius of the food item.
- `type`: Type of food, either "good" or "bad."

### Usage Examples

You can create and render `Food` instances as follows:

```javascript
// Import the Food class
const Food = require('./Food'); // Modify the path as needed

// Create a new Food instance
const goodFood = new Food(x, y, 'good');
const badFood = new Food(x, y, 'bad');

// Example: Render the food items
goodFood.show();
badFood.show();
```

For more examples and integration into the AutoBoids simulation, refer to the source code in `Food.js`.

## Contributing

Contributions to the AutoBoids project are welcome! If you have ideas for improvements or new features, please open an issue or create a pull request. For major changes, please discuss them first by opening an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

This README.md file provides a comprehensive overview of your AutoBoids project, including installation instructions, information about the `AutoBoid` and `Food` classes, and guidance on contributing to the project. You can use this as a starting point and customize it further to suit your project's needs.
