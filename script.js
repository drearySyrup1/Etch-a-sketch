function generateGrid(size) {
    drawingBoard.innerHTML = '';
    let id = 0;
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.dataset.id = i;
        drawingBoard.append(row);
        for (let j = 0; j < size; j++) {
            id++;
            const block = document.createElement('div');
            block.style.width = `${boardWidth / size}px`
            block.style.height = `${boardHeight / size}px`
            block.classList.add('block')
            block.style.background = `rgb(255, 255, 255)`
            block.draggable = false;
            block.dataset.filled = false;
            block.dataset.id = id;

            // for click coloring
            block.addEventListener('click', e => {
                if (rainbowMode) {
                    paintColor = rainbowModeFunction();
                }
                if (darken) {
                    paintColor = darkenMode(block);
                }
                if (lighten) {
                    paintColor = lightenMode(block);
                }
                if (fillMode) {
                    fillModeFunction2(block, block.parentElement);
                    fillBtnReset();
                }
                const filledStatus = block.dataset.filled

                if (filledStatus === 'false') {
                    block.dataset.filled = true;
                    block.style.backgroundColor = paintColor;
                }
            })

            
            // for drag colloring
            block.addEventListener('mouseover', e => {

                if (leftMouse && mouseDown) {
                    if (rainbowMode) {
                        paintColor = rainbowModeFunction();
                    }
                    if (darken) {
                        paintColor = darkenMode(block);
                    }
                    if (lighten) {
                        paintColor = lightenMode(block);
                    }
                    if (strictMode && !(darken || lighten)) {
                        const filledStatus = block.dataset.filled
                        console.log(filledStatus)
                        if (filledStatus === 'false') {
                            block.dataset.filled = true;
                            block.style.backgroundColor = paintColor;
                        }
                    } else {
                        block.dataset.filled = true;
                        block.style.backgroundColor = paintColor;
                    }
                    
                }

                // right mouse drag delete
                if (mouseDown && rightMouse) {
                    block.dataset.filled = false;
                    block.style.backgroundColor = 'rgb(255, 255, 255)';
                }
            })

            // preventing context menu and click delete
            block.addEventListener('contextmenu', e => {
                e.preventDefault();
                block.dataset.filled = false;
                block.style.backgroundColor = 'rgb(255, 255, 255)';
                
            })


            row.append(block);
        }
    }
}


function rainbowModeFunction() {
    const r = rand();
    const g = rand();
    const b = rand();
    paintColor = `rgb(${r},${g},${b})`
    colorPicker.value = rgb2hex(paintColor);
    return paintColor;
}

function darkenMode(block) {
    const rgbColors = block.style.backgroundColor.match(/[0-9]+,\s*[0-9]+,\s*[0-9]+/g)[0].split(',');
    let r = rgbColors[0];
    let g = rgbColors[1];
    let b = rgbColors[2];
    console.log(`rgb(${r},${g},${b})`)
    const darkenVal = 30;
    r = ((r - darkenVal) >= 0) ? r - darkenVal : 0;
    g = ((g - darkenVal) >= 0) ? g - darkenVal : 0;
    b = ((b - darkenVal) >= 0) ? b - darkenVal : 0;
    console.log(`rgb(${r},${g},${b})`)
    return `rgb(${r},${g},${b})`
}

function lightenMode(block) {
    const rgbColors = block.style.backgroundColor.match(/[0-9]+,\s*[0-9]+,\s*[0-9]+/g)[0].split(',');
    let r = +rgbColors[0];
    let g = +rgbColors[1];
    let b = +rgbColors[2];
    console.log(`rgb(${r},${g},${b})`)
    const lightenVal = 30;
    r = ((r + lightenVal) <= 255) ? r + lightenVal : 255;
    g = ((g + lightenVal) <= 255) ? g + lightenVal : 255;
    b = ((b + lightenVal) <= 255) ? b + lightenVal : 255;
    return `rgb(${r},${g},${b})`
}

// random color rgb value

