//*******This is module. Think like its singleton you create once and thats it cant create more************
const gameBoard = (function () {
    const totalCell = 9;
    const board = [];

    function createBoard() {
        for (let i = 0; i < totalCell; i++) {
            board.push(cell());
            board[i].setID(i);
        }
    }
    createBoard();

    const getBoard = () => board;

    function _renderBoardConsole() {
        let cells = '';
        for (let i = 0; i < totalCell; i++) {
            if (i % 3 === 0) {
                cells = cells + "\n"
            }
            cells = cells + `${board[i].getToken()}`;

        }
        console.log(cells);
    }


    function attachPlayerToCell(index, player) {
        board[index].addToken(player);
        _renderBoardConsole();
    }



    function resetBoard() {
        board.forEach(cell => {
            cell.resetCell();
        })
    }

    return { getBoard, attachPlayerToCell, resetBoard };
})();

const gameController = (function () {
    const board = gameBoard.getBoard();
    const player1 = CreatePlayer();
    const player2 = CreatePlayer();
    player1.setToken("X");
    player2.setToken("O");

    const WIN_CONDITIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]

    ];



    let activePlayer = player1;
    let getActivePlayer = () => activePlayer;

    function chooseStarter() {
        let randNumber = Math.floor(Math.random() * 2) + 1;
        if (randNumber === 1) activePlayer = player1;
        else activePlayer = player2;
    }
    chooseStarter();
    function switchActivePlayer() {
        activePlayer = activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
    }

    function isWinner() {
        for (let i = 0; i < WIN_CONDITIONS.length; i++) {
            let won = true;
            for (let j = 0; j < WIN_CONDITIONS[i].length; j++) {
                let id = WIN_CONDITIONS[i][j];
                won = board[id].getToken() == activePlayer.getToken() && won;
            }
            if (won) return true;

        }
        return false;
    }

    function isTie() {
        let emptyCells = board.filter((cell => cell.getToken() == 0))
        if (emptyCells > 0) return true;
        return false;
    }

    function playRound(index) {
        const maxCellSize = 8;
        let isOutOfRangeOrNotEmpty =
            index > maxCellSize ||
            index > maxCellSize ||
            board[index].getToken() !== 0;
        //if cell is already taken do nothing or incase if you want to test it on console check the row and column size so it wont go above array size
        if (isOutOfRangeOrNotEmpty) return;

        gameBoard.attachPlayerToCell(index, activePlayer.getToken());
        if (isWinner()) {
            console.log(`${activePlayer.getToken()} is winner`)
            activePlayer.addScore();
            gameBoard.resetBoard();
            return;
        }
        else if (isTie()) {
            console.log("Game over. Board is full");
            gameBoard.resetBoard();

        }
        switchActivePlayer();
    }
    return { playRound };

})();


// const gameController = (function () {
//     const player1 = CreatePlayer();
//     const player2 = CreatePlayer();
//     player1.setToken("X");
//     player2.setToken("O");

//     let anyWinner = false;
//     let shouldReset = false;
//     let activePlayer = player1;
//     let randNumber = Math.floor(Math.random() * 2) + 1;

//     let getActivePlayer = () => activePlayer;

//     function chooseStarter() {
//         if (randNumber === 1) activePlayer = player1;
//         else activePlayer = player2;
//     }
//     chooseStarter();

//     const checkWinner = () => anyWinner;

//     function switchActivePlayer() {
//         activePlayer = activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
//     }

//     function checkIfBoardFull() {

//         shouldReset = false;
//         let emptyCellCount = 0;
//         gameBoard.getBoard().forEach(row => {
//             if (row.filter(cell => cell.getToken() === 0).length > 0) {
//                 emptyCellCount++;
//             }
//         })
//         if (emptyCellCount >= 1) return false;
//         return true;

//     }




