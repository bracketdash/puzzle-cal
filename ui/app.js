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
  const prettyDate = prettyMonth + selectedDate.substring(3);
  const whichOutOf = `${selectedIndex + 1} of ${total}`;
  return `Showing #${whichOutOf} solutions for ${prettyDate}`;
}

const rowStops = [6, 12, 19, 26, 33, 40];

function loadSolution() {
  const dateSolutions = solutions[selectedDate];
  const solution = dateSolutions[selectedIndex];

  showing.innerHTML = getShowingText(dateSolutions.length);

  // TODO: load the solution
  // Example (APR4): solution = "HHHOGGHFHGGGCFFOBBBCFAAADBCFAAADBCCEEDDDEEE"
  for (let i = 0; i < 43; i++) {
    const piece = solution[i];
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
    console.log(`i: ${i}, piece: ${piece}, row: ${row}, col: ${col}`);
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
  if (solutions[newDate]) {
    selectedDate = newDate;
    selectedIndex = 0;
    loadSolution();
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
  loadSolution();
}

squares.forEach((square) => {
  square.addEventListener("click", handleClickSquare);
});

prevButton.addEventListener("click", () => handleClickNav(-1));
nextButton.addEventListener("click", () => handleClickNav(1));

loadSolution();
