//create tiles or the platform on which tetris will be played.
const createTiles = (width, height) => {
    let amount = width * height;
    for (var i = 0; i < amount; i++) {
        $('.grid').append('<div></div>');
    };
    //create a bottom the width of the playarea so the tetrominoe doesn't go beyond the floor.
    for (var j = 0; j < width; j++) {
        //these should be invisible beyond the playarea and seal off the playarea.
        $('.grid').append('<div class="taken"></div>');
    }
};

//grid deets
const width = 10;

$(document).ready(function () {
    createTiles(width, 20);

    const grid = $('.grid:first');
    let squares = Array.from($('.grid div'));

    let score = 0;
    const scoreDisplay = $('#score');
    const startBtn = $('#start');
    let nextRandom = 0;
    let timerId;
    let speed = 800;
    let level = 1;


    //the tetrominoes
    //INDEX explained:
    /*   width = 10
        [1, width+1, width*2+1, 2]
    
        after factoring in width:
        =[01, 11, 21, 02]
    
        taking those numbers as x and y values:
        =[(0, 1), (1, 1), (2, 1), (0, 2)
        ]
    
        the x and y values indicate which box to colour.
    
        hope this helps.
        [0,0]  [0,1]  [0,2]
        [1,0]  [1,1]  [1,2]
        [2,0]  [2,1]  [2,2] */
    const lTetrominoe = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [0, width, width + 1, width + 2]
    ];
    const otherLTetrominoe = [
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width, width + 1, width +2, width*2],
        [0,1,width+1,width*2+1],
        [width,width+1,width+2,2]
    ]
    const sTetrominoe = [
        [2, 1, width + 1, width],
        [0, width, width + 1, width * 2 + 1],
        [width * 2, width * 2 + 1, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 2]
    ];
    const tTetrominoe = [
        [width, 1, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width * 2 + 1, width + 2],
        [1, width, width + 1, width * 2 + 1]
    ];
    const iTetrominoe = [
        [1, width + 1, width * 2 + 1],
        [width, width + 1, width + 2],
        [1, width + 1, width * 2 + 1],
        [width, width + 1, width + 2]
    ];
    const oTetrominoe = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];
    const theTetrominoes = [lTetrominoe, otherLTetrominoe, sTetrominoe, tTetrominoe, iTetrominoe, oTetrominoe];

    //randomly select first tetrominoe
    let random = Math.floor(Math.random() * theTetrominoes.length);
    //with our current width of our tetris game 4 makes the piece spawn in the centre as it is 0-9 wide.
    let currentPosition = 4;
    //by setting the second selector to 0 we ensure whenever a tetrominoe spawns it starts in its first position.
    let currentRotation = 0;
    let current = theTetrominoes[random][currentRotation];

    //draw in the first rotation in the first tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrominoe');
        });
    };

    //undraw
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrominoe');
        });
    };


    //assign functions to keycodes
    function control(e) {
        //37 is the keycode for the left on the d-pad.
        if(e.keyCode === 37) {
            moveLeft();
        }
        else if(e.keyCode === 38) {
            rotate();
        }
        else if(e.keyCode === 39) {
            moveRight();
        }
        else if(e.keyCode === 40) {
            moveDown();
        };
    };
    document.addEventListener('keydown', control);

    function moveDown() {
        //this function undraws the first piece then redraws it after adding width to the currentPosition var ie. from 4 to 12 to 24
        undraw();
        currentPosition += width;
        draw();
        freeze();
    };

    //function prevents tetrominoe going beyond the playarea.
    function freeze() {
        //if any of the playarea grid squares conation the class taken. stop tetrominoe moving down and give the class taken
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetrominoe by starting the process over again
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        };
    };

    //move tetrominoes
    function moveLeft() {
        undraw();
        //we can determine if a piece is at the edge by examining each indices of the piece relative to its current position is
        //divisible by 10. This implies it is in the left edge ie. 0,10,20,30 etc, This would have to change if you wanted a 
        //diferent playarea.
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        //if it returns false, adjust its position -1 to give it its new x axis.
        if(!isAtLeftEdge) currentPosition -=1 ;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            //this counteracts the above if the x axis left contains a taken space. Giving the impression its not moved.
            currentPosition += 1;
        };
        draw();
    };

    function moveRight() {
        undraw();
        //this time it's width minus one equaling 9,19,29etc thus the right edge.
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);
        if(!isAtRightEdge) currentPosition += 1;
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        };
        draw();
    };

    function rotate() {
        undraw();
        currentRotation++;
        if(currentRotation === 4) {
            //loops rotation back to the beginning instead of trying to access tetrominoe variations that don't exist.
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }


    //showing what tetrominoe is up next
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;
    //the tetrominoes with no rotation
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],//ltetro
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2],//otherLtetro
        [2, 1, displayWidth + 1, displayWidth],//stetro
        [displayWidth, 1, displayWidth + 1, displayWidth + 2],//t
        [1, displayWidth + 1, displayWidth * 2 + 1],//i
        [0, 1, displayWidth, displayWidth + 1]//o
    ];

    //display shape in the mini-grid
    function displayShape() {
        //remove any trace of a tetrominoe from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetrominoe');
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetrominoe');
        });
    }

    //start/pause button
    startBtn.click( function() {
        if(timerId) {
            //if timerId has a value when button clicked pause game
            clearInterval(timerId);
            timerId = null;
        } else {
            //start everything up again
            draw();
            timerId = setInterval(moveDown, 300);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    });

    function addScore() {
        for(let i=0; i<199; i+=width) {
            //loop through every row and check each tile
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
            //if they all have a taken class then the player has completed a row and desereves some points.
            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.text(score);
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetrominoe');
                });
                //because we're doing this with an array as our playarea we're taking as many completed rows off the end
                //and adding them to the beginning as were. Thus, giving the impression that a row was removed.
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.append(cell));
                levelUp(score);
            }
        }
    }

    //gameover
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.text(' game over! ' + score);
            clearInterval(timerId);
        }
    }

    //level increment
    function levelUp(x) {
        if(speed === 100) {
            $('#level').text('max level keep going!');
        }else if (x%10 === 0) {
            speed -= 50;
            level++;
            $('#level').text(level);
            clearInterval(timerId);
            timerId = setInterval(moveDown, speed);
        }
    }
});