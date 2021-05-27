let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let topLeftCell = document.querySelector(".top-left-cell");

let cells = document.querySelector(".cells");
let addressInput = document.querySelector("#address");
let formulaInput = document.querySelector("#formula");
let allCells = document.querySelectorAll(".cell");

// setting top row, left col and top left cell on page scroll
cellsContent.addEventListener("scroll", function (e) {
  let top = e.target.scrollTop;
  let left = e.target.scrollLeft;

  topRow.style.top = top + "px";
  leftCol.style.left = left + "px";
  topLeftCell.style.top = top + "px";
  topLeftCell.style.left = left + "px";
});

// global
// done to know which cell is active
let rowId;
let colId;
let lastSelectedCell;

// if cell is clicked show address and formula of that cell (applied to cells div instead of applying it to each cell)
cells.addEventListener("click", function (e) {
  let currentCell = e.target;
  rowId = Number(currentCell.getAttribute("rowid"));
  colId = Number(currentCell.getAttribute("colid"));
  let address = String.fromCharCode(65 + colId) + (rowId + 1) + "";
  let cellObject = db[rowId][colId];
  // console.log(address);
  addressInput.value = address;
  formulaInput.value = cellObject.formula;

  setMenu(cellObject); 
});

// if focus is gone then set value in db
for (let i = 0; i < allCells.length; i++) {
  allCells[i].addEventListener("blur", function (e) {
    let currentElement = e.target;
    lastSelectedCell = currentElement;
    let value = currentElement.textContent;
    let cellObject = db[rowId][colId];

    // value to value and formula to value edge case handled

    if (value != cellObject.value) {
      if (cellObject.formula) {
        deleteFormula(cellObject);
      }

      cellObject.value = value;
      // console.log(db);
      updateChildrens(cellObject);
    }
  });

  allCells[i].addEventListener("keyup", function (e) {
    // getBoundingClientRect() function find width, height of an element
    let { height } = e.target.getBoundingClientRect();
    let rowId = e.target.getAttribute("rowid");
    let leftColCell = document.querySelector(`div[cell-id="${rowId}"]`);
    leftColCell.style.height = height + "px";
  });
}

// for formula
formulaInput.addEventListener("blur", function (e) {
  let formula = formulaInput.value;

  // value to formula and formula to formula edge cases handled

  if (formula && lastSelectedCell) {
    let cellObject = db[rowId][colId];

    if (cellObject.formula != formula) {
      if (cellObject.formula) {
        deleteFormula(cellObject);
      }

      let solvedValue = solveFormula(formula, cellObject);
      // set UI
      lastSelectedCell.textContent = solvedValue;
      // set DB
      cellObject.value = solvedValue;
      cellObject.formula = formula;
      // console.log(db);
      updateChildrens(cellObject);
    }
  }
});
