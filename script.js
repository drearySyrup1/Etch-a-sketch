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
            // for development and testing
            // block.innerText = id;

            // disable hover click
            // block.addEventListener('', () => {
            // })

            // for click coloring
            block.addEventListener('mousedown', e => {

                if (fillMode) {
                    fillModeFunction2(block, block.parentElement);
                    fillBtnReset();
                } else {
                    paint(block, brushSize);
                }
            })

            
            // for drag colloring
            block.addEventListener('mouseover', e => {
                hoverColor(block); 
                

                if (leftMouse && mouseDown) {
                        paint(block, brushSize);
                        hoverColor(block); 
                }

                // right mouse drag delete
                if (mouseDown && rightMouse) {
                    paint(block, brushSize, true);
                    hoverColor(block); 
                }
            })

            block.addEventListener('mouseleave', e => {
                hoverColor(block, true);
                restoreColors = [];
            })

            // preventing context menu and click delete
            block.addEventListener('contextmenu', e => {
                e.preventDefault();
                paint(block, brushSize, true);
                
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

function darkenMode(block, amt=30) {
    const rgbColors = block.style.backgroundColor.match(/[0-9]+,\s*[0-9]+,\s*[0-9]+/g)[0].split(',');
    let r = rgbColors[0];
    let g = rgbColors[1];
    let b = rgbColors[2];
    const darkenVal = amt;
    r = ((r - darkenVal) >= 0) ? r - darkenVal : 0;
    g = ((g - darkenVal) >= 0) ? g - darkenVal : 0;
    b = ((b - darkenVal) >= 0) ? b - darkenVal : 0;
    return `rgb(${r},${g},${b})`
}

function lightenMode(block, amt=30) {
    const rgbColors = block.style.backgroundColor.match(/[0-9]+,\s*[0-9]+,\s*[0-9]+/g)[0].split(',');
    let r = +rgbColors[0];
    let g = +rgbColors[1];
    let b = +rgbColors[2];
    const lightenVal = amt;
    r = ((r + lightenVal) <= 255) ? r + lightenVal : 255;
    g = ((g + lightenVal) <= 255) ? g + lightenVal : 255;
    b = ((b + lightenVal) <= 255) ? b + lightenVal : 255;
    return `rgb(${r},${g},${b})`
}

// random color rgb value

function generatePixelMatrix() {
    pixels = [];
        drawingBoard.childNodes.forEach(row => {
            const rowAppend = []
            row.childNodes.forEach(block => {
                rowAppend.push(block);
            });
            pixels.push(rowAppend);
        })
    return pixels;
}

function whatrow(blockid) {
    grid = gridSize.value;
    totalSize = grid**2;
    
    return (grid - 1) - Math.floor((totalSize - blockid) / gridSize.value)
}

function fillModeFunction2(block) {
        
    const pixels = generatePixelMatrix();

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
    restoreColors = [];

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

function paint(block, brushSize, deleteMode=false) {
    
    const pixels = generatePixelMatrix();
    let i = whatrow(block.dataset.id);
    let j = pixels[i].indexOf(block);
    let min = 0;
    let max = gridSize.value - 1;
    
    for (let k = 0; k < brushSize; k++) {
        if (i+k > max || i+k < min) continue;
        for (l = 0; l < brushSize; l++) {
            if (j+l > max || j+l < min) continue;
            const block = pixels[i+k][j+l];
            if (deleteMode) {
                block.dataset.filled = false;
                block.style.backgroundColor = 'rgb(255, 255, 255)';
                restoreColors = [];
            } else {
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
                        restoreColors = [];
                    }
                } else {
                    restoreColors = [];
                    block.dataset.filled = true;
                    block.style.backgroundColor = paintColor;
                }
            }
        }
    }
}

function enableMode(mode, enable=true) {
    switch (mode) {
        case"rainbow":
            if (enable) {
                rainbowMode = true;
                colorPicker.disabled = true;
                rainbowModeButton.style.backgroundColor = 'red';
            } else {
                rainbowMode = false;
                colorPicker.disabled = false;
                rainbowModeButton.style.backgroundColor = 'white';
            }
        break;
        case"darken":
            if (enable) {
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
        break;
        case"lighten":
            if (enable) {
                lighten = true;
                lightenButton.style.backgroundColor = '#AAA';
                colorPicker.disabled = true;
            } else {
                lighten = false;
                colorPicker.disabled = false;
                lightenButton.style.backgroundColor = 'white';
                resetColorPicker();
            }
        break;
        case"strict":
            if (enable) {
                strictMode = true;
                strictButton.style.backgroundColor = 'red';
            } else {
                strictMode = false;
                strictButton.style.backgroundColor = 'white';
            }
        break;
        case"fill":
            if (enable) {
                fillMode = true;
                fillButton.style.backgroundColor = 'red';
            } else {
                fillMode = false;
                fillButton.style.backgroundColor = 'white';
            }
    }
    
}


function hoverColor(block, restore=false) {
    const pixels = generatePixelMatrix();
    let i = whatrow(block.dataset.id);
    let j = pixels[i].indexOf(block);
    let min = 0;
    let max = gridSize.value - 1;
    
    let itterTrack = -1;

    for (let k = 0; k < brushSize; k++) {
        if (i+k > max || i+k < min) continue;
        for (l = 0; l < brushSize; l++) {
            if (j+l > max || j+l < min) continue;
            const block = pixels[i+k][j+l];
            itterTrack++;

            if (restore) {
                console.log(itterTrack);
                if (restoreColors.lenght === 0) break;
                // restoreColors[itterTrack].element.style.backgroundColor = restoreColors[0].color;
                restoreColors.forEach(object => {
                    object.element.style.backgroundColor = object.color;
                })
                restoreColors = [];
            } else {
                restoreColors.push({
                    element: block,
                    color: block.style.backgroundColor
                });
                // block.style.backgroundColor = 'rgb(40,40,40)';
                let currentColor = block.style.backgroundColor;
                let hsl = rgbToHsl(currentColor);
                if (hsl['L'] >= 100) {
                    block.style.backgroundColor = darkenMode(block, 100);
                } else {
                    block.style.backgroundColor = lightenMode(block, 100);
                }
            }
        }
    }
}



// HELPER FUNCS
function rgbToHsl(color) {
    let rgbColors = color.match(/[0-9]+,\s*[0-9]+,\s*[0-9]+/g)[0].split(',');
    rgbColors = rgbColors.map(c => +c);

    rgbColors = {
        R:rgbColors[0],
        G:rgbColors[1],
        B:rgbColors[2]
    }

    range = {}

    for (color in rgbColors) {
        range[color] = Math.round((rgbColors[color] / 255) * 100) / 100;
    }

    function findMinMax() {
        min = Infinity;
        max = -Infinity;
        minMax = {}
        for (color in range) {
            if (range[color] < min) {
                min = range[color];
                minMax['min'] = {[color]: range[color]};
            }
        }

        for (color in range) {
            if (range[color] > max) {
                min = range[color];
                minMax['max'] = {[color]: range[color]};
            }
        }

        return minMax;
    }

    minMax = findMinMax();

    minKey = Object.keys(minMax['min']);
    maxKey = Object.keys(minMax['max']);
    minVal = minMax['min'][minKey];
    maxVal = minMax['max'][maxKey]

    let L = Math.round((minVal + maxVal) / 2 * 100);

    let S = 0;

    if (!(minVal === maxVal) ||
        !(rgbColors['R'] === rgbColors['G'] &&
          rgbColors['R'] === rgbColors['B'])) {
            if (L/100 <= 0.5) {
                S = Math.round(((maxVal - minVal) / (maxVal + minVal) * 100))
            } else {
                S = Math.round(((maxVal - minVal) / (2.0 - maxVal - minVal) * 100))
            }
        }


    let H = 0;


    if (S !== 0) {
        if (maxKey[0] === 'R') {
            H = range['G'] - range['B'] / (maxVal - minVal);
        } else if (maxKey[0] === 'G') {
            H = 2.0 + (range['B'] - range['R']) / (maxVal - minVal);
        } else if (maxKey[0] === 'B') {
            H = 4.0 + (range['R'] - range['G']) / (maxVal - minVal);
        }
    }

    H  = Math.round((Math.round(H * 100) / 100) * 60)

    // return `hsl(${H}, ${S}%, ${L}%)`;
    return {
        H:H,
        S:S,
        L:L
    }
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
const brushSizeField = document.getElementById('brush-size');


let restoreColors = []
let brushSize = brushSizeField.value;
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
        enableMode('darken', false);
    } else if(lighten) {
        enableMode('lighten', false);
    }
    if (!rainbowMode) {
        enableMode('rainbow');
    } else {
        enableMode('rainbow', false);
    }
})

//darken button
darkenButton.addEventListener('click', () => {
    if (lighten) {
        enableMode('lighten', false);
    } else if (rainbowMode) {
        enableMode('rainbow', false);
    }
    if (!darken) {
        enableMode('darken');
    } else {
        enableMode('darken', false);
    }
})

//ligthen button
lightenButton.addEventListener('click', () => {
    if (darken) {
        enableMode('darken', false);
    } else if (rainbowMode) {
        enableMode('rainbow', false);
    }
    if (!lighten) {
        enableMode('lighten');
    } else {
        enableMode('lighten', false);
    }
})

strictButton.addEventListener('click', () => {
    if (!strictMode) {
        enableMode('strict');
    } else {
        enableMode('strict', false);
    }
})

fillButton.addEventListener('click', () => {
    if (!fillMode) {
        enableMode('fill');
        enableMode('rainbow', false);
        enableMode('strict', false);
        enableMode('lighten', false);
        enableMode('darken', false);
    } else {
        enableMode('fill', false);
    }
});

brushSizeField.addEventListener('change', () => {
    brushSize = brushSizeField.value;
});



generateGrid(gridSize.value);