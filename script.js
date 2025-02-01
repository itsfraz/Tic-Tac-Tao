
    const gameContainer = document.getElementById('gameContainer');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('resetBtn');
    const darkModeButton = document.getElementById('darkModeBtn');

    const moveSound = document.getElementById('moveSound');
    const winSound = document.getElementById('winSound');
    const drawSound = document.getElementById('drawSound');

    let currentPlayer = '';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;

    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    let playerXScore = 0;
    let playerOScore = 0;
    let drawScore = 0;

    // Initialize the game board
    function createBoard() {
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        gameContainer.appendChild(cell);
      }
    }

    // Handle cell click events
    function handleCellClick(event) {
      if (!gameActive) return;

      const clickedCell = event.target;
      const clickedIndex = parseInt(clickedCell.dataset.index);

      if (gameState[clickedIndex] !== '') return;

      gameState[clickedIndex] = currentPlayer;
      clickedCell.classList.add(currentPlayer);
      clickedCell.textContent = currentPlayer;
      clickedCell.style.transform = 'scale(1.1)';
      moveSound.play();

      setTimeout(() => {
        clickedCell.style.transform = 'scale(1)';
      }, 200);

      checkResult();
    }

    // Check for win or draw
    function checkResult() {
      let roundWon = false;
      let winningCondition = null;

      for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
          gameState[a] === '' ||
          gameState[b] === '' ||
          gameState[c] === ''
        ) {
          continue;
        }

        if (
          gameState[a] === gameState[b] &&
          gameState[b] === gameState[c]
        ) {
          roundWon = true;
          winningCondition = condition;
          break;
        }
      }

      if (roundWon) {
        highlightWinningCells(winningCondition);
        updateScore(currentPlayer);
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        winSound.play();
        gameActive = false;
        return;
      }

      const isDraw = !gameState.includes('');
      if (isDraw) {
        statusDisplay.textContent = "It's a draw!";
        drawSound.play();
        updateScore('draw');
        gameActive = false;
        return;
      }

      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }

    // Highlight winning cells
    function highlightWinningCells(condition) {
      condition.forEach(index => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.style.backgroundColor = '#f1c40f';
        cell.style.color = '#fff';
      });
    }

    // Update scoreboard
    function updateScore(result) {
      if (result === 'X') playerXScore++;
      else if (result === 'O') playerOScore++;
      else if (result === 'draw') drawScore++;

      document.getElementById('playerXScore').textContent = playerXScore;
      document.getElementById('playerOScore').textContent = playerOScore;
      document.getElementById('drawScore').textContent = drawScore;
    }

    // Reset the game
    function resetGame() {
      gameState = ['', '', '', '', '', '', '', '', ''];
      gameActive = true;
      currentPlayer = '';

      const cells = document.querySelectorAll('.cell');
      cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
        cell.style.backgroundColor = '';
        cell.style.color = '';
        cell.style.transform = 'scale(1)';
      });

      statusDisplay.textContent = 'Select your symbol to start!';
    }

    // Toggle dark mode
    function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
    }

    // Start the game with player selection
    function startGame(player) {
      currentPlayer = player;
      gameActive = true;
      statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }

    // Event listeners
    resetButton.addEventListener('click', resetGame);
    darkModeButton.addEventListener('click', toggleDarkMode);

    // Player selection buttons
    const playerSelection = document.createElement('div');
    playerSelection.innerHTML = `
      <button class="player-select-btn" data-player="X">Play as X</button>
      <button class="player-select-btn" data-player="O">Play as O</button>
    `;
    playerSelection.style.marginBottom = '20px';

    document.body.insertBefore(playerSelection, gameContainer);

    document.querySelectorAll('.player-select-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        startGame(event.target.dataset.player);
        playerSelection.style.display = 'none';
      });
    });

    // Initialize the game
    createBoard();
