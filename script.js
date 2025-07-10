const gameContainer = document.getElementById("gameContainer");
const statusDisplay = document.getElementById("status");
const resetButton = document.getElementById("resetBtn");
const darkModeButton = document.getElementById("darkModeBtn");

// Mode selection buttons
const modeSelectionContainer = document.getElementById("modeSelection");
const vsPlayerBtn = document.getElementById("vsPlayerBtn");
const vsComputerBtn = document.getElementById("vsComputerBtn");

const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let currentPlayer = "";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let gameMode = ""; // 'pvp' or 'pvc'
let computerPlayer = "O"; // Computer is always 'O'

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
  if (!gameActive || (gameMode === "pvc" && currentPlayer === computerPlayer)) {
    return;
  }
  const clickedCell = event.target;
  const clickedIndex = parseInt(clickedCell.dataset.index);
  if (gameState[clickedIndex] !== "") {
    return;
  }
  makeMove(clickedIndex, currentPlayer);
  if (gameActive && gameMode === "pvc") {
    gameContainer.style.pointerEvents = "none";
    setTimeout(() => {
      computerMove();
      gameContainer.style.pointerEvents = "auto";
    }, 700);
  }
}

// Helper function to check for a winner on a given board state
function checkWinner(board, player) {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
}

// Smarter computer move logic
function computerMove() {
  if (!gameActive) return;
  const humanPlayer = computerPlayer === "X" ? "O" : "X";
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      const nextState = [...gameState];
      nextState[i] = computerPlayer;
      if (checkWinner(nextState, computerPlayer)) {
        makeMove(i, computerPlayer);
        return;
      }
    }
  }
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      const nextState = [...gameState];
      nextState[i] = humanPlayer;
      if (checkWinner(nextState, humanPlayer)) {
        makeMove(i, computerPlayer);
        return;
      }
    }
  }
  if (gameState[4] === "") {
    makeMove(4, computerPlayer);
    return;
  }
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((i) => gameState[i] === "");
  if (availableCorners.length > 0) {
    const move =
      availableCorners[Math.floor(Math.random() * availableCorners.length)];
    makeMove(move, computerPlayer);
    return;
  }
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter((i) => gameState[i] === "");
  if (availableSides.length > 0) {
    const move =
      availableSides[Math.floor(Math.random() * availableSides.length)];
    makeMove(move, computerPlayer);
    return;
  }
}

// Generalized function to make a move
function makeMove(index, player) {
  if (!gameActive || gameState[index] !== "") return;
  gameState[index] = player;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  cell.classList.add(player);
  cell.textContent = player;
  cell.style.transform = "scale(1.1)";
  if (moveSound) {
    moveSound
      .play()
      .catch((error) => console.error("Sound playback failed:", error));
  }
  setTimeout(() => {
    cell.style.transform = "scale(1)";
  }, 200);
  checkResult();
}

// **UPDATED**: Check for win or draw with new PvP message
function checkResult() {
  let roundWon = false;
  let winningCondition = null;
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      roundWon = true;
      winningCondition = condition;
      break;
    }
  }

  if (roundWon) {
    highlightWinningCells(winningCondition);
    const winner = currentPlayer;
    let winMessage = "";

    // **UPDATED MESSAGE LOGIC**

    if (gameMode === "pvp") {
      // The 'winner' variable already holds "X" or "O"
      winMessage = `Congratulations Player ${winner}, You Win!`;
    } else if (gameMode === "pvc" && winner === computerPlayer) {
      winMessage = "congratulation Computer wins";
    }

    statusDisplay.textContent = winMessage;
    updateScore(winner);
    if (winSound)
      winSound.play().catch((e) => console.error("Win sound failed", e));
    showCelebration(winner);
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusDisplay.textContent = "It's a draw!";
    if (drawSound)
      drawSound.play().catch((e) => console.error("Draw sound failed", e));
    updateScore("draw");
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  const nextPlayerText =
    gameMode === "pvc" && currentPlayer === computerPlayer
      ? "Computer"
      : `Player ${currentPlayer}`;
  statusDisplay.textContent = `${nextPlayerText}'s turn`;
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

// **UPDATED**: Show celebration animation with new PvP message
function showCelebration(winner) {
  const celebration = document.getElementById("celebration");
  const congratsMessage = celebration.querySelector(".congrats-message");

 
  // **UPDATED MESSAGE LOGIC**
  if (gameMode === "pvp") {
    // The 'winner' variable already holds "X" or "O"
    congratsMessage.textContent = `Congratulations Player ${winner},Win!`;
  } else if (gameMode === "pvc" && winner === computerPlayer) {
    congratsMessage.textContent = "congratulation Computer wins";
  } else {
    congratsMessage.textContent = "Congratulations! You Win!";
  }

  celebration.style.display = "flex";

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
  const x = (Math.random() - 0.5) * 500;
  const y = (Math.random() - 0.5) * 500;
  sparkle.style.setProperty("--x", `${x}px`);
  sparkle.style.setProperty("--y", `${y}px`);
  sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
  document.getElementById("celebration").appendChild(sparkle);
  setTimeout(() => {
    sparkle.remove();
  }, 1000);
}

// Reset the game
function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = false;
  currentPlayer = "";
  gameMode = "";
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("X", "O");
    cell.style.backgroundColor = "";
    cell.style.color = "";
    cell.style.transform = "scale(1)";
  });
  statusDisplay.textContent = "Select a game mode to start!";
  modeSelectionContainer.style.display = "block";
  playerSelection.style.display = "none";
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  darkModeButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
}

// Updated game start flow
function selectMode(mode) {
  gameMode = mode;
  modeSelectionContainer.style.display = "none";
  if (mode === "pvc") {
    startGame("X");
  } else {
    playerSelection.style.display = "block";
    statusDisplay.textContent = "Select your symbol to start!";
  }
}

// Start the game
function startGame(player) {
  currentPlayer = player;
  gameActive = true;
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  playerSelection.style.display = "none";
}

// Event listeners
resetButton.addEventListener("click", resetGame);
darkModeButton.addEventListener("click", toggleDarkMode);
vsPlayerBtn.addEventListener("click", () => selectMode("pvp"));
vsComputerBtn.addEventListener("click", () => selectMode("pvc"));

// Player selection buttons
const playerSelection = document.createElement("div");
playerSelection.innerHTML = `
      <button class="player-select-btn" data-player="X">Play as X</button>
      <button class="player-select-btn" data-player="O">Play as O</button>
    `;
playerSelection.style.marginBottom = "20px";
playerSelection.style.display = "none";
playerSelection.style.textAlign = "center";
document.body.insertBefore(playerSelection, gameContainer);
// This is the corrected line
playerSelection.querySelectorAll(".player-select-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    if (gameMode === "pvp") {
      startGame(event.target.dataset.player);
    }
  });
});

// Initialize the game
createBoard();
