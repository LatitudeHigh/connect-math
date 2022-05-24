var NUM_COLS = 7;
var NUM_ROWS = 6;
var PIECE_DIM; 
var RED = 1;
var BLACK = 2;
var EMPTY = 0;

const RETRY_BOX_X = 242;
const RETRY_BOX_Y = 387;

var curTurn = BLACK;
var gameOver = false;
var board;

var homescreen = true;
var blue;

function start(){
    background();
    displayInstructions();
    mouseClickMethod(startGame);   
}

function background(){
  blue = new Color(70, 145, 242);
  var background = new Rectangle(getWidth(), getHeight());
  background.setColor(blue);
  background.setPosition(0,0);
  add(background);
}

function displayInstructions() {
  addText("To start playing Connect Math, you need to know the binds to control the game: To place a piece on the board you use your mouse and click the space where you want it to go. It is pretty simple and easy to understand. Once you get 4 in a row, a math problem will pop up that you have to solve. If you get the problem right you win the game. Otherwise if you get it wrong you get two more tries to get it right then gives the other person a chance to win.");
}

function addText(text){
  var arr = text.split(" ");
  var wordsPerLine = 7;
  for(var i = 0; i < arr.length; i += wordsPerLine) {
    var lineText = arr.slice(i, i + wordsPerLine).join(" ");
    var label = new Text(lineText, "14pt Arial");
    label.setPosition(
      getWidth()/2 - label.getWidth()/2,
      (label.getHeight() + 10) * (i/wordsPerLine + 1)
    );
    label.setColor(Color.WHITE)
    add(label);
  }
}

function addLines(text) {
  lines = getLines()
}

  function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function startGame() {
    if(homescreen) {
        homescreen = false;
        removeAll();
        // create the grid for the storage of the game logic
        board = new Grid(NUM_ROWS, NUM_COLS);
        // set everything in the grid to EMPTY
        initBoard();
        // Set the piece size to fit on the screen perfectly
        setPieceDimension();
        // drawing the current state of the board
        drawBoard();
        // Registers the function addPiece to run when we click
        mouseClickMethod(addPiece);
    }
}

//adds a piece in the lowest empty row
//of the column clicked. Increments the turn color
function addPiece(e){
    if(!gameOver){
        // gets the x position of the mouse
        var x_pos=e.getX();
        var col = getColumnClicked(x_pos);
        if (col < 0) {
            col = 0;
        }
        var row = getCurRow(col);
        if (row < 0) {
            return;
        }

        var cir = new Circle(PIECE_DIM/2);
        var color = getTurnColor();
        cir.setColor(color);
      
        addCircleAtRowColumn(row, col, cir);
        board.set(row, col, curTurn);
        if(checkForWin(row, col)){
            var correctMath = mathQuestions();

          if(correctMath == false){
              incrementTurn();
          } else {
            displayWinner();
            retryBox();
            retryName();
            gameOver=true;
          }
        } else {
            incrementTurn();
        }
    } else {
        //var x = e.getX();
        //var y = e.getY();
        //if(rectangle.containsPoint(x, y))
        restartGame();
    }
}


//125, 50
function restartGame() {
  initBoard();
  removeAll();
  drawBoard();
  gameOver = false;
}


// Displays a message declaring the current player as
//winner 
function displayWinner(){
    var winner;
    if(curTurn == RED){
        winner = "Red";
    } else {
        winner = "Black";
    }
    var txt = new Text(winner + " wins!", "30pt Arial");
    txt.setPosition(10, 425);
    txt.setColor(Color.black);
    add(txt);
}


//Sets all the values in the grid to zero
function initBoard(){
    for (var row = 0; row < NUM_ROWS; row++){
        for (var col = 0; col < NUM_COLS; col++){
            board.set(row, col, EMPTY);
        }
    }
}


//Calculates the lowest empty row in a given column
function getCurRow(col){
    for (var row = board.numRows() - 1; row >= 0; row--){
        if (board.get(row, col) == EMPTY){
            return row;
        }
    }
    return -1;
}

function checkForWin(row,col){
    if(checkRowForWin(row))
        return true;
    if(checkColForWin(col))
        return true;
    if(checkPosDiagForWin(row,col))
        return true;
    if(checkNegDiagForWin(row,col))
        return true;
    return false;
}


//Scans the given row for a win(four in a row)
function checkRowForWin(row){
    var numInARow = 0;
    var currentColor = EMPTY;
    for (var col = 0; col < NUM_COLS; col++){
        var val = board.get(row, col);
        if (val == currentColor){
            numInARow++;
            if(numInARow == 4 && currentColor != EMPTY){
                println("row");
                return true;
            }
        } else {
            numInARow = 1;
            currentColor=val;
        }
    }
    return false;
}


