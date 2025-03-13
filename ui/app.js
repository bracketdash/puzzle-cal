const addButtons = document.querySelectorAll(".add-button");

const controlFunctions = {
  increase: ({ target }) => {
    const span = target.parentNode.querySelector("span");
    const newValue = parseInt(span.innerHTML, 10) + 1;
    if (newValue === 6) {
      target.classList.add("hidden");
    } else if (newValue === 2) {
      target.parentNode.querySelector(".decrease").classList.remove("hidden");
    }
    if (newValue < 7) {
      span.innerHTML = newValue;
    }
  },
  decrease: ({ target }) => {
    const span = target.parentNode.querySelector("span");
    const newValue = parseInt(span.innerHTML, 10) - 1;
    if (newValue === 1) {
      target.classList.add("hidden");
    } else if (newValue === 5) {
      target.parentNode.querySelector(".increase").classList.remove("hidden");
    }
    if (newValue > 0) {
      span.innerHTML = newValue;
    }
  },
  remove: ({ target }) => {
    target.parentNode.classList.add("removing");
    setTimeout(() => {
      target.parentNode.remove();
    }, 400);
  },
};

function registerControl(row, control) {
  row.querySelectorAll(`.${control}`).forEach((el) => {
    el.addEventListener("click", controlFunctions[control]);
  });
}

function handleClickAddButton({ target }) {
  const row = target.closest(".row");
  const randomValue = Math.floor(Math.random() * 6) + 1;
  row.querySelector(".dice").innerHTML += `
    <div>
      <span>${randomValue}</span>
      <div class="increase${randomValue > 5 ? " hidden" : ""}">+</div>
      <div class="remove">x</div>
      <div class="decrease${randomValue < 2 ? " hidden" : ""}">-</div>
    </div>
  `;
  registerControl(row, "increase");
  registerControl(row, "decrease");
  registerControl(row, "remove");
}

addButtons.forEach((addButton) => {
  addButton.addEventListener("click", handleClickAddButton);
});
