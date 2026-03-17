const n = 3;
const gameModes = ["1 player", "2 players"], pieces = ["X", "O"], difficulties = ["Easy", "Medium", "Impossible"];
let board = [], emptyCells = [];
let gameMode = 0, playerPiece = 0, startsFirst = 0, turn = 0, difficulty = 0, maxDepth = 0, gameOver = false;

function Load() {
    document.getElementById("gameModeBtn").disabled = false;
    document.getElementById("youPieceBtn").disabled = false;
    document.getElementById("oppPieceBtn").disabled = false;
    document.getElementById("startsFirstBtn").disabled = false;
    document.getElementById("difficultyBtn").disabled = false;
    document.getElementById("startBtn").disabled = false;
    document.getElementById("restartBtn").disabled = true;
    for (let i = 0; i < n; i++) {
        board[i] = [];
        for (let j = 0; j < n; j++) {
            board[i][j] = -1;
            emptyCells.push([i, j]);
            document.getElementById(i + "" + j).disabled = true;
            document.getElementById(i + "" + j).innerText = "";
        }
    }
    turn = startsFirst;
}

function ChooseGameMode() {
    gameMode = 1 - gameMode;
    document.getElementById("gameModeBtn").innerText = gameModes[gameMode];
    if (gameMode === 0) {
        document.getElementById("youPieceLbl").innerText = "You";
        document.getElementById("oppPieceLbl").innerText = "Opponent";
        document.getElementById("difficultyBtn").disabled = false;
    }
    else {
        document.getElementById("youPieceLbl").innerText = "Player 1";
        document.getElementById("oppPieceLbl").innerText = "Player 2";
        document.getElementById("difficultyBtn").disabled = true;
    }
}

function ChoosePiece() {
    playerPiece = 1 - playerPiece;
    document.getElementById("youPieceBtn").innerText = pieces[playerPiece];
    document.getElementById("oppPieceBtn").innerText = pieces[1 - playerPiece];
}

function ChooseStartsFirst() {
    startsFirst = 1 - startsFirst;
    turn = startsFirst;
    document.getElementById("startsFirstBtn").innerText = pieces[startsFirst];
}

function ChooseDifficulty() {
    difficulty = (difficulty + 1) % difficulties.length;
    document.getElementById("difficultyBtn").innerText = difficulties[difficulty];
    if (difficulty === 0) {
        maxDepth = -1;
    }
    else if (difficulty === 1) {
        maxDepth = 0;
    }
    else {
        maxDepth = n * n;
    }
}

function IsWin(n, board, piece) {
    // Check rows
    for (let i = 0; i < n; i++) {
        let rowCnt = 0;
        for (let j = 0; j < n; j++) {
            if (board[i][j] === piece) {
                rowCnt++;
            }
        }
        if (rowCnt === n) {
            return true;
        }
    }
    
    // Check columns
    for (let j = 0; j < n; j++) {
        let colCnt = 0;
        for (let i = 0; i < n; i++) {
            if (board[i][j] === piece) {
                colCnt++;
            }
        }
        if (colCnt === n) {
            return true;
        }
    }

    // Check diagonal 1
    let d1Cnt = 0;
    for (let i = 0; i < n; i++) {
        if (board[i][i] === piece) {
            d1Cnt++;
        }
    }
    if (d1Cnt === n) {
        return true;
    }

    // Check diagonal 2
    let d2Cnt = 0;
    for (let i = 0; i < n; i++) {
        if (board[i][n - 1 - i] === piece) {
            d2Cnt++;
        }
    }
    if (d2Cnt === n) {
        return true;
    }

    return false;
}

function IsDraw(emptyCells) {
    return emptyCells.length === 0;
}

