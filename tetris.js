const VERSION = "0.3.0"

let canvas;
let context;
let timer = null;
const PERIOD = 10;
let speed;
const INIT_SPEED = 40;
let frameCounter = 0;
let cellSize;
let cleaningLines = false;

let playing;
let score;
let piecesCount;
let level;
let clearedLines;
const PIECES_TO_INCREASE_LEVEL = 20;

const width = 1 + 10 + 1;
const height = 20 + 1;
let cells = [];
let offsetX;
let offsetY;

var firstInit = true;
var status;
var backgroundAudio;
var lineAudio;
var gameOverAudio;

const CELL_STICK = 0;
const CELL_L1 = 1;
const CELL_L2 = 2;
const CELL_S1 = 3;
const CELL_S2 = 4;
const CELL_SQUARE = 5;
const CELL_PYRAMID = 6;
const CELL_WALL = 7;
const CELL_CLEAR = 8;
const CELL_EMPTY = 9;

const colors = ["#00FFFF", "#FFA500", "#0000FF", "#44FF44", "#FF0000", "#FFFF00", "#800080", "#999999", "#FFFFFF", "#000000"];
const COLOR_FONT = "#EEEEEE";

let currentPiece = null;
let currentPieceX;
let currentPieceY;

const PIECES = [[[[CELL_EMPTY,   CELL_STICK,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_STICK,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_STICK,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_STICK,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_STICK,   CELL_STICK,   CELL_STICK,   CELL_STICK  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]]],
                [[[CELL_EMPTY,   CELL_L1,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_L1,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_L1,      CELL_L1,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_L1,      CELL_L1,      CELL_L1     ],
                  [CELL_EMPTY,   CELL_L1,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_L1,      CELL_L1,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_L1,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_L1,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_EMPTY,   CELL_L1,      CELL_EMPTY  ],
                  [CELL_L1,      CELL_L1,      CELL_L1,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]]],
                [[[CELL_EMPTY,   CELL_EMPTY,   CELL_L2,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_L2,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_L2,      CELL_L2,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_L2,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_L2,      CELL_L2,      CELL_L2     ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_L2,      CELL_L2,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_L2,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_L2,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_L2,      CELL_L2,      CELL_L2,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_L2,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]]],
                [[[CELL_EMPTY,   CELL_S1,      CELL_S1,      CELL_EMPTY  ],
                  [CELL_S1,      CELL_S1,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_S1,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_S1,      CELL_S1,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_S1,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]]],
                [[[CELL_S2,      CELL_S2,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_S2,      CELL_S2,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_EMPTY,   CELL_S2,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_S2,      CELL_S2,      CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_S2,      CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]]],
                [[[CELL_EMPTY,   CELL_SQUARE,  CELL_SQUARE,  CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_SQUARE,  CELL_SQUARE,  CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]]],
                [[[CELL_EMPTY,   CELL_PYRAMID, CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_PYRAMID, CELL_PYRAMID, CELL_PYRAMID, CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_PYRAMID, CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_PYRAMID, CELL_PYRAMID, CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_PYRAMID, CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_PYRAMID, CELL_PYRAMID, CELL_PYRAMID, CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_PYRAMID, CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]],
                 [[CELL_EMPTY,   CELL_PYRAMID, CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_PYRAMID, CELL_PYRAMID, CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_PYRAMID, CELL_EMPTY,   CELL_EMPTY  ],
                  [CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY,   CELL_EMPTY  ]]]];

function getRandom(max) {
    return getRandomMinMax(0, max - 1);
}

function getRandomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function drawBackground() {
    context.fillStyle = colors[CELL_EMPTY];
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCell(x, y, cell = null) {
    if (cell === null) {
        cell = cells[y][x];
    }
    context.fillStyle = colors[cell];
    let posX = offsetX + (cellSize * x);
    let posY = offsetY + (cellSize * y);
    context.fillRect(posX, posY, cellSize - 1, cellSize - 1);
}

function drawBoard() {
    drawBackground();
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            drawCell(x, y);
        }
    }
    if (currentPiece !== null) {
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 4; i++) {
                const pieceCell = currentPiece[currentPieceRotation][j][i];
                if (pieceCell !== CELL_EMPTY) {
                    drawCell(currentPieceX + i, currentPieceY + j, pieceCell);
                }
            }
        }
    }
    context.fillStyle = COLOR_FONT;
    context.font = "bold small-caps " + (cellSize * 2) + "px Courier New";
    var posX = 10;
    var posY = 10 + (cellSize * 2);
    context.fillText("Tetris", posX, posY);

    context.font = "" + (cellSize * 0.5) + "px Courier New";
    posY += cellSize * 0.8;
    context.fillText("v" + VERSION, posX, posY);
    posY += cellSize * 0.8;
    context.fillText("By Emilio González Montaña", posX, posY);
    posY += cellSize * 0.8;
    context.fillText("https://github.com/ociotec/tetris", posX, posY);

    context.font = "" + cellSize + "px Courier New";
    posY += cellSize * 1.5;
    context.fillText("Level:  " + level, posX, posY);
    posY += cellSize;
    context.fillText("Score:  " + score, posX, posY);
    posY += cellSize;
    context.fillText("Pieces: " + piecesCount, posX, posY);
    posY += cellSize;
    context.fillText("Lines:  " + clearedLines, posX, posY);
    posY += cellSize;
    context.fillText("Speed:  " + speed, posX, posY);

    context.font = "" + (cellSize * 0.5) + "px Courier New";
    posY += cellSize * 1.5;
    context.fillText(status, posX, posY);
}

function setTimer() {
    if (timer !== null) {
        clearInterval(timer);
    }
    timer = setInterval(frame, PERIOD);
}

function doesItFit(piece, x, y) {
    var itFits = true;
    if (piece === null) {
        itFits = false;
    }
    else {
        for (var j = 0; itFits && j < 4; j++) {
            for (var i = 0; itFits && i < 4; i++) {
                const pieceCell = piece[j][i];
                if (pieceCell !== CELL_EMPTY) {
                    if (x + i < 0 || x + i >= width || y + j < 0 || y + j >= height) {
                        itFits = false;
                    } else {
                        itFits = (cells[y + j][x + i] == CELL_EMPTY);
                    }
                }
            }
        }
    }
    return itFits;
}

function putPiece(piece, x, y) {
    if (doesItFit(piece, x, y)) {
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 4; i++) {
                const pieceCell = piece[j][i];
                if (pieceCell !== CELL_EMPTY) {
                    cells[y + j][x + i] = pieceCell;
                }
            }
        }
    }
}

function increasePiece() {
    piecesCount++;
    if (piecesCount % PIECES_TO_INCREASE_LEVEL === 0) {
        if (speed > INIT_SPEED / 2) {
            speed -= 5;
        } else if (speed > INIT_SPEED / 4) {
            speed -= 4;
        } else if (speed > INIT_SPEED / 8) {
            speed -= 2;
        } else if (speed > 1) {
            speed -= 1;
        }
        level++;
    }
}

function initBoard() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    let horizontalCellSize = Math.floor(canvas.width / width);
    let verticalCellSize = Math.floor(canvas.height / height);
    cellSize = Math.min(horizontalCellSize, verticalCellSize);
    offsetX = Math.floor((canvas.width - (width * cellSize)) / 2);
    offsetY = Math.floor((canvas.height - (height * cellSize)) / 2);
}

function resetBoard() {
    frameCounter = 0;
    level = 1;
    speed = INIT_SPEED;
    score = 0;
    clearedLines = 0;
    piecesCount = 0;
    playing = true;
    status = "";

    cells = [];
    cells.length = height;
    for (let y = 0; y < height; y++) {
        cells[y] = [];
        cells[y].length = width;
        for (let x = 0; x < width; x++) {
            cells[y][x] = (y === height - 1) || (x === 0) || (x === width - 1) ? CELL_WALL : CELL_EMPTY;
        }
    }

    currentPiece = null;
}

function moveCurrentPieceLeft() {
    if (doesItFit(currentPiece[currentPieceRotation], currentPieceX - 1, currentPieceY)) {
        currentPieceX--;
    }
}

function moveCurrentPieceRight() {
    if (doesItFit(currentPiece[currentPieceRotation], currentPieceX + 1, currentPieceY)) {
        currentPieceX++;
    }
}

function moveCurrentPieceDown() {
    if (currentPiece !== null) {
        if (doesItFit(currentPiece[currentPieceRotation], currentPieceX, currentPieceY + 1)) {
            currentPieceY++;
        } else {
            putPiece(currentPiece[currentPieceRotation], currentPieceX, currentPieceY);
            increasePiece();
            currentPiece = null;
            checkLines();
        }
    }
}

