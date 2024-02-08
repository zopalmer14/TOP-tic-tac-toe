
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
            console.table(game_board)
        }
    
        return { getBoard, updateBoard, displayBoard };
    }();

    return { gameBoard };
}();