function SBE(n, board, piece, emptyCells) {
    if (IsWin(n, board, piece)) {
        return 1000;
    }
    else if (IsWin(n, board, 1 - piece)) {
        return -1000;
    }
    else if (IsDraw(emptyCells)) {
        return 0;
    }
    else {
        let meWins = 0, oppWins = 0;

        // Row wins
        for (let i = 0; i < n; i++) {
            let meRowCnt = 0, oppRowCnt = 0;
            for (let j = 0; j < n; j++) {
                if (board[i][j] === piece) {
                    meRowCnt++;
                }
                else if (board[i][j] === 1 - piece) {
                    oppRowCnt++;
                }
            }
            if (meRowCnt === 0 && oppRowCnt === 0) {
                meWins++;
                oppWins++;
            }
            else if (meRowCnt === 0) {
                oppWins++;
            }
            else if (oppRowCnt === 0) {
                meWins++;
            }
        }

        // Column wins
        for (let j = 0; j < n; j++) {
            let meColCnt = 0, oppColCnt = 0;
            for (let i = 0; i < n; i++) {
                if (board[i][j] === piece) {
                    meColCnt++;
                }
                else if (board[i][j] === 1 - piece) {
                    oppColCnt++;
                }
            }
            if (meColCnt === 0 && oppColCnt === 0) {
                meWins++;
                oppWins++;
            }
            else if (meColCnt === 0) {
                oppWins++;
            }
            else if (oppColCnt === 0) {
                meWins++;
            }
        }

        // Diagonal 1 wins
        let meD1cnt = 0, oppD1cnt = 0;
        for (let i = 0; i < n; i++) {
            if (board[i][i] === piece) {
                meD1cnt++;
            }
            else if (board[i][i] === 1 - piece) {
                oppD1cnt++;
            }
        }
        if (meD1cnt === 0 && oppD1cnt === 0) {
            meWins++;
            oppWins++;
        }
        else if (meD1cnt === 0) {
            oppWins++;
        }
        else if (oppD1cnt === 0) {
            meWins++;
        }

        // Diagonal 2 wins
        let meD2cnt = 0, oppD2cnt = 0;
        for (let i = 0; i < n; i++) {
            if (board[i][n - 1 - i] === piece) {
                meD2cnt++;
            }
            else if (board[i][n - 1 - i] === 1 - piece) {
                oppD2cnt++;
            }
        }
        if (meD2cnt === 0 && oppD2cnt === 0) {
            meWins++;
            oppWins++;
        }
        else if (meD2cnt === 0) {
            oppWins++;
        }
        else if (oppD2cnt === 0) {
            meWins++;
        }

        return meWins - oppWins;
    }
}

function Minimax(depth, maxDepth, n, board, piece, emptyCells, isMax, alpha, beta) {
    if (depth === maxDepth || IsWin(n, board, piece) || IsWin(n, board, 1 - piece) || IsDraw(emptyCells)) {
        let score = SBE(n, board, piece, emptyCells);
        return score - depth;
    }
    else {
        if (isMax) {
            let bestScore = -10000, done = false;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (board[i][j] === -1) {
                        board[i][j] = piece;
                        emptyCells = emptyCells.filter(c => c[0] !== i || c[1] !== j);
                        bestScore = Math.max(bestScore, Minimax(depth + 1, maxDepth, n, board, piece, emptyCells, !isMax, alpha, beta));
                        board[i][j] = -1;
                        emptyCells.push([i, j]);
                        alpha = Math.max(alpha, bestScore);
                        if (alpha >= beta) {
                            done = true;
                            break;
                        }
                    }
                }
                if (done) {
                    break;
                }
            }
            return bestScore;
        }
        else {
            let bestScore = 10000, done = false;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (board[i][j] === -1) {
                        board[i][j] = 1 - piece;
                        emptyCells = emptyCells.filter(c => c[0] !== i || c[1] !== j);
                        bestScore = Math.min(bestScore, Minimax(depth + 1, maxDepth, n, board, piece, emptyCells, !isMax, alpha, beta));
                        board[i][j] = -1;
                        emptyCells.push([i, j]);
                        beta = Math.min(beta, bestScore);
                        if (alpha >= beta) {
                            done = true;
                            break;
                        }
                    }
                }
                if (done) {
                    break;
                }
            }
            return bestScore;
        }
    }
}

function FindBestMove(maxDepth, n, board, piece, emptyCells) {
    let bestMove = -1, bestScore = -100000;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === -1) {
                board[i][j] = piece;
                emptyCells = emptyCells.filter(c => c[0] !== i || c[1] !== j);
                let score = Minimax(0, maxDepth, n, board, piece, emptyCells, false, -1000, 1000);
                board[i][j] = -1;
                emptyCells.push([i, j]);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i * n + j;
                }
            }
        }
    }
    return bestMove;
}

