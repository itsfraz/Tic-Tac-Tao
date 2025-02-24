const gameContainer = document.getElementById("gameContainer");
const statusDisplay = document.getElementById("status");
const resetButton = document.getElementById("resetBtn");
const darkModeButton = document.getElementById("darkModeBtn");

const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let currentPlayer = "";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let playerXScore = 0;
let playerOScore = 0;
let drawScore = 0;

// Initialize the game board
function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    gameContainer.appendChild(cell);
  }
}

// Handle cell click events
function handleCellClick(event) {
  if (!gameActive) return;

  const clickedCell = event.target;
  const clickedIndex = parseInt(clickedCell.dataset.index);

  if (gameState[clickedIndex] !== "") return;

  gameState[clickedIndex] = currentPlayer;
  clickedCell.classList.add(currentPlayer);
  clickedCell.textContent = currentPlayer;
  clickedCell.style.transform = "scale(1.1)";

  // Play move sound
  if (moveSound) {
    moveSound.play().catch(error => {
      console.error("Move sound playback failed:", error);
    });
  }

  setTimeout(() => {
    clickedCell.style.transform = "scale(1)";
  }, 200);

  checkResult();
}

// Check for win or draw
function checkResult() {
  let roundWon = false;
  let winningCondition = null;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {
      continue;
    }

    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      winningCondition = condition;
      break;
    }
  }

  if (roundWon) {
    highlightWinningCells(winningCondition);
    updateScore(currentPlayer);
    statusDisplay.textContent = `Player ${currentPlayer} wins!`;
    if (winSound) {
      winSound.play().catch(error => {
        console.error("Win sound playback failed:", error);
      });
    }
    showCelebration();
    gameActive = false;
    return;
  }

  const isDraw = !gameState.includes("");
  if (isDraw) {
    statusDisplay.textContent = "It's a draw!";
    if (drawSound) {
      drawSound.play().catch(error => {
        console.error("Draw sound playback failed:", error);
      });
    }
    updateScore("draw");
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Highlight winning cells
function highlightWinningCells(condition) {
  condition.forEach((index) => {
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.style.backgroundColor = "#f1c40f";
    cell.style.color = "#fff";
  });
}

// Update scoreboard
function updateScore(result) {
  if (result === "X") playerXScore++;
  else if (result === "O") playerOScore++;
  else if (result === "draw") drawScore++;

  document.getElementById("playerXScore").textContent = playerXScore;
  document.getElementById("playerOScore").textContent = playerOScore;
  document.getElementById("drawScore").textContent = drawScore;
}

// Show celebration animation
function showCelebration() {
  const celebration = document.getElementById("celebration");
  celebration.style.display = "flex";

  // Generate sparkles
  for (let i = 0; i < 50; i++) {
    createSparkle();
  }

  setTimeout(() => {
    celebration.style.display = "none";
  }, 5000);
}

// Create a single sparkle
function createSparkle() {
  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");

  // Random position and movement
  const x = (Math.random() - 0.5) * 500; // Horizontal spread
  const y = (Math.random() - 0.5) * 500; // Vertical spread
  sparkle.style.setProperty("--x", `${x}px`);
  sparkle.style.setProperty("--y", `${y}px`);

  // Random delay for staggered appearance
  sparkle.style.animationDelay = `${Math.random() * 0.5}s`;

  document.getElementById("celebration").appendChild(sparkle);

  // Remove sparkle after animation
  setTimeout(() => {
    sparkle.remove();
  }, 1000);
}

// Reset the game
function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = false;
  currentPlayer = "";

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("X", "O");
    cell.style.backgroundColor = "";
    cell.style.color = "";
    cell.style.transform = "scale(1)";
  });

  playerSelection.style.display = "block";
  statusDisplay.textContent = "Select your symbol to start!";
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  darkModeButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
}

// Start the game with player selection
function startGame(player) {
  currentPlayer = player;
  gameActive = true;
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  playerSelection.style.display = "none";
}

// Event listeners
resetButton.addEventListener("click", resetGame);
darkModeButton.addEventListener("click", toggleDarkMode);

// Player selection buttons
const playerSelection = document.createElement("div");
playerSelection.innerHTML = `
      <button class="player-select-btn" data-player="X">Play as X</button>
      <button class="player-select-btn" data-player="O">Play as O</button>
    `;
playerSelection.style.marginBottom = "20px";
playerSelection.style.display = "block";
playerSelection.style.textAlign = "center";

document.body.insertBefore(playerSelection, gameContainer);

document.querySelectorAll(".player-select-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    startGame(event.target.dataset.player);
  });
});

// Initialize the game
createBoard();