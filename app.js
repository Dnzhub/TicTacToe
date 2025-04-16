const gameBoard = (function () {
    const totalCell = 9;
    const board = [];

    function _createBoard() {
        for (let i = 0; i < totalCell; i++) {
            board.push(cell());
        }
    }
    _createBoard();

    const getBoard = () => board;

    //If you want to play game via console
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
        //_renderBoardConsole();
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
    const _player1 = CreatePlayer();
    const _player2 = CreatePlayer();
    _player1.setToken("X");
    _player2.setToken("O");
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

    const players = {
        firstPlayer: _player1,
        secondPlayer: _player2
    }

    const getPlayers = () => players;

    let activePlayer = _player1;
    const getActivePlayer = () => activePlayer;

    function _chooseStarter() {
        let randNumber = Math.floor(Math.random() * 2) + 1;
        if (randNumber === 1) activePlayer = _player1;
        else activePlayer = _player2;
    }
    _chooseStarter();
    function switchActivePlayer() {
        activePlayer = activePlayer === _player1 ? activePlayer = _player2 : activePlayer = _player1;
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
        let emptyCells = board.filter((cell => cell.getToken() === 0))
        if (emptyCells <= 0) return true;
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


    }
    return { playRound, getActivePlayer, isWinner, isTie, switchActivePlayer, getPlayers };

})();