//     function checkWinCondition() {
//         const board = gameBoard.getBoard();
//         anyWinner = false;
//         shouldReset = false;
//         //Check rows
//         for (let row = 0; row < gameBoard.getRows(); row++) {
//             if (
//                 board[row][0].getToken() === board[row][1].getToken() &&
//                 board[row][1].getToken() === board[row][2].getToken() &&
//                 board[row][0].getToken() !== 0
//             ) {
//                 anyWinner = true;
//                 console.log(`${activePlayer.getToken()} is winner!`);
//                 break;
//             }
//         }
//         //Check columns
//         for (let column = 0; column < gameBoard.getColumns(); column++) {
//             if (
//                 board[0][column].getToken() === board[1][column].getToken() &&
//                 board[1][column].getToken() === board[2][column].getToken() &&
//                 board[0][column].getToken() !== 0
//             ) {
//                 anyWinner = true;
//                 console.log(`${activePlayer.getToken()} is winner!`);
//                 break;
//             }
//         }

//         //Check Diagonal
//         if (
//             board[0][0].getToken() === board[1][1].getToken() &&
//             board[1][1].getToken() === board[2][2].getToken() &&
//             board[0][0].getToken() !== 0
//         ) {
//             anyWinner = true;
//             console.log(`${activePlayer.getToken()} is winner!`);
//         }

//         //Check Cross Diagonal
//         if (
//             board[0][2].getToken() === board[1][1].getToken() &&
//             board[1][1].getToken() === board[2][0].getToken() &&
//             board[0][2].getToken() !== 0
//         ) {
//             anyWinner = true;
//             console.log(`${activePlayer.getToken()} is winner!`);
//         }

//         if (!anyWinner) {

//             console.log("No one is winner yet");
//         }
//     }

//     function playRound(row, column) {

//         const maxTokenSize = 2;

//         let isOutOfRangeOrNotEmpty =
//             row > maxTokenSize ||
//             column > maxTokenSize ||
//             gameBoard.getBoard()[row][column].getToken() !== 0;
//         //if cell is already taken do nothing or incase if you want to test it on console check the row and column size so it wont go above array size
//         if (isOutOfRangeOrNotEmpty) return;


//         gameBoard.attachPlayerToCell(row, column, activePlayer.getToken());
//         checkWinCondition();
//         if (anyWinner) {
//             activePlayer.addScore();
//             shouldReset = true;
//             return;
//         }
//         else if (checkIfBoardFull()) {
//             shouldReset = true;
//             console.log("Game over. Board is full");

//         }
//         switchActivePlayer();


//     }
//     const shouldRestartGame = () => shouldReset;

//     return { playRound, shouldRestartGame, getActivePlayer, };
// })();


// const screenController = (function () {
//     const boardScreen = document.querySelector(".board");
//     const board = gameBoard.getBoard();


//     function updateCell(selectedCell) {

//         selectedCell.innerText = board[selectedCell.dataset.row][selectedCell.dataset.column].getToken();
//     }


//     function createNewBoard() {
//         boardScreen.textContent = '';
//         board.forEach((row, rowIndex) => {
//             row.forEach((cell, columnIndex) => {
//                 const cellButton = document.createElement("button");
//                 cellButton.classList.add("cell");
//                 cellButton.dataset.row = rowIndex;
//                 cellButton.dataset.column = columnIndex;
//                 if (cell.getToken() !== 0) cellButton.innerText = cell.getToken();
//                 boardScreen.appendChild(cellButton);


//             })
//         })
//     }

//     function attachButtonEvent(event) {
//         const selectedCell = event.target;

//         gameController.playRound(selectedCell.dataset.row, selectedCell.dataset.column);
//         updateCell(selectedCell);
//         if (gameController.shouldRestartGame()) {
//             gameBoard.resetBoard();
//             createNewBoard();
//         }


//     }
//     createNewBoard();
//     boardScreen.addEventListener("click", attachButtonEvent);


// })();

// //*******This is factory function. You can create from it as much as you want************
function cell() {
    let id = 0;
    let value = 0;

    const addToken = (token) => {
        value = token;
    };
    const getToken = () => value;

    const resetCell = () => {
        value = 0;
    }
    const setID = (cellID) => {
        id = cellID;
    }
    const getID = () => id;

    return { addToken, getToken, resetCell, setID, getID };

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