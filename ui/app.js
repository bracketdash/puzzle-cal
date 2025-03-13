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

function loadSolution() {
  const prettyMonth =
    selectedDate.substring(0, 1) + selectedDate.substring(1, 3).toLowerCase();
  showing.innerHTML = `Showing #${selectedIndex + 1} of ${
    solutions[selectedDate].length
  } solutions for ${prettyMonth} ${selectedDate.substring(3)}`;
  // TODO: load the solution
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
