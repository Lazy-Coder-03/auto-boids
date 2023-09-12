
# AutoBoids Simulation

AutoBoids is a simulation project that allows you to create and observe autonomous agents known as "boids" as they exhibit various behaviors, such as seeking food, avoiding edges, and reproducing based on their genetic attributes.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Simulation](#running-the-simulation)
- [The AutoBoid Class](#the-autoboid-class)
  - [Class Overview](#class-overview)
  - [Usage Examples](#usage-examples)
- [The Food Class](#the-food-class)
  - [Class Overview](#class-overview)
  - [Usage Examples](#usage-examples)
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

...

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

...

## Contributing

Contributions to the AutoBoids project are welcome! If you have ideas for improvements or new features, please open an issue or create a pull request. For major changes, please discuss them first by opening an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

This README update includes information about the `Food` class, its attributes, and how to use it. It's now part of the project's documentation.
