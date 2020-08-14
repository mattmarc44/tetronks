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

    const scoreDisplay = $('#score');
    const startBtn = $('#start');


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
    const theTetrominoes = [lTetrominoe, sTetrominoe, tTetrominoe, iTetrominoe, oTetrominoe];

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

    // make the tetrominoe move down at interval
    timerId = setInterval(moveDown, 300);

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
            random = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
        };
    };

    //move tetrominoes
    function moveLeft() {
        undraw();
        //we can determine if a piece is at the edge by examining each indices of the piece relative to its current position is
        //divisible by 0. This implies it is in the left edge ie. 0,10,20,30 etc, This would have to change if you wanted a 
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
        if(currentRotation === current.length) {
            //loops rotation back to the beginning instead of trying to access tetrominoe variations that don't exist.
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }
});