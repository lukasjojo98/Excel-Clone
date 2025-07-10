const ROW_COUNT = 50;
const COL_COUNT = 30;
const navbarElements = ["Home", "Insert", "Draw"];
let currentRow = 0;
let currentCol = 0;
let isEntered = false;
let interval;
let minutes = 0;
let seconds = 0;
let isAnimationDone = true;
let correctLetters = 0;
let enteredWord = "";
let wordToGuess = "";
let isWordGuessed = false;
let isNumbers = true;
let errors = 0;

function createMap() {
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

function createHeaderRowValues(headerLength) {
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

function createHeaderColumnValues(headerLength) {
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

function selectCell(item) {
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

document.addEventListener("DOMContentLoaded", () => {
    createNavbar();
    createMap();
});