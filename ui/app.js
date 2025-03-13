const squares = document.querySelectorAll(".row > div");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const showing = document.querySelector(".showing");

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function getToday() {
  const todayDate = new Date();
  return months[todayDate.getMonth()] + todayDate.getDate();
}

let selectedDate = getToday();
let selectedIndex = 0;

function getShowingText(total) {
  const monthFirstLetter = selectedDate.substring(0, 1);
  const monthRemaining = selectedDate.substring(1, 3).toLowerCase();
  const prettyMonth = monthFirstLetter + monthRemaining;
  const prettyDate = prettyMonth + " " + selectedDate.substring(3);
  const whichOutOf = `${selectedIndex + 1} of ${total}`;
  return `Showing #${whichOutOf} solutions for ${prettyDate}`;
}

const rowStops = [6, 12, 19, 26, 33, 40, 43];

function renderSolution() {
  const dateSolutions = solutions[selectedDate];
  const solution = dateSolutions[selectedIndex];
  showing.innerHTML = getShowingText(dateSolutions.length);
  for (let i = 0; i < 43; i++) {
    const square = squares[i];
    let row = 0;
    let col = i;
    rowStops.some((stop) => {
      if (i >= stop) {
        row++;
        col = i - stop;
      } else {
        return true;
      }
    });
    square.className = "";
    if (solution[i] !== "O") {
      square.classList.add("covered");
    }
    if (
      row > 0 &&
      i !== 18 &&
      ((row !== 2 &&
        solution[i] !== solution[i - (rowStops[row] - rowStops[row - 1])]) ||
        (row === 2 && solution[i] !== solution[i - 6]))
    ) {
      square.classList.add("top");
    }
    if (
      !(col === 5 || col === rowStops[row] - rowStops[row - 1] - 1) &&
      solution[i] !== solution[i + 1]
    ) {
      square.classList.add("right");
    }
    if (
      i < 37 &&
      ((row > 0 &&
        solution[i] !== solution[i + (rowStops[row] - rowStops[row - 1])]) ||
        (i < 6 && solution[i] !== solution[i + 6]))
    ) {
      square.classList.add("bottom");
    }
    if (col > 0 && solution[i] !== solution[i - 1]) {
      square.classList.add("left");
    }
  }
}

function handleClickSquare({ target }) {
  const text = target.innerHTML;
  let newDate = selectedDate;
  if (months.includes(text)) {
    newDate = text + newDate.substring(3);
  } else {
    newDate = newDate.substring(0, 3) + text;
  }
  if (newDate !== selectedDate && solutions[newDate]) {
    selectedDate = newDate;
    selectedIndex = 0;
    renderSolution();
  }
}

function handleClickNav(direction) {
  const newIndex = selectedIndex + direction;
  const max = solutions[selectedDate].length - 1;
  if (newIndex > max) {
    selectedIndex = 0;
  } else if (newIndex < 0) {
    selectedIndex = max;
  } else {
    selectedIndex = newIndex;
  }
  renderSolution();
}

squares.forEach((square) => {
  square.addEventListener("click", handleClickSquare);
});

prevButton.addEventListener("click", () => handleClickNav(-1));
nextButton.addEventListener("click", () => handleClickNav(1));

renderSolution();
