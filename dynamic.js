
// GAME MANAGEMENT AND OBJECT CREATION

const gameController = function gameController() {
    // create an array to hold player objects
    const players = [];
    const MAX_PLAYERS = 2;

    // create a factory function to create player objects
    function createPlayer (name, symbol) {
        const getName = () => name; 
        const getSymbol = () => symbol;
        return { getName, getSymbol };
    }

    // visible function that adds players to the player array
    const addPlayer = function addPlayer(name, symbol) {
        if (players.length < MAX_PLAYERS) {
            const new_player = createPlayer(name, symbol);
            players.push(new_player);    
        } else {
            console.log("There is a maximum of two players allowed");
        }
    }

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

        // create a function to check whether a player has won 
        // returns true if so, false otherwise
        const checkVictory = function checkVictory(player) {
            let victory_status = false;
            
            // check vertical win possibilities
            for (let col = 0; col < 3; col++) {
                let num_matches = 0;
                for (let row = 0; row < 3; row++) {
                    if (game_board[row][col] === player.getSymbol()) {
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
            const triple_match = game_board.map((row) => row.every(symbol_check));
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
                
                if (game_board[row][col] === player.getSymbol()) {
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
                
                if (game_board[row][col] === player.getSymbol()) {
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
            // we use map to test each row individually for whether any value equals the empty string (open spot)
            const empty_check = (val) => val === '';
            const spot_available = game_board.map((row) => row.some(empty_check));

            // if any row returns true then the board is not full
            if (spot_available.some(Boolean)) {
                return false;
            }

            // otherwise the board is full
            return true;
        }
    
        return { getBoard, resetBoard, updateBoard, displayBoard, checkVictory, checkFull };
    }();

    // reset the game state 
    const resetGame = function resetGame() {
        // clear the board and player arrays;
        gameBoard.resetBoard();
        players.length = 0;
        active_player_index = 0;
    };

    return { addPlayer, gameBoard, getActivePlayer, switchTurn, resetGame };
}();

// DOM MANIPULATION

const DOMController = function DOMController() {
    // RENDER BOARD TO SCREEEN
    const renderBoard = function renderBoard(board_state) {
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
                board_tile.id = row * 3 + col;
                board_grid.appendChild(board_tile);
            }
        }
    }

    // GAME DISPLAY MANIPULATION
    const game_display = document.querySelector('#game-display');

    // make the display visible
    const showDisplay = function toggleDisplay() {
        game_display.classList.remove('hidden');
    }

    // update the game display 
    const updateDisplay = function updateDisplay(message) {
        game_display.textContent = message;
    }

    // mark the tile to indicate it has been selected
    const markTile = function markTile(tile, symbol) {
        // change the tile's textContent to the player's symbol
        tile.textContent = symbol;

        // remove hover effect to show user they can no longer click the tile
        tile.classList.remove("interactable");
    }

    return { renderBoard, showDisplay, updateDisplay, markTile };
}();

// GAME INTERFACE BETWEEN DOM AND GAME LOGIC

const gameInterface = function gameInterface() {
    // function that handles the appearance, submission, and processing of the start_form
    const awaitStart = function awaitStart() {
        // DOM references
        const dialog = document.querySelector("dialog");
        const start_button = document.querySelector("#start-button");
        const start_game_form = document.querySelector('[name="start-game-form"]');

        // grab the game state and render the board
        const board_state = gameController.gameBoard.getBoard();
        DOMController.renderBoard(board_state);

        // activate the modal dialog form when the user clicks the button
        start_button.addEventListener('click', () => {
            dialog.showModal();
        });

        // process the form contents when the user clicks the submit button 
        start_game_form.addEventListener('submit', (event) => {
            // reset the game state in case we are restarting
            gameController.resetGame();

            // create two different player objects with the info from the form 
            gameController.addPlayer(event.target.playerOne.value, 'X');
            gameController.addPlayer(event.target.playerTwo.value, 'O');

            // start the game
            startGame();
        });
    }

    // GAME SETUP
    function startGame() {
        // grab the game state and render the board
        const board_state = gameController.gameBoard.getBoard();
        DOMController.renderBoard(board_state);
        
        // make the board dynamic / responsive
        makeBoardInteractable();

        // update the display to indicate which player's turn it is and remove it's hidden class
        displayTurnMessage();
        DOMController.showDisplay();
    }

    function displayTurnMessage() {
        const message = `Player ${gameController.getActivePlayer().getSymbol()} - ${gameController.getActivePlayer().getName()}'s Turn`
        DOMController.updateDisplay(message);
    }

    // GAME LOGIC / INTERACTION
    function makeBoardInteractable() {
        const tiles = document.querySelectorAll('.board-tile');

        // add a 'click' event handler and a :hover effect to each tile
        tiles.forEach((tile) => {
            tile.addEventListener('click', handleTileClick, {once : true})
            tile.classList.add("interactable");
        });
    }

    function handleTileClick(e) {
        // update the game_board with the player's symbol
        const index = e.target.id;
        const row = Math.floor(index / 3);
        const col = index % 3;  
        gameController.gameBoard.updateBoard(row, col, gameController.getActivePlayer());

        // update the DOM representation to mirror the back-end
        DOMController.markTile(e.target, gameController.getActivePlayer().getSymbol());
        
        // check for a victory or tie, then switch to the next turn if not so  
        const active_player = gameController.getActivePlayer();
        if (gameController.gameBoard.checkVictory(active_player)) {
            // update the display then remove the remaining eventListeners to disable the game
            DOMController.updateDisplay(`Player ${active_player.getSymbol()} - That is ${active_player.getName()}, Wins!`);
            handleVictory();
        } else if (gameController.gameBoard.checkFull()) {
            // update the display to indicate it is a tie
            DOMController.updateDisplay("It's a Tie!");
        } else {
            // if there was neither a victory or tie . . . 
            gameController.switchTurn();
            displayTurnMessage();
        }
    }

    // remove the eventListeners and :hover effect from the tiles when a player wins
    function handleVictory() {
        const tiles = document.querySelectorAll('.board-tile');
        tiles.forEach((tile) => {
            tile.removeEventListener('click', handleTileClick);
            tile.classList.remove("interactable");
        });
    }

    return { awaitStart }
}();

gameInterface.awaitStart();
