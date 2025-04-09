//*******This is module. Think like its singleton you create once and thats it cant create more************
const gameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    function _initBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(cell());
            }
        }
    }
    _initBoard();

    const getBoard = () => board;

    function _renderBoard() {
        let cells = "";
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                cells = cells.concat(`${board[i][j].getToken()}`)
            }
            cells = cells.concat('\n');
        }
        console.log(cells);
    }

    //Each cell represent that a player1(X) , player2(O) or empty (0) value
    function attachPlayerToCell(row, column, playerToken) {

        board[row][column].addToken(playerToken);
        _renderBoard();
    }

    return { getBoard, attachPlayerToCell };
})();

const gameController = (function () {
    const player1 = CreatePlayer();
    const player2 = CreatePlayer();
    player1.setToken("X");
    player2.setToken("O");

    let activePlayer = player1;
    let randNumber = Math.floor(Math.random() * 2) + 1;

    function chooseStarter() {
        if (randNumber === 1) activePlayer = player1;
        else activePlayer = player2;
    }
    chooseStarter();

    function switchActivePlayer() {
        activePlayer = activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
        console.log(activePlayer.getToken());
    }

    function playRound(row, column) {
        const maxTokenSize = 2;

        let isOutOfRangeOrNotEmpty =
            row > maxTokenSize ||
            column > maxTokenSize ||
            gameBoard.getBoard()[row][column].getToken() !== 0;

        //if cell is already taken do nothing
        if (isOutOfRangeOrNotEmpty) {
            alert("Out of range or token has already taken");
            return;
        }
        else {
            gameBoard.attachPlayerToCell(row, column, activePlayer.getToken());

        }

    }


    return { player1, player2, activePlayer, playRound, switchActivePlayer };
})();


//*******This is factory function. You can create from it as much as you want************
function cell() {
    let value = 0;

    const addToken = (token) => {
        value = token;
    };
    const getToken = () => value;

    return { addToken, getToken };

}

function CreatePlayer() {
    let totalScore = 0;
    let playerToken = "";
    const getScore = () => totalScore;
    const addScore = () => {
        totalScore++;
    };

    const setToken = (token) => {
        playerToken = token;
    };
    const getToken = () => playerToken;

    return { getScore, addScore, setToken, getToken };

}