let ROW_COUNT = 50;
const COL_COUNT = 30;
const FIELD_ITEM_HEIGHT = 20;
const FIELD_ITEM_WIDTH = 40;
const navbarElements = ["Home", "Insert", "Draw", "Page Layout", "Formulas", "Data", "Review", "View", "Automate", "Developer"];
const keysToIgnore = ["Enter", "Escape", "Meta", "Shift", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
const navigationKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
const filledCells = [];
const expressions = [];
let startingCell = 0;
let stoppingCell = 0;
let currentRow = 0;
let currentCol = 0;

function createMap(rowCount){
    const container = document.querySelector('.board-container');
    const headerRowValues = createHeaderRowValues(COL_COUNT);
    const headerColumnValues = createHeaderColumnValues(rowCount);
    for(let i = 0; i < rowCount; i++){
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row-item');
        rowContainer.id = `row-${i}`;
        for(let j = 0; j < COL_COUNT; j++){
            const fieldItem = document.createElement('div');
            fieldItem.id = `${i},${j}`;
            fieldItem.classList.add('field-item');
            fieldItem.classList.add('field-item-default-border');
            if(i == 0 && j != 0){
                fieldItem.innerHTML = headerRowValues[j - 1];
                fieldItem.classList.add('header-item');
            }
            if(j == 0 && i != 0){
                fieldItem.innerHTML = headerColumnValues[i - 1];
                fieldItem.classList.add('header-item');
            }
            if(i == 0 && j == 0){
                fieldItem.classList.add('header-item');
            }
            if(!fieldItem.classList.contains('header-item')){
                fieldItem.classList.add('field-item-clickable');
            }
            fieldItem.addEventListener("click", () => {
                selectCell(fieldItem);
            });
            fieldItem.addEventListener("mousedown", () => {
                const [row, col] = fieldItem.id.split(",");
                currentRow = row;
                currentCol = col;
            });
            fieldItem.addEventListener("mouseleave", () => {
                const [row, col] = fieldItem.id.split(",");
                if(row == currentRow && col == currentCol){
                    startingCell = fieldItem;
                }
            });
            fieldItem.addEventListener("mouseup", () => {
                stoppingCell = fieldItem;
                // visualizeMulticellSelection(startingCell, stoppingCell);
            });
            rowContainer.append(fieldItem);
        }
        container.append(rowContainer);
    }
}

function visualizeMulticellSelection(startingCell, stoppingCell){
    const fieldItems = document.querySelectorAll('.field-item-clickable');
    const [startingRow, startingCol] = startingCell.id.split(",");
    const [stoppingRow, stoppingCol] = stoppingCell.id.split(",");
    for(let i = 0; i < fieldItems.length; i++){
        const [row, col] = fieldItems[i].id.split(",");
        if((row >= startingRow && row <= stoppingRow) && (col >= startingCol && col <= stoppingCol)){
            fieldItems[i].classList.remove('field-item-clickable');
            fieldItems[i].classList.add('field-item-multiselected');
        }
    }
}

function createHeaderRowValues(headerLength){
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));
    const headerValues = [];
    for(let i = 0; i < headerLength; i++){
        if(i < alphabet.length){
            headerValues.push(alphabet[i]);
        }
        else {
            headerValues.push("A" + alphabet[i % alphabet.length]);
        }
    }
    return headerValues;
}

function createHeaderColumnValues(headerLength){
    const numbers = Array.from(Array(headerLength).keys());
    return numbers;
}

function createNavbar(){
    const navbar = document.querySelector('.navbar');
    for(let i = 0; i < navbarElements.length; i++){
        const item = document.createElement("div");
        item.classList.add('navbar-item');
        item.innerHTML = navbarElements[i];
        navbar.append(item);
    }
}

function selectCell(item){
    const selectedItemsBefore = document.querySelectorAll('.clicked-field-item');
    for(let i = 0; i < selectedItemsBefore.length; i++){
        selectedItemsBefore[i].classList.remove('clicked-field-item');
        selectedItemsBefore[i].classList.add('field-item-default-border');
    }
    const [row, col] = item.id.split(",");
    currentCol = col;
    currentRow = row;
    item.classList.remove('field-item-default-border');
    item.classList.add('clicked-field-item');
}

function insertIntoCell(value){
    if(currentCol == 0 || currentRow == 0){
        return;
    }
    const selectedCell = document.getElementById(currentRow + "," + currentCol);
    filledCells.push(selectedCell);
    selectedCell.innerHTML += value;
}

function emptyCurrentCell(){
    const selectedCell = document.getElementById(currentRow + "," + currentCol);
    selectedCell.innerHTML = "";
}

function parseExpression(expression, cell){
    expression = expression.replace(")","");
    let [functionType, operands] = expression.split("(");
    functionType = functionType.slice(1, functionType.length);
    operands = operands.split(",");
    let selectedCell = document.getElementById(currentRow + "," + currentCol);
    if(cell){
        selectedCell = cell;
    }
        const operandsValues = [];
        for(let i = 0; i < operands.length; i++){
            const operand = operands[i];
            let col = operand[0].charCodeAt(0) - 64;
            let row = parseInt(operand[1]) + 1;
            const element = document.getElementById(row + "," + col);
            operandsValues.push(parseFloat(element.innerHTML));
        }
        selectedCell.innerHTML = operandsValues[0] + operandsValues[1];
}

function checkExpression(expression, cell){
    parseExpression(expression, cell);
    
}

document.addEventListener("keydown", (event) => {
    const value = event.key;
    if(!keysToIgnore.includes(value)){
        insertIntoCell(value);
    }
    if(navigationKeys.includes(value)){
        if(value === "ArrowUp"){
            currentRow = (currentRow > 1) ? currentRow - 1 : currentRow;
            const selectedCell = document.getElementById(currentRow + "," + currentCol);
            selectCell(selectedCell);
        }
        else if(value === "ArrowDown"){
            currentRow = (currentRow < (ROW_COUNT - 1)) ? parseInt(currentRow) + 1 : currentRow;
            const selectedCell = document.getElementById(currentRow + "," + currentCol);
            selectCell(selectedCell);
        }
        else if(value === "ArrowRight"){
            currentCol = (currentCol < (COL_COUNT - 1)) ? parseInt(currentCol) + 1 : currentCol;
            const selectedCell = document.getElementById(currentRow + "," + currentCol);
            selectCell(selectedCell);
        }
        else if(value === "ArrowLeft"){
            currentCol = (currentCol > 1) ? parseInt(currentCol) - 1 : currentCol;
            const selectedCell = document.getElementById(currentRow + "," + currentCol);
            selectCell(selectedCell);
        }
        return;
    }
    if(value === "Backspace"){
        emptyCurrentCell();
    }
    if(value === "Enter"){
        const selectedCell = document.getElementById(currentRow + "," + currentCol);
        const expression = selectedCell.innerHTML;
        if(expression.includes("=")){
            expressions.push({
                "cell": selectedCell,
                "expression": expression
            });
            checkExpression(expression, null);
        }
        else {
            for(let i = 0; i < expressions.length; i++){
                checkExpression(expressions[i].expression, expressions[i].cell);
            }    
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    createNavbar();
    const rowCount = (window.innerHeight * .8 / FIELD_ITEM_HEIGHT);
    ROW_COUNT = rowCount;
    createMap(Math.floor(rowCount));
});