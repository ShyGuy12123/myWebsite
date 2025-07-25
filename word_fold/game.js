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
}

setup_game(BOARDS[0].cells)

document.getElementById("words").innerHTML = "Words to spell: " + BOARDS[0].words.join(", ")

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