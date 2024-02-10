
// GAME MANAGEMENT AND OBJECT CREATION

const gameController = function gameController() {
    // create a factory function to create player objects
    function createPlayer (name, symbol) {
        const getName = () => name; 
        const getSymbol = () => symbol;
        return { getName, getSymbol };
    }

    // create two players to play the game using the factory function
    const player_1 = createPlayer('Zach', 'X');
    const player_2 = createPlayer('Emily', 'O');
    const players = [player_1, player_2];

    // create an active_player variable to facilitate the turn logic
    // holds the index of the active player
    let active_player_index = 0;
    const getActivePlayer = () => players[active_player_index];
    const switchTurn = () => (active_player_index === 0) ? active_player_index = 1 : active_player_index = 0; 

    // create an IIFE for the game board to enable interaction
    const gameBoard = function gameBoard () {
        const game_board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        const getBoard = () => game_board; 

        const resetBoard = function resetBoard() {
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    game_board[row][col] = '';
                }
            }
        }
    
        const updateBoard = function updateBoard(row, col, player) {
            if (game_board[row][col] === '') {
                game_board[row][col] = player.getSymbol();
            } else {
                console.log('Invalid selection, this tile has already been chosen');
            }
        };

        const displayBoard = () => {
            console.table(game_board);
        }
    
        return { getBoard, resetBoard, updateBoard, displayBoard };
    }();

    // create a function to check whether a player has won 
    // returns true if so, false otherwise
    const checkVictory = function checkVictory(player) {
        const board_state = gameBoard.getBoard();
        let victory_status = false;
        
        // check vertical win possibilities
        for (let col = 0; col < 3; col++) {
            let num_matches = 0;
            for (let row = 0; row < 3; row++) {
                if (board_state[row][col] === player.getSymbol()) {
                    num_matches++;
                } else {
                    break;
                }
            }
            if (num_matches === 3) {
                victory_status = true;
                return victory_status;
            } 
        }

        // check horizontal win possibilities
        // we use map to test each row individually for whether every value in it equals the player's symbol
        const symbol_check = (val) => val === player.getSymbol();
        const triple_match = board_state.map((row) => row.every(symbol_check));
        // if any row returns true then the player has won
        if (triple_match.some(Boolean)) {
            victory_status = true;
            return victory_status;
        }

        // check diagonal win possibilities
        // left to right
        let num_matches = 0;
        for (let row = 0; row < 3; row++) {
            let col = row;
            
            if (board_state[row][col] === player.getSymbol()) {
                num_matches++;
            } else {
                break;
            }
        }
        // check number of matches
        if (num_matches === 3) {
            victory_status = true;
            return victory_status;
        } 

        // right to left
        // reset the number of matches 
        num_matches = 0;
        for (let row = 0; row < 3; row++) {
            let col = 2 - row;
            
            if (board_state[row][col] === player.getSymbol()) {
                num_matches++;
            } else {
                break;
            }
        }
        // check number of matches
        if (num_matches === 3) {
            victory_status = true;
            return victory_status;
        } 

        return victory_status;
    }

    // check whether the board is full
    // if neither player has won and the board is full it is a tie
    const checkFull = function checkFull() {
        const board_state = gameBoard.getBoard();

        // we use map to test each row individually for whether any value equals the empty string (open spot)
        const empty_check = (val) => val === '';
        const spot_available = board_state.map((row) => row.some(empty_check));

        // if any row returns true then the board is not full
        if (spot_available.some(Boolean)) {
            return false;
        }

        // otherwise the board is full
        return true;
    }

    return { gameBoard, getActivePlayer, switchTurn, checkVictory, checkFull };
}();

// REACTIVE UI

function renderBoard() {
    const board_state = gameController.gameBoard.getBoard();
    const board_grid = document.querySelector('#board-grid')

    // delete the current state / display by removing all children from the grid
    board_grid.replaceChildren();

    // render the board onto the screen
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            // create a div, add the appropriate text content and class, and add to the board
            const board_tile = document.createElement('div');
            board_tile.textContent = board_state[row][col];
            board_tile.classList.add("board-tile");
            board_tile.classList.add("interactable");
            board_tile.id = row * 3 + col;
            board_grid.appendChild(board_tile);
        }
    }
}

renderBoard();

// TILE SELECTION / INTERACTION
const tileList = document.querySelectorAll('.board-tile');

// if a tile is clicked by the player . . .
tileList.forEach((tile) => tile.addEventListener('click', (e) => {
    // update the game_board with the player's symbol
    const index = e.target.id;
    const row = Math.floor(index / 3);
    const col = index % 3;  
    gameController.gameBoard.updateBoard(row, col, gameController.getActivePlayer());

    // change the tile's textContent to the player's symbol
    e.target.textContent = gameController.getActivePlayer().getSymbol();

    // remove hover effect to show user they can no longer click the tile
    e.target.classList.remove("interactable");
    
// only allow the user to click each tile once
}, {once : true}));

// START GAME LOGIC

// dialog / form

const dialog = document.querySelector("dialog");
const submit_button = document.querySelector("#submit-button");
const reset_button = document.querySelector("#reset-button");

reset_button.addEventListener('click', () => {
    dialog.showModal();
});

submit_button.addEventListener("click", () => {
    dialog.close();
});
