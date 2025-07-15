const ROW_COUNT = 50;
const COL_COUNT = 30;
const navbarElements = ["Home", "Insert", "Draw", "Page Layout", "Formulas", "Data", "Review", "View", "Automate", "Developer"];
const keysToIgnore = ["Enter", "Escape", "Meta", "Shift", "ArrowLeft", "ArrowRigh", "ArrowUp", "ArrowDown"];
const filledCells = [];
const expressions = [];
let currentRow = 0;
let currentCol = 0;

function createMap(){
    const container = document.querySelector('.board-container');
    const headerRowValues = createHeaderRowValues(COL_COUNT);
    const headerColumnValues = createHeaderColumnValues(ROW_COUNT);
    for(let i = 0; i < ROW_COUNT; i++){
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
            rowContainer.append(fieldItem);
        }
        container.append(rowContainer);
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

    if(functionType === "SUM"){
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
}

function checkExpression(expression){
    parseExpression(expression);
    
}

document.addEventListener("keydown", (event) => {
    const value = event.key;
    if(!keysToIgnore.includes(value)){
        insertIntoCell(value);
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
            // for(let i = 0; i < expressions.length; i++){
            //     checkExpression(expressions[i].expression, expressions[i].cell);
            // }    
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    createNavbar();
    createMap();
});