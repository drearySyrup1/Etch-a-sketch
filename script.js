function generateGrid(size) {
    drawingBoard.innerHTML = '';
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        drawingBoard.append(row);
        for (let j = 0; j < size; j++) {
            const block = document.createElement('div');
            block.style.width = `${boardWidth / size}px`
            block.style.height = `${boardHeight / size}px`
            block.style.backgroundColor = '#444';
            block.classList.add('block')
            block.style.background = `white`
            block.draggable = false;
    
            // for click coloring
            block.addEventListener('click', e => {
                if (rainbowMode) {
                    const r = rand();
                    const g = rand();
                    const b = rand();
                    paintColor = `rgb(${r},${g},${b})`
                    colorPicker.value = rgb2hex(paintColor);
                }
                block.style.backgroundColor = paintColor;
            })

            
            // for drag colloring
            block.addEventListener('mouseover', e => {

                if (leftMouse && mouseDown) {
                    if (rainbowMode) {
                        const r = rand();
                        const g = rand();
                        const b = rand();
                        paintColor = `rgb(${r},${g},${b})`
                        colorPicker.value = rgb2hex(paintColor);
                    }
                    block.style.backgroundColor = paintColor;
                    // console.log(e);
                }

                // right mouse drag delete
                if (mouseDown && rightMouse) {
                    block.style.backgroundColor = 'white';
                }
            })

            // preventing context menu and click delete
            block.addEventListener('contextmenu', e => {
                e.preventDefault();
                block.style.backgroundColor = 'white';
                
            })


            row.append(block);
        }
    }
}

// random color rgb value
function rand() {
    return Math.floor(Math.random() * 256);
}


function gridOnFunc(on) {
    const allBlocks = drawingBoard.querySelectorAll('.block');

    if (on) {
        allBlocks.forEach(block => {
            block.style.outline = `1px solid rgba(0,0,0,0.1)`;
        })
    } else {
        allBlocks.forEach(block => {
            block.style.outline = `none`;
    })
    }
}

// MAIN VARIABLES

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

const drawingBoard = document.getElementById('drawing-board');

const boardWidth = parseInt(getComputedStyle(drawingBoard)['height'])
const boardHeight = parseInt(getComputedStyle(drawingBoard)['width'])
const gridSize = document.getElementById('grid-size');
const clearButton = document.getElementById('clear');
let currentGridSize = gridSize.value;
const gridButton = document.getElementById('grid');
let gridOn = false;
let rainbowMode = false;
const colorPicker = document.getElementById('color-picker');
const rainbowModeButton = document.getElementById('rainbow');
let paintColor = colorPicker.value;

const gridSizeLabel = document.querySelector('label[for="grid-size"]');
gridSizeLabel.textContent = `${currentGridSize} x ${currentGridSize}`




let rightMouse= false;
let leftMouse = false;
let mouseDown = false;


// next 2 event listeners
// track: mouse left, right clicks
// when those clicks are being held down
window.addEventListener('mousedown', e => {
    mouseDown = true;
    switch (e.button) {
        case 0:
            leftMouse = true;
            break;
        case 2:
            rightMouse = true;
            break;
    }
})

window.addEventListener('mouseup', e => {
    mouseDown = false;
    switch (e.button) {
        case 0:
            leftMouse = false;
            break;
        case 2:
            rightMouse = false;
            break;
    }
})


// generating new grid with slider
gridSize.addEventListener('input', e => {
    currentGridSize = gridSize.value;
    console.log(currentGridSize)
    generateGrid(currentGridSize);
gridSizeLabel.textContent = `${currentGridSize} x ${currentGridSize}`

    if (gridOn) {
        gridOnFunc(true);
    } else {
        gridOnFunc(false);
    }
})

// clear grid retain same size
clearButton.addEventListener('click', () => {
    generateGrid(currentGridSize);
    if (gridOn) {
        gridOnFunc(true);
    } else {
        gridOnFunc(false);
    }
})

//grid on button
gridButton.addEventListener('click', e => {
    if (!gridOn) {
        gridOn = true;

        gridButton.style.backgroundColor = 'green';

        gridOnFunc(true);
    } else {
        gridOn = false;

        gridButton.style.backgroundColor = 'white';

        gridOnFunc(false);
    }
})

// change color
colorPicker.addEventListener('change', e => {
    paintColor = colorPicker.value;
})


//rainbow mode
rainbowModeButton.addEventListener('click', () => {
    if (!rainbowMode) {
        rainbowMode = true;
        colorPicker.disabled = true;

        rainbowModeButton.style.backgroundColor = 'red';
    } else {
        rainbowMode = false;
        colorPicker.disabled = false;
        rainbowModeButton.style.backgroundColor = 'white';

    }
})

// for testing ONLY what is being dragged
// document.body.childNodes.forEach(item => {
//     item.addEventListener('drag', e => {
//         console.log(e.target);
//     })
// })




generateGrid(gridSize.value);