function GameOver() {
    gameOver = true;
    document.getElementById("gameModeBtn").disabled = false;
    document.getElementById("youPieceBtn").disabled = false;
    document.getElementById("oppPieceBtn").disabled = false;
    document.getElementById("startsFirstBtn").disabled = false;
    if (gameMode === 0) {
        document.getElementById("difficultyBtn").disabled = false;
    }
    document.getElementById("startBtn").disabled = false;
    document.getElementById("restartBtn").disabled = true;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            document.getElementById(i + "" + j).disabled = true;
        }
    }
}

function OppMove() {
    if (!gameOver) {
        let row = -1, col = -1;
        if (difficulty === 0) {
            let index = Math.floor(Math.random() * emptyCells.length);
            row = emptyCells[index][0];
            col = emptyCells[index][1];
        }
        else {
            let bestMove = FindBestMove(maxDepth, n, board, 1 - playerPiece, emptyCells);
            row = Math.floor(bestMove / n);
            col = bestMove % n;
        }
        board[row][col] = 1 - playerPiece;
        document.getElementById(row + "" + col).innerText = pieces[1 - playerPiece];
        emptyCells = emptyCells.filter(c => c[0] !== row || c[1] !== col);
        if (IsWin(n, board, 1 - playerPiece)) {
            alert("Opponent wins!");
            GameOver();
        }
        else if (IsDraw(emptyCells)) {
            alert("Draw!");
            GameOver();
        }
    }
}

function Start() {
    gameOver = false;
    document.getElementById("gameModeBtn").disabled = true;
    document.getElementById("youPieceBtn").disabled = true;
    document.getElementById("oppPieceBtn").disabled = true;
    document.getElementById("startsFirstBtn").disabled = true;
    document.getElementById("difficultyBtn").disabled = true;
    document.getElementById("startBtn").disabled = true;
    document.getElementById("restartBtn").disabled = false;
    emptyCells = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            board[i][j] = -1;
            emptyCells.push([i, j]);
            document.getElementById(i + "" + j).disabled = false;
            document.getElementById(i + "" + j).innerText = "";
        }
    }
    turn = startsFirst;
    if (gameMode === 0) {
        if (startsFirst === 1 - playerPiece) {
            OppMove();
        }
    }
}

function Restart() {
    gameOver = false;
    document.getElementById("gameModeBtn").disabled = false;
    document.getElementById("youPieceBtn").disabled = false;
    document.getElementById("oppPieceBtn").disabled = false;
    document.getElementById("startsFirstBtn").disabled = false;
    if (gameMode === 0) {
        document.getElementById("difficultyBtn").disabled = false;
    }
    document.getElementById("startBtn").disabled = false;
    document.getElementById("restartBtn").disabled = true;
    emptyCells = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            board[i][j] = -1;
            emptyCells.push([i, j]);
            document.getElementById(i + "" + j).disabled = true;
            document.getElementById(i + "" + j).innerText = "";
        }
    }
    turn = startsFirst;
}

function PlayerMove(row, col) {
    if (!gameOver) {
        if (gameMode === 0) {
            if (board[row][col] === -1) {
                board[row][col] = playerPiece;
                document.getElementById(row + "" + col).innerText = pieces[playerPiece];
                emptyCells = emptyCells.filter(c => c[0] !== row || c[1] !== col);
                if (IsWin(n, board, playerPiece)) {
                    alert("You win!");
                    GameOver();
                }
                else if (IsDraw(emptyCells)) {
                    alert("Draw!");
                    GameOver();
                }
                else {
                    OppMove();
                }
            }
        }
        else {
            if (board[row][col] === -1) {
                board[row][col] = turn;
                document.getElementById(row + "" + col).innerText = pieces[turn];
                emptyCells = emptyCells.filter(c => c[0] !== row || c[1] !== col);
                turn = 1 - turn;
                if (IsWin(n, board, playerPiece)) {
                    alert("Player 1 wins!");
                    GameOver();
                }
                else if (IsWin(n, board, 1 - playerPiece)) {
                    alert("Player 2 wins!");
                    GameOver();
                }
                else if (IsDraw(emptyCells)) {
                    alert("Draw!");
                    GameOver();
                }
            }
        }
    }
}

Load();