//Scans the given column for a win(four in a row)
function checkColForWin(col){
    var numInARow = 0;
    var currentColor = EMPTY;
    for (var row = 0; row < NUM_ROWS; row++){
        var val = board.get(row, col);
        if (val == currentColor){
            numInARow++;
            if (numInARow == 4 && currentColor != EMPTY){
                return true;
            }
        } else {
            numInARow = 1;
            currentColor = val;
        }
    }      
    return false;
}


//Scans positive diagonal for a win(four in a row)
function checkPosDiagForWin(row, col){
    var cur_row = row;
    var cur_col = col;
    var currentColor = board.get(row, col);
    var last = currentColor;
    var up = 0;
    var down = 0;
    while (cur_row < NUM_ROWS && cur_col < NUM_COLS && last == currentColor){
        last = board.get(cur_row, cur_col);
        if(last == currentColor){
            up++;
        }
        cur_row++;
        cur_col++;
    }
    cur_row = row;
    cur_col = col;
    last = board.get(cur_row, cur_col)
    while (cur_row > 0 && cur_col > 0 && last == currentColor){
        last = board.get(cur_row, cur_col);
        if(last == currentColor){
            down++;
        }
        cur_row--;
        cur_col--;
    }
    if (up + down > 4){
        println("posDiag");
        return true;
    }
    return false;
}


//Scans negative diagonal for a win(four in a row)
function checkNegDiagForWin(row, col){
    var cur_row = row;
    var cur_col = col;
    var currentColor = board.get(row,col);
    var last = currentColor;
    var up = 0;
    var down = 0;
    while(cur_row < NUM_ROWS && cur_col > 0 && last == currentColor){
    last = board.get(cur_row, cur_col);
    if(last == currentColor){
        up++;
    }
    cur_row++;
    cur_col--;
    }
    cur_row = row;
    cur_col = col;
    last = board.get(cur_row, cur_col)
    while (cur_row > 0 && cur_col < NUM_COLS && last == currentColor){
        last = board.get(cur_row, cur_col);
        if (last==currentColor){
            down++;
        }
        cur_row--;
        cur_col++;
    }
    if (up + down > 4){
        println("negDiag");
        return true;
    }
    return false;
}


//returns the color associated with this turn
function getTurnColor(){
    if (curTurn == BLACK){
        return Color.BLACK
    }    
    return Color.RED;
}


//toggles curTurn
function incrementTurn(){
    if (curTurn == BLACK){
        curTurn = RED;
    } else {
        curTurn = BLACK;
    }
}


//returns the column where the click occured
function getColumnClicked(x){
    var column = (x - x % PIECE_DIM) / PIECE_DIM;
    return column
}


//draws the background and adds
//white "holes" in a grid
function drawBoard(){
    drawBoardBackground();
    for (var row = 0; row < NUM_ROWS; row++){
        for (var col=0; col < NUM_COLS; col++){
            var cir = new Circle(PIECE_DIM / 2);
            cir.setColor(Color.WHITE);
            addCircleAtRowColumn(row, col, cir);
        }
    }
}


//sets the piece dimension based 
//on the largest possible given canvas
//and board dimensions
function setPieceDimension(){
    var height = getHeight();
    var width = getWidth();
    if (width / NUM_COLS < height / NUM_ROWS){
        PIECE_DIM = width / NUM_COLS;
    }else{
        PIECE_DIM = height / NUM_ROWS;
    }
}


function addCircleAtRowColumn(row, col, cir){
    var half = PIECE_DIM / 2;
    var x = col * PIECE_DIM + half;
    var y = row * PIECE_DIM + half;
    cir.setPosition(x, y);
    add(cir);
}


//Draws a blue square at 0,0 that is as 
//big as the limiting canvas dimension allows
function drawBoardBackground(){
    blue = new Color(70, 145, 242);
    var board_width = NUM_COLS * PIECE_DIM;
    var board_height = NUM_ROWS * PIECE_DIM;
    var rect = new Rectangle(board_width, board_height);
    rect.setPosition(0, 0);
    rect.setColor(blue);
    add(rect);
}


function retryBox() {
    //blue = new Color(70, 145, 242);
    var rect = new Rectangle(125, 50);
    rect.setPosition(RETRY_BOX_X, RETRY_BOX_Y);
    //rect.setColor(blue);
    rect.setColor(Color.RED)
    add(rect);
}


function retryName() { 
    var text = new Text("Retry!", "30pt Arial");
    text.setPosition(
        RETRY_BOX_X + 10,
        RETRY_BOX_Y + 37,
    );
    text.setColor(Color.white);
    add(text);
}