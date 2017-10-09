var canvas;

// TO KNOW WHICH CELL PLAYER IS IN
var playerX = 0;
var playerY = 0;
var playerMoveX = 0;
var playerMoveY = 0;

// KEEP TRACK OF NUM OF COLS AND ROWS
var cols; 
var rows;

// TO DEFINE DIMENTIONS OF ONE CELL
var w = 16;

// TO STORE CELL OBJECTS IN ORDER: LEFT - RIGHT & TOP - BOTTOM
var grid = [];

// KEEPS TRACK OF CURRENT CELL
var current;

// KEEPS TRACK OF VISITED CELLS WHEN GENERATING THE MAZE
var stack = [];

// STORES THE FURTHEST CELL TO MAXIMIZE CORRECT MAZE PATH
var furthestCell;

// USED TO TRACK WHICH CELL IS FURTHEST FROM START
var stackLength = 0;

// SET TO TRUE WHEN MAZE IS FINISHED GENERATING
var mazeFinished = false;

// SET TO TRUE WHEN PLAYER HAS COMPLETED MAZE
var gameOver = false;

// SET SECONDS
var seconds = 0;

var minutes = 0;
// USER SECONDS
var userTime;

var difficultyChosen = false;

var difficulty = 'HARD';

var timerDiv;

var timeTaken;

var countDown = 3;

var radios;


var time = setInterval(() => {
    if (mazeFinished && gameOver === false && difficultyChosen) {

        if (countDown > 0) {

            countDown -= 1;

        }

        if (countDown < 1) {

            if (difficulty === 'EASY') {
                
                userTime = floor(stackLength / 3);
                
                stackLength -= 3;
                
            } else if (difficulty === 'MEDIUM') {
                
                userTime = floor(stackLength / 6);
    
                stackLength -= 6;

            } else if (difficulty === 'HARD') {
                
                userTime = floor(stackLength / 9);
                
                stackLength -= 9;

            } 
    
            if (userTime > 59) {
                minutes = floor(userTime / 60);
                seconds = userTime % 60;
            } else {
                minutes = 0;
                seconds = userTime;
            }

        }
        
    }
}, 1000);
// SETUP IS A P5.JS FUNCTION
function setup() {

    canvas = createCanvas(480, 480);
    centerCanvas();


    cols = floor(width / w);
    rows = floor(height / w);


    timeTaken = createDiv('');
    timeTaken.position(windowWidth / 2 - 10, 50)

    // FOR TESTING TO SLOW DOWN FRAME RATE
    frameRate(1200);

    difficultyRadio = createRadio();
    difficultyRadio.option('EASY');
    difficultyRadio.option('MEDIUM');
    difficultyRadio.option('HARD');
    difficultyRadio.position(windowWidth / 2 - 110, 100);


    radios = $(':input');

    // PUSHES A NEW CELL TO THE GRID
    for (var j = 0; j < rows; j++) {

        for (var i = 0; i < cols; i++) {

            var cell = new Cell(i, j);

            grid.push(cell);

        }

    }

    // SETS CURRENT CELL TO TOP LEFT CORNER
    current = grid[0];

}

function centerCanvas() {
    let x = (windowWidth - width) / 2;
    canvas.position(x, 150);
}

function windowResized() {
    centerCanvas();
}