const screenController = (function () {
    const _boardScreen = document.querySelector(".board");
    const _container = document.querySelector(".container");
    const _board = gameBoard.getBoard();
    const _playerInfo = _container.querySelector(".info");
    const _menu = _container.querySelector(".gameMenu");
    const _roundStarter = _container.querySelector(".round-starter");
    const _firstPlayerAvatars = document.querySelectorAll(".avatar-first img");
    const _secondPlayerAvatars = document.querySelectorAll(".avatar-second img");
    const _startButton = _container.querySelector(".btn-start");
    const _resultScreen = _container.querySelector(".results");
    const _restartButton = _container.querySelector("#btn-restart");
    const _boardContainer = _container.querySelector(".board-container");
    const _menuButton = _container.querySelector(".btn-menu-container");


    let _firstPlayerSelectedAvatar = null;
    let _secondPlayerSelectedAvatar = null;
    //Select each player's avatar individually
    function _storeAvatarSelection(avatars, playerNumber) {
        avatars.forEach(avatar => {
            avatar.addEventListener("click", () => {
                if (playerNumber === 1) {
                    _firstPlayerSelectedAvatar = avatar
                    _markSelectedAvatar(_firstPlayerAvatars, _firstPlayerSelectedAvatar);
                }
                else {
                    _secondPlayerSelectedAvatar = avatar;
                    _markSelectedAvatar(_secondPlayerAvatars, _secondPlayerSelectedAvatar);
                }
            })
        })
    }
    function _markSelectedAvatar(playerAvatars, selectedAvatar) {
        playerAvatars.forEach(avatar => {
            avatar.classList.remove("selected-item");
        });
        selectedAvatar.classList.add("selected-item");

    }
    _storeAvatarSelection(_firstPlayerAvatars, 1);
    _storeAvatarSelection(_secondPlayerAvatars, 2);

    function _setUpAvatars(playerOneAvatar, playerTwoAvatar) {
        if (!_firstPlayerSelectedAvatar) {
            playerOneAvatar.src = "images/blank.jpg";
        }
        else {
            playerOneAvatar.src = _firstPlayerSelectedAvatar.src;
        }
        if (!_secondPlayerSelectedAvatar) {
            playerTwoAvatar.src = "images/blank.jpg";
        }
        else {
            playerTwoAvatar.src = _secondPlayerSelectedAvatar.src;

        }

    }


    function _playRoundStarter() {
        _menu.classList.add("hide");
        _roundStarter.classList.remove("hide");
        let firstPlayer = _roundStarter.querySelector("img:nth-of-type(1)");
        let secondPlayer = _roundStarter.querySelector("img:nth-of-type(2)");
        _setUpAvatars(firstPlayer, secondPlayer);
        _startGame(5);


    }
    function _startGame(seconds) {

        setTimeout(() => {
            let firstPlayerAvatar = _playerInfo.querySelector(".player-info:nth-of-type(1) img");
            let secondPlayerAvatar = _playerInfo.querySelector(".player-info:nth-of-type(2) img");
            _setUpAvatars(firstPlayerAvatar, secondPlayerAvatar)
            _createNewBoard();
            _updateScores();
            _roundStarter.classList.add("hide");
            _menuButton.classList.remove("hide");
            _boardScreen.classList.remove("hide");
            _playerInfo.classList.remove("hide");
        }, seconds * 1000);
    }
    _startButton.addEventListener("click", _playRoundStarter);

    _menuButton.addEventListener("click", () => {
        _roundStarter.classList.add("hide");
        _boardScreen.classList.add("hide");
        _playerInfo.classList.add("hide");
        _menuButton.classList.add("hide");
        _menu.classList.remove("hide");

        for (let player in gameController.getPlayers()) {
            gameController.getPlayers()[player].resetScore();
        }

        _updateScores();

    })
    function _createNewBoard() {
        _boardScreen.textContent = '';
        for (let i = 0; i < _board.length; i++) {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.dataset.index = i;
            _boardScreen.appendChild(cellButton);

        }

    }

    function _attachButtonEvent(event) {
        const selectedCell = event.target;
        //if selected element is board itself or cell is not empty do nothing
        if (selectedCell === _boardScreen || _board[selectedCell.dataset.index].getToken() !== 0) return;

        gameController.playRound(selectedCell.dataset.index);
        _showResults();
        _updateCell(selectedCell);
        gameController.switchActivePlayer();

    }
    function _updateScores() {

        _playerInfo.querySelector("#player1-score").innerText = gameController.getPlayers().firstPlayer.getScore();
        _playerInfo.querySelector("#player2-score").innerText = gameController.getPlayers().secondPlayer.getScore();
    }

    function _updateCell(selectedCell) {

        selectedCell.innerText = _board[selectedCell.dataset.index].getToken();
        selectedCell.classList.add('animateCell');

        setTimeout(() => {
            selectedCell.classList.remove('animateCell');
        }, 500);
    }

    function _showResults() {
        let resultText = _resultScreen.querySelector("h2");
        if (gameController.isWinner()) {

            console.log(`${gameController.getActivePlayer().getToken()} is winner`)
            resultText.innerText = `${gameController.getActivePlayer().getToken()} is winner`;
            _resultScreen.classList.remove("hide");
            gameController.getActivePlayer().addScore();
            _boardContainer.classList.add("blurScreen");
            _updateScores();
            return;
        }
        else if (gameController.isTie()) {
            resultText.innerText = `Tie!`;
            _resultScreen.classList.remove("hide");
            _boardContainer.classList.add("blurScreen");
        }


    }

    function _restartGame() {
        gameBoard.resetBoard();
        _createNewBoard();
        _resultScreen.classList.add("hide");
        _boardContainer.classList.remove("blurScreen");
    }
    _restartButton.addEventListener("click", _restartGame)

    _boardScreen.addEventListener("click", _attachButtonEvent);



})();


function cell() {
    let _value = 0;

    const addToken = (token) => {
        _value = token;
    };
    const getToken = () => _value;

    const resetCell = () => {
        _value = 0;
    }


    return { addToken, getToken, resetCell };

}

function CreatePlayer() {
    let _totalScore = 0;
    let _playerToken = "";
    const getScore = () => _totalScore;
    const addScore = () => {
        _totalScore++;
    };

    const setToken = (token) => {
        _playerToken = token;
    };
    const getToken = () => _playerToken;

    const resetScore = () => _totalScore = 0;

    return { getScore, addScore, setToken, getToken, resetScore };

}