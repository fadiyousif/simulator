const x = 0;
const y = 0;
const vehiclePosition = [x, y];
const vehiclePositionCopy = [...vehiclePosition];

const grid = [10, 10];
const directions = ["N", "E", "S", "W"];
const validCommands = ["F", "B", "R", "L"];

let currentDirection = "E";
let simulationCount = 0;
let previousVehiclePosition = null;
let previousDirection = null;

const incrementX = () => {
   vehiclePosition[0] += 1;
};
const decrementX = () => {
   vehiclePosition[0] -= 1;
};

const incrementY = () => {
   vehiclePosition[1] += 1;
};
const decrementY = () => {
   vehiclePosition[1] -= 1;
};

const cmdDirectionMapping = {
   F: {
      E: incrementY,
      W: decrementY,
      N: decrementX,
      S: incrementX,
   },
   B: {
      E: decrementY,
      W: incrementY,
      N: incrementX,
      S: decrementX,
   },
};

const isValidNewPosition = (...args) =>
   args.every((value) => value >= 0 && value <= grid[1]);

const isValidInput = (input) =>
   [...input].every((command) => validCommands.includes(command));

const handleInput = (commands) => {
   if (!isValidInput(commands)) {
      const invalidCommands = [...commands].filter(
         (command) => !validCommands.includes(command)
      );

      try {
         throw new Error(
            `Invalid input: ${invalidCommands}. Acceptable commands are ${validCommands}`
         );
      } catch (err) {
         console.error(err, "\n");
         return;
      }
   }

   runSimulation(commands);
};

// reset vehicle position and direction after a failed simulation
const reset = () => {
   vehiclePosition.splice(0);
   vehiclePosition.push(...previousVehiclePosition);
   currentDirection = previousDirection;
};

const updateVehiclePosition = (command) => {
   command === "F"
      ? cmdDirectionMapping["F"][currentDirection]()
      : cmdDirectionMapping["B"][currentDirection]();
};

const simulateNewPosition = (command, simulationCount, iteration) => {
   console.log("simulating new position...");
   updateVehiclePosition(command);

   const [x, y] = vehiclePosition;

   if (!isValidNewPosition(x, y)) {
      try {
         throw new Error(
            `${vehiclePosition} is outside the limits of the grid`
         );
      } catch (err) {
         reset();

         console.error(err);
         console.error(
            `failed simulation #${simulationCount} --> iteration #${iteration} --> command: ${command}`
         );

         console.log(
            `reverted to previous position: ${previousVehiclePosition}`
         );
         console.log(`reverted to previous direction: ${previousDirection} \n`);

         return false;
      }
   }

   console.log(`new position: ${vehiclePosition}`);
   return true;
};

const rotateVehicle = (currentCommand) => {
   console.log("rotating vehicle...");

   const currentDirectionIndex = directions.findIndex(
      (direction) => direction === currentDirection
   );

   const isFirstIndex = currentDirectionIndex === 0;
   const isLastIndex = currentDirectionIndex === directions.length - 1;

   const newDirection =
      currentCommand === "R"
         ? directions[isLastIndex ? 0 : currentDirectionIndex + 1]
         : directions[
              isFirstIndex ? directions.length - 1 : currentDirectionIndex - 1
           ];

   currentDirection = newDirection;
   console.log(`new direction: ${newDirection}`);
};

const runSimulation = (commands) => {
   simulationCount += 1;
   previousVehiclePosition = [...vehiclePosition];
   previousDirection = currentDirection;

   console.log(`initiating simulation #${simulationCount}`);

   for (let i = 0; i < commands.length; i++) {
      const currentCommand = commands[i];

      if (currentCommand === "R" || currentCommand === "L") {
         rotateVehicle(currentCommand);
         continue;
      }

      const isSuccessful = simulateNewPosition(
         currentCommand,
         simulationCount,
         i
      );

      if (!isSuccessful) return;
   }

   console.log(`successfully finished simulation #${simulationCount} \n`);
};

console.log(`initial vehicle position: ${vehiclePosition}`);
console.log(`initial direction: ${currentDirection}`);

// move the vehicle from [0,0] to [2,2] and change direction to S
handleInput("FFRFF");

// rotate the vehicle so that direction becomes N, then attempt to move 3x forward, which will result in an error explaining that [-1,2] is outside the limits of the grid. The error will be caught by the script, which then reverts vehicle position and direction to the values before the function was run. Therefore the vehicle is back at [2,2] and direction is set to S
handleInput("LLFFF");

// back up, rotate vehicle to E and move forward 3x to [1,5]
handleInput("BLFFF");

// this will throw an error specifying X as invalid input and citing F,B,R,L as acceptable commands
handleInput("XFFFF");

// proceed to [1,10]
handleInput("FFFFF");

console.log(`final vehicle position: ${vehiclePosition}`);
console.log(`final direction: ${currentDirection}`);
