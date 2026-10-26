const transactionFormEl = document.getElementById("mortgage-calculator");
const mortgageAmountEl = document.getElementById("mortgageAmount");
const clearAllBtn = document.getElementById("clearAll");
const mortgageTermEl = document.getElementById("mortgageTerm");
const interestRateEl = document.getElementById("interestRate");
const mortgageType1 = document.getElementById("mortgageType1");
const mortgageType2 = document.getElementById("mortgageType2");
const emptyResults = document.querySelector(".mortgage-results");
const resultsContainer = document.querySelector(".results-container");
const monthlyAmountEl = document.getElementById("amount");
const totalAmountEl = document.getElementById("total-amount");

transactionFormEl.addEventListener("submit", function (e) {
  e.preventDefault();

  const isRequiredValid = checkRequired([
    mortgageAmountEl,
    mortgageTermEl,
    interestRateEl,
  ]);
  const isRadioValid = checkRadio();

  if (isRequiredValid && isRadioValid) {
    const amount = Number(mortgageAmountEl.value);
    const years = Number(mortgageTermEl.value);
    const rate = Number(interestRateEl.value);
    const type = document.querySelector(
      "input[name=mortgageType]:checked",
    ).value;

    const result = calculate(amount, years, rate, type);
    showResults(result.monthly, result.total);
  }
});

clearAllBtn.addEventListener("click", function () {
  transactionFormEl.reset();

  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("error");
  });

  resultsContainer.classList.add("hidden");
  emptyResults.classList.remove("hidden");
});

function calculate(amount, years, rate, type) {
  const r = rate / 100 / 12;
  const n = years * 12;
  let monthly;

  if (type === "repayment") {
    const factor = Math.pow(1 + r, n);
    monthly = r === 0 ? amount / n : (amount * r * factor) / (factor - 1);
  } else {
    monthly = amount * r;
  }

  return { monthly, total: monthly * n };
}

function showResults(monthly, total) {
  monthlyAmountEl.innerText = formatMoney(monthly);
  totalAmountEl.innerText = formatMoney(total);
  emptyResults.classList.add("hidden");
  resultsContainer.classList.remove("hidden");
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

// [mortgageAmountEl, mortgageTermEl, interestRateEl].forEach((input) => {
//   input.addEventListener("input", () => {
//     checkRequired([input]);
//   });
// });

// document.querySelectorAll('input[name="mortgageType"]').forEach((radio) => {
//   radio.addEventListener("change", checkRadio);
// });

function checkRequired(inputArray) {
  let isValid = true;

  inputArray.forEach((input) => {
    if (input.value.trim() === "" || Number(input.value) <= 0) {
      showError(input, "This field is required");
      isValid = false;
    } else {
      showSuccess(input);
    }
  });

  return isValid;
}

function checkRadio() {
  const type = document.querySelector('input[name="mortgageType"]:checked');
  const group = document.querySelector("fieldset.form-group");
  const small = group.querySelector("small");

  if (!type) {
    group.classList.add("error");
    small.innerText = "This field is required";
    return false;
  }
  group.classList.remove("error");
  return true;
}

function showError(input, message) {
  const formGroup = input.closest(".form-group");
  const small = formGroup.querySelector("small");
  formGroup.classList.add("error");
  small.innerText = message;
}

function showSuccess(input) {
  const formGroup = input.closest(".form-group");
  formGroup.classList.remove("error");
}