function fillModeFunction2(block) {

    pixels = [];
    drawingBoard.childNodes.forEach(row => {
        const rowAppend = []
        row.childNodes.forEach(block => {
            rowAppend.push(block);
        });
        pixels.push(rowAppend);
    })

    function whatrow(blockid) {
        grid = gridSize.value;
        totalSize = grid**2;
        
        return (grid - 1) - Math.floor((totalSize - blockid) / gridSize.value)

    }
    let grid = gridSize.value - 1;
    let i = whatrow(block.dataset.id);
    let j = pixels[i].indexOf(block);

    function dfs(pixels, i, j) {
        if (i >= grid || j >= grid || i < 0 || j < 0) {
            return;
        } else {
            // let blockcolor = rgb2hex(pixels[i][j].style.backgroundColor);
            // let color = paintColor;
            if (pixels[i][j].dataset.filled === 'true') return;
            pixels[i][j].style.backgroundColor = colorPicker.value;
            pixels[i][j].dataset.filled = 'true';
            dfs(pixels, i - 1, j); //top
            dfs(pixels, i, j - 1); //left
            dfs(pixels, i + 1, j); //bot
            dfs(pixels, i, j + 1); //right
        }
    }

    dfs(pixels, i, j);

}

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

function fillBtnReset() {
    fillMode = false;
    fillButton.style.backgroundColor = 'white';
}




// MAIN VARIABLES


const resetColorPicker = () => paintColor = colorPicker.value;

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

const drawingBoard = document.getElementById('drawing-board');

const boardWidth = parseInt(getComputedStyle(drawingBoard)['height'])
const boardHeight = parseInt(getComputedStyle(drawingBoard)['width'])
const gridSize = document.getElementById('grid-size');
const clearButton = document.getElementById('clear');
const darkenButton = document.getElementById('darken');
const lightenButton = document.getElementById('lighten');
const strictButton = document.getElementById('strict');
const fillButton = document.getElementById('fill');

let currentGridSize = gridSize.value;
const gridButton = document.getElementById('grid');
let gridOn = false;
let rainbowMode = false;
let darken = false;
let lighten = false;
let strictMode = false;
let fillMode = false;
let currentRow = null;

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
    if (darken) {
        darken = false;
        darkenButton.style.backgroundColor = 'white';
        darkenButton.style.color = '#000';
    } else if(lighten) {
        lighten = false;
        lightenButton.style.backgroundColor = 'white';
    }
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

//darken button
darkenButton.addEventListener('click', () => {
    if (lighten) {
        lighten = false;
        lightenButton.style.backgroundColor = 'white';
    } else if (rainbowMode) {
        rainbowMode = false;
        rainbowModeButton.style.backgroundColor = 'white';
    }
    if (!darken) {
        darken = true;
        darkenButton.style.backgroundColor = '#333';
        darkenButton.style.color = '#fff';
        colorPicker.disabled = true;
    } else {
        darken = false;
        colorPicker.disabled = false;
        darkenButton.style.backgroundColor = 'white';
        darkenButton.style.color = '#000';
        resetColorPicker();
    }
})

//ligthen button
lightenButton.addEventListener('click', () => {
    if (darken) {
        darken = false;
        darkenButton.style.backgroundColor = 'white';
        darkenButton.style.color = '#000';
    } else if (rainbowMode) {
        rainbowMode = false;
        rainbowModeButton.style.backgroundColor = 'white';
    }
    if (!lighten) {
        lighten = true;
        lightenButton.style.backgroundColor = '#AAA';
        colorPicker.disabled = true;
    } else {
        lighten = false;
        colorPicker.disabled = false;
        lightenButton.style.backgroundColor = 'white';
        resetColorPicker();
    }
})

strictButton.addEventListener('click', () => {
    if (!strictMode) {
        strictMode = true;
        strictButton.style.backgroundColor = 'red';
    } else {
        strictMode = false;
        strictButton.style.backgroundColor = 'white';
    }
})

fillButton.addEventListener('click', () => {
    if (!fillMode) {
        fillMode = true;
        fillButton.style.backgroundColor = 'red';
    } else {
        fillMode = false;
        fillButton.style.backgroundColor = 'white';
    }
});



generateGrid(gridSize.value);