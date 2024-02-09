
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
    const switchTurn = () => (active_player_index === 0) ? 1 : 0; 

    // create an IIFE for the game board to enable interaction
    const gameBoard = function gameBoard () {
        const game_board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        const getBoard = () => game_board;
    
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
    
        return { getBoard, updateBoard, displayBoard };
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
                break;
            } 
        }

        // check horizontal win possibilities
        // we use map to test each row individually for whether every value in it equals the player's symbol
        const symbol_check = (val) => val === player.getSymbol();
        const triple_match = board_state.map((row) => row.every(symbol_check));
        // if any row returns true then the player has won
        if (triple_match.some(Boolean)) {
            victory_status = true;
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
        } 

        return victory_status;
    }

    return { gameBoard, getActivePlayer, switchTurn, checkVictory };
}();