// DRAW IS A P5.JS FUNCTION
// IT RUNS CONTINUOUSLY UNTIL noLopp() IS CALLED
function draw() {

    background(100);

    // CREATE GRID THAT GETS COVERED AS MAZE IS GENERATED
    for (var i = 0; i < grid.length; i++) {

        grid[i].show();

    }

    current.visited = true;


    // ONLY SHOW THIS AS MAZE IS BEING MADE
    if (mazeFinished === false) {

        current.highlight();
    }
    
    // CALLS FUNCTION THAT SETS THE NEXT CELL THE GENERATOR WILL VISIT BASED ON THE UNVISITED CELLS AROUND THE CURRENT CELL
    var next = current.checkNeighbors();

    if (next) {
        

        next.visited = true;
        
        // PUSHES CURRENT CELL TO THE STACK FOR BACK TRACKING PURPOSES
        stack.push(current);
        
        // REMOVES WALLS BETWEEN CURRENT AND NEXT CELL
        removeWalls(current, next);
        
        // SETS CURRENT CELL TO THE NEXT CELL
        current = next;
        

    // AS LONG AS THERE IS SOMETHING IN THE STACK THE GENERATOR WILL CONTINUE TO RUN
    } else if (stack.length > 0) {
        
        // CHECKS TO SEE IF CURRENT CELL IS FURTHEST FROM STARTING POINT
        if (stack.length > stackLength) {

            // SETS STACKLENGTH CHECKER VARIABLE
            stackLength = stack.length;

            // SETS FURTHEST CELL TO CURRENT CELL
            furthestCell = current;

        }
        
        // SETS CURRENT CELL TO MOST RECENT CELL IN STACK IN ORDER TO BACK TRACK
        // THIS IS THE ENTIRE BACKTRACKING PART
        current = stack.pop();
        

    // WHEN THERE IS NOTHING LEFT IN THE STACK 
    // MEANING THE CURRENT CELL IS AT THE STARTING POSITION    
    } else {

        // CREATES THE ENDING GOAL CELL FROM THE FURTHEST CELL
        var endX = (furthestCell.i) * w;
        var endY = (furthestCell.j) * w;

        // GEM
        //****************************
        if (difficultyChosen) {

            fill(0, 255, 0, 255);
            ellipse(endX + w/2, endY + w/2, w/1.5, w/1.5);

        }
        //****************************
        

        // SETS VARIABLE TO TRUE SIGNALING THE MAZE HAS FINISHED GENERATING
        
        
        mazeFinished = true;

        if (minutes === 0 && seconds === 0) {

        } else if (seconds % 60 === 0) {
            // console.log('seconds', seconds);
            minutes -= 1;
            seconds = 59;
        }

        if (countDown > 0) {

            timeTaken.elt.innerHTML = `${countDown}`;

        } else if (seconds < 10) {

            timeTaken.elt.innerHTML = `${minutes}:0${seconds}`;
        } else if (seconds < 60) {

            timeTaken.elt.innerHTML = `${minutes}:${seconds}`;

        } 
    
        
    }

    var cI = current.i;
    var cJ = current.j;

    if (difficultyChosen) {

        // PLAYER
        // *************************
        noStroke();
        fill(0, 255, 255, 255);
        var player = ellipse(playerMoveX + w / 2, playerMoveY + w / 2, w / 1.5, w / 1.5);
        // *************************

    }

    
    // KEYPRESSES ONLY WORK ONCE THE MAZE HAS FINISHED GENERATING
    if (mazeFinished && gameOver === false && countDown === 0) {

                 // LEFT ARROW
        if (keyIsDown(LEFT_ARROW) && (current.walls[3] !== true && grid[index(cI - 1, cJ)].walls[1] !== true))  {

            playerMoveX -= 4;
            
            // RIGHT ARROW
        } else if (keyIsDown(RIGHT_ARROW) && (current.walls[1] !== true && grid[index(cI + 1, cJ)].walls[3] !== true))  {

            playerMoveX += 4;
            
            // UP ARROW
        } else if (keyIsDown(UP_ARROW) && (current.walls[0] !== true && grid[index(cI, cJ - 1)].walls[2] !== true)) {

            playerMoveY -= 4;
            
            // BOTTOM ARROW
        } else if (keyIsDown(DOWN_ARROW) && (current.walls[2] !== true && grid[index(cI, cJ + 1)].walls[0] !== true))  {

            playerMoveY += 4;

        }
        
        
        player.x = playerMoveX + w / 2;
        player.y = playerMoveY + w / 2;
        

        var currentBottom = ((cJ * w) + (w / 2));
        var currentTop = ((cJ * w) + (w / 2));
        var currentRight = ((cI * w) + (w / 2));
        var currentLeft = ((cI * w) + (w / 2));

        if ((player.y - currentBottom) === w) {
            current = grid[index(cI, cJ + 1)];
        } else if ((currentTop - player.y) === w) {
            current = grid[index(cI, cJ - 1)];
        }

        if ((player.x - currentRight) === w) {
            current = grid[index(cI + 1, cJ)];
        } else if ((currentLeft - player.x) === w) {
            current = grid[index(cI - 1, cJ)];
        }


        
        
    }

    
    // CHECKS TO SEE IF THE PLAYER HAS WON!!!!
    if (current === furthestCell) {
        
        // SET GAME OVER VARIABLE TO TRUE
        gameOver = true;
        
        // STOP seconds
        clearInterval(time);
        
        // LET USER KNOW THEY COMPLETED THE MAZE
        text = createDiv('YOU WON!');
        text.position(windowWidth / 2 - 35, 25);
        

        noLoop();
        
    } else if (countDown === 0 && minutes === 0 && seconds === 0) {

        text = createDiv('SORRY YOU RAN OUT OF TIME. TRY AGAIN.');
        text.position(windowWidth / 2 - 125, 25);

        clearInterval(time);


        noLoop();

    }

    checkDifficultySelection()
    
}

function checkDifficultySelection() {

    if (radios[0].checked) {
        difficulty = 'EASY';
        difficultyChosen = true;
    } else if (radios[1].checked) {
        difficulty = 'MEDIUM';
        difficultyChosen = true;
    } else if (radios[2].checked) {
        difficulty = 'HARD';
        difficultyChosen = true;
    }

    // console.log('difficulty', difficulty);
    // console.log('difficultyChosen', difficultyChosen);

}




// NIFTY LITTLE FUNCTION FOR FINDING THE INDEX OF A CELL IN A 1 DIMENSIONAL ARRAY
function index(i, j) {

    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {

        return -1;

    }

    return i + j * cols;

}



// FUNCTION TO REMOVE THE CORRECT WALLS
// TAKES PARAMETER (CURRENT, NEXT)
function removeWalls(a, b) {

    // CHECKS TO SEE IF THE NEXT CELL IS ABOVE, BELOW, LEFT, or RIGHT OF CURRENT CELL
    // AND SETS THE CURRENT AND NEXT CELLS WALLS ARRAY TO FALSE AT CORRECT INDEX
    // REPRESENTING EITHER THE TOP, RIGHT, BOTTOM, or LEFT WALLS FOR THOSE CELLS

    var x = a.i - b.i;

    var y = a.j - b.j;

    // IF NEXT CELL IS TO THE RIGHT OF CURRENT CELL
    if (x === 1) {

        a.walls[3] = false;

        b.walls[1] = false;

    // IF THE NEXT CELL IS TO THE LEFT OF CURRENT CELL
    } else if (x === -1) {

        a.walls[1] = false;

        b.walls[3] = false;

    }

    // IF THE NEXT CELL IS BELOW THE CURRENT CELL
    if (y === 1) {

        a.walls[0] = false;

        b.walls[2] = false;

    // IF THE NEXT CELL IS ABOVE THE CURRENT CELL
    } else if (y === -1) {

        a.walls[2] = false;

        b.walls[0] = false;

    }

}
