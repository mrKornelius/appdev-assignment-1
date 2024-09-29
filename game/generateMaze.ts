// Maze dimensions
const rows = 33;
const cols = 19;

// Initialize the maze with walls
export default function createMazeWithPaths(): number[][] {
  let maze: number[][] = Array.from(
    { length: rows },
    () => Array(cols).fill(2) // Start with all walls (2)
  );

  // Helper function to shuffle an array (used for randomizing directions)
  function shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // DFS function to carve paths
  function carvePaths(row: number, col: number) {
    // Define possible movements (up, down, left, right)
    const directions = shuffleArray([
      [0, 2],
      [0, -2],
      [2, 0],
      [-2, 0],
    ]);

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      // Ensure the new cell is within bounds and still a wall
      if (
        newRow > 0 &&
        newRow < rows - 1 &&
        newCol > 0 &&
        newCol < cols - 1 &&
        maze[newRow][newCol] === 2
      ) {
        // Carve the path between the current and new cell
        maze[row + dr / 2][col + dc / 2] = 0; // Path
        maze[newRow][newCol] = 0; // Mark as part of the path
        carvePaths(newRow, newCol); // Recursively carve paths
      }
    });
  }

  // Start carving paths from the top-left (odd indices to ensure walls surround paths)
  maze[1][1] = 0;
  carvePaths(1, 1);

  // Place a goal block (1) near the bottom-right corner
  maze[rows - 2][cols - 2] = 1;

  // Randomly place some losing blocks (3) in open spaces
  let placedLosingBlocks = 0;
  const numberOfLosingBlocks = 10;
  while (placedLosingBlocks < numberOfLosingBlocks) {
    const randRow = Math.floor(Math.random() * (rows - 2)) + 1;
    const randCol = Math.floor(Math.random() * (cols - 2)) + 1;

    if (maze[randRow][randCol] === 0) {
      maze[randRow][randCol] = 3;
      placedLosingBlocks++;
    }
  }

  //   const bigMaze = [];
  //   let row = [];

  //   for (let i = 0; i < maze.length; ++i) {
  //     row = [];
  //     for (let j = 0; j < maze[i].length; ++j) {
  //       row.push(maze[i][j]);
  //       row.push(maze[i][j]);
  //     }
  //     bigMaze.push(row);
  //     bigMaze.push(row);
  //   }

  //   return bigMaze;
  return maze;
}

// // Generate the maze
// const mazeWithPaths = createMazeWithPaths();

// // Output the maze matrix (e.g., log it to the console)
// console.log(mazeWithPaths);
