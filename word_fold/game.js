const BOARDS = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
]

let foundWordsThisGame = new Set();
let maxScore = 0;
let gameWon = false;

function make_cell_list() {
    let cells = Array.from(document.getElementById("cell-holder").children)
    let cell_board = []
    for (let index = 0; index < 5; index++) {
        cell_board.push(cells.slice(index*5, index*5+5))
    }
    return cell_board
}

const CELLS = make_cell_list()
console.log(CELLS)

function setup_game(board){
    for(let x = 0; x < 5; x++) {
        for(let y = 0; y < 5; y++) {
            CELLS[y][x].innerHTML = board[y][x];
        }
    }
    maxScore = BOARDS[currentBoard].words.length;
    words.innerHTML = "Words to spell: " + BOARDS[currentBoard].words.join(", ")
}

let currentBoard = 0;
const words = document.getElementById("words")

setup_game(BOARDS[currentBoard].cells)


// wordsinnerHTML = "Words to spell: " + BOARDS[currentBoard].words.join(", ")

let select_x = -1
let select_y = -1

function select(x, y) {
    let cell = CELLS[y][x];
    if(cell.innerHTML.length > 0) {
        if (select_x != -1 && select_y != -1) {
            CELLS[select_y][select_x].classList.remove("selected")
        }
        select_x = x;
        select_y = y;
        cell.classList.add("selected");
    }
}

function unselect(x, y) {
    CELLS[y][x].classList.remove("selected");
    select_x = -1;
    select_y = -1;
}

function can_move(x, y) {
    let is_next_to = Math.abs(select_x - x) + Math.abs(select_y - y) == 1

    return select_x != -1 && select_y != -1 && is_next_to && CELLS[y][x].innerHTML.length > 0;
}

function move(x, y) {
    if (can_move(x, y)) {
        CELLS[y][x].innerHTML = CELLS[select_y][select_x].innerHTML + CELLS[y][x].innerHTML;
        CELLS[select_y][select_x].innerHTML = ""; 
        select(x, y);
        checkBoard();
    }
}


function on_click(x, y) {
    if (select_x == x && select_y == y) {
        unselect(x, y)
    } else if (can_move(x, y)) {
        move(x, y)
    } else {
        select(x, y)
    }
}

function resetBoard() {
    gameWon = false;
    foundWordsThisGame.clear();
    setup_game(BOARDS[currentBoard].cells);
    if (select_x != -1 && select_y != -1) {
        unselect(select_x, select_y);
    }
}

function newBoard() {
    let new_board = Math.floor(Math.random() * (BOARDS.length));
    while (new_board == currentBoard) {
        new_board = Math.floor(Math.random() * (BOARDS.length));
    }
    currentBoard = new_board;
    resetBoard();
}

function checkBoard() {
    // Get all unique words currently formed on the board's cells.
    const wordsOnBoard = new Set();
    for (const row of CELLS) {
        for (const cell of row) {
            if (cell.textContent) {
                wordsOnBoard.add(cell.textContent);
            }
        }
    }

    // Rebuild the display string for the word list.
    // Check which of the target words are on the board and add them to our
    // persistent set of found words for this round.
    const targetWords = BOARDS[currentBoard].words;
    for (const word of targetWords) {
        if (wordsOnBoard.has(word)) {
            foundWordsThisGame.add(word);
        }
    }

    // The score is the number of unique words found so far.
    const score = foundWordsThisGame.size;

    // Rebuild the display string, striking through words that are in our found set.
    const displayHTML = targetWords.map(word => {
        return foundWordsThisGame.has(word) ? `<s>${word}</s>` : word;
    }).join(", ");

    words.innerHTML = "Words to spell: " + displayHTML;

    if (score === maxScore && !gameWon) {
        gameWon = true;

        // The variable holding the element is `words`, not `wordsinnerHTML`.
        triggerCoinFall();
        words.innerHTML = "Congratulations! You won! <br>" + words.innerHTML;
    }
}

/**
 * Call this function when the player successfully completes a board.
 * It will create a shower of coins falling from the top of the screen.
 */
function triggerCoinFall() {
    const numCoins = 1000; // Adjust the number of coins as you like
    const container = document.body;
  
    for (let i = 0; i < numCoins; i++) {
      // We create coins with a slight delay to make them appear as a shower
      setTimeout(() => {
        createCoin(container);
      }, i * 5); // Stagger coin creation by 20ms
    }
  }
  
  /**
   * Creates a single coin element and adds it to the container.
   * @param {HTMLElement} container The element to append the coin to.
   */
  function createCoin(container) {
    const coin = document.createElement('div');
    coin.classList.add('coin');
  
    // Set a random horizontal position for the coin
    coin.style.left = `${Math.random() * 100}vw`;
  
    // Set a random duration for the fall animation
    const fallDuration = Math.random() * 1.5 + 2; // 2s to 3.5s
    // Randomly choose between a straight fall and a rotating fall for variety
    const animationName = Math.random() < 0.2 ? 'fall' : 'fall-and-rotate';
    coin.style.animation = `${animationName} ${fallDuration}s linear forwards`;
        // Use `setProperty` to add the CSS variables.
    // Assigning to `coin.style` directly overwrites all other inline styles (like `left` and `animation`).
    coin.style.setProperty('--rotationX', `${Math.random() * 720}deg`);
    coin.style.setProperty('--rotationY', `${Math.random() * 720}deg`);
  
  
    container.appendChild(coin);
  
    // Clean up the DOM by removing the coin after it has fallen
    // The timeout is the animation duration + a small buffer
    setTimeout(() => {
      coin.remove();
    }, fallDuration * 1000 + 500);
  }
 
function onFrame() {

     // Iterate over our cached `CELLS` array for better performance
    // instead of querying the DOM on every animation frame.
    for (const row of CELLS) {
        for (const cell of row) {
            // Use `offsetWidth` to get the cell's actual width in pixels.
            // `cell.style.width` would not work as it only reads inline styles
            // and returns a string (e.g., "100px"), which can't be used in calculations.
            const cellWidth = cell.offsetWidth;
            const textLength = cell.textContent.length;

            if (textLength > 0) {
                // The correct JS property for the CSS 'font-size' is 'fontSize'.
                // We use 'px' units because the calculation is based on the pixel width of the cell.
                // A scaling factor of 0.9 is added to give the text some padding.
                const fontSize = (cellWidth / textLength) * 0.9;
                cell.style.fontSize = `${Math.min(100, fontSize)}px`;
            }
        }
    }
    requestAnimationFrame(onFrame)
}

document.getElementById("new-board").onclick = newBoard;
document.getElementById("reset-board").onclick = resetBoard;


onFrame();