function rotateCurrentPiece() {
    if (currentPiece !== null) {
        var newRotation = (currentPieceRotation + 1) % currentPiece.length;
        if (doesItFit(currentPiece[newRotation], currentPieceX, currentPieceY + 1)) {
            currentPieceRotation = newRotation;
        }
    }
}

function checkLine(j) {
    var fullLine = true;
    var allWalls = true;
    for (var i = 0; fullLine && i < width; i++) {
        if (cells[j][i] == CELL_EMPTY) {
            fullLine = false;
        }
        if (cells[j][i] != CELL_WALL) {
            allWalls = false;
        }
    }
    return fullLine && !allWalls;
}

function calculateScore(lines) {
    return (lines <= 0) ? 0 : (lines + scoreLines(lines - 1));
}

function scoreLines(lines) {
    clearedLines += lines;
    var points = calculateScore(lines);
    if (points > 0) {
        lineAudio.play();
    }
    return points;
}

function checkLines() {
    var lines = 0;
    for (var j = 0; j < height; j++) {
        if (checkLine(j)) {
            for (var i = 0; i < width; i++) {
                if (cells[j][i] != CELL_WALL) {
                    cells[j][i] = CELL_CLEAR;
                }
            }
            lines++;
            cleaningLines = true;
            frameCounter = 0;
        }
    }
    score += scoreLines(lines);
}

function moveLinesDown(y) {
    for (var j = y - 1; j > 0; j--) {
        for (var i = 0; i < width; i++) {
            if (cells[j + 1][i] != CELL_WALL) {
                cells[j + 1][i] = cells[j][i];
            }
        }
    }
}

function cleanLines() {
    for (var j = 0; j < height; j++) {
        if (checkLine(j)) {
            moveLinesDown(j);
        }
    }
    cleaningLines = false;
}

function frame() {
    if (cleaningLines) {
        frameCounter = (frameCounter + 1) % speed;
        if (frameCounter == 0) {
            cleanLines();;
        }
    }
    else if (currentPiece === null) {
        currentPiece = PIECES[getRandom(PIECES.length)].slice();
        currentPieceRotation = 0;
        currentPieceX = Math.floor(width / 2) - 2;
        currentPieceY = 0;
        if (!doesItFit(currentPiece[currentPieceRotation], currentPieceX, currentPieceY)) {
            gameOver();
        }
    } else {
        frameCounter = (frameCounter + 1) % speed;
        if (frameCounter == 0) {
            moveCurrentPieceDown();
        }
    }
    drawBoard();
}

function gameOver() {
    currentPiece = null;
    playing = false;
    clearInterval(timer);
    status = "GAME OVER! press ESC to restart";
    backgroundAudio.pause();
    gameOverAudio.play();
}

function keydown(event) {
    let processed = true;
    let key = event.which;
    switch (key) {
        case 37: // Left arrow
            if (playing) {
                moveCurrentPieceLeft();
            }
            break;
        case 39: // Right arrow
            if (playing) {
                moveCurrentPieceRight();
            }
            break;
        case 38: // Up arrow
            if (playing) {
                rotateCurrentPiece();
            }
            break;
        case 40: // Down arrow
            if (playing) {
                moveCurrentPieceDown();
            }
            break;
        case 27: // Escape
            resetBoard();
            setTimer();
            gameOverAudio.pause();
            backgroundAudio.currentTime = 0;
            backgroundAudio.play();
            break;
        default:
            processed = false;
            break;
    }
    if (!processed) {
        event.preventDefault();
    }
}

function tetris(id) {
    canvas = document.getElementById(id);
    context = canvas.getContext('2d');
    backgroundAudio = new Audio('tetris.mp3');
    lineAudio = new Audio('line.mp3');
    gameOverAudio = new Audio('game_over.mp3');
    backgroundAudio.loop = true;
    canvas.onclick = function() {
        if (firstInit) {
            firstInit = false;
            backgroundAudio.play();
            status = "";
            setTimer();
        }
    };

    initBoard();
    resetBoard();
    status = "Use arrow keys to move, click to start...";
    drawBoard();

    window.addEventListener("resize", initBoard);
    window.addEventListener("keydown", keydown);
}
