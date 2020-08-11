//create tiles or the platform on which tetris will be played.
const createTiles = (width, height) => {
    let amount = width * height;
    for (var i = 0; i < amount; i++) {
        $('.grid').append('<div class="tile"></div>');
    };
};

//grid deets
const width = 10;

$(document).ready(function () {
    createTiles(width, 20);

    const grid = $('.grid:first');
    let squares = Array.from($('.grid .tile'));

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
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1,width+1,width*2+1, width*2],
        [0,width, width+1, width+2]
    ];
    const sTetrominoe = [
        [width*2, width*2+1, width+1, width+2],
        [0,width,width+1,width*2+1],
        [2,1,width+1,width],
        [1,width+1,width+2,width*2+2]
    ];
    const tTetrominoe = [
        [width, 1, width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width, width+1, width*2+1,width+2],
        [1, width, width+1,width*2+1]
    ];
    const iTetrominoe = [
        [1,width+1,width*2+1],
        [width,width+1,width+2]
    ];
    const oTetrominoe = [
        [0,1,width,width+1]
    ];
    const theTetrominoes = [lTetrominoe, sTetrominoe, tTetrominoe, iTetrominoe, oTetrominoe];

    let currentPosition = 4;
    let current = theTetrominoes[0][0];

    //draw in the first rotation in the first tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrominoe');
        });
    };

    draw()
    console.log(grid, squares);
});