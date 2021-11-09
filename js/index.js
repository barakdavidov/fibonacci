const userInput = document.getElementById("userInput");
const answer = document.getElementById("answer");
const submit = document.getElementById("submit");
const loader = document.getElementById("loader");
const resultLoader = document.getElementById("result-loader");
const renderResults = document.getElementById("results");
const saveCalculation = document.getElementById("saveCalculation");
const errorMsg = document.getElementById("error-msg");
const sortBy = document.getElementById("sortBy");

let resultData;
const sortByNumberAsc = document.getElementById("sortByNumberAsc");
const sortByNumberDesc = document.getElementById("sortByNumberDesc");
const sortByDateAsc = document.getElementById("sortByDateAsc");
const sortByDateDesc = document.getElementById("sortByDateDesc");

const BASE_URL = "http://localhost:5050";

//Fastest function
function fibonacci(n, a = 0, b = 1) {
  if (n == 0) return a;
  if (n == 1) return b;
  return fibonacci(n - 1, b, a + b);
}

/* This function was not as fast as I expected
function fibonacci(num, memo) {
  // Assigns an empty object if a value wasn't provided for memo
  // Memo keeps track of the answers for each number so they aren't called recursively twice
  memo = memo || {};

  if (memo[num]) return memo[num];
  if (num === 0) return 0;
  if (num <= 2) return 1;
  return (memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo));
}

function fib(n, a = 0, b = 1) {
  if (n == 0) return a;
  if (n == 1) return b;

  return fib(n - 1, b, a + b);
}

function testSpeed(func) {
  let start = new Date();

  for (let i = 0; i <= 5000; i++) {
    func(i);
  }

  let end = new Date();

  return end - start;
}
*/

async function request(endpoint) {
  // This first version is just letting the error as it is, so the message is "err.message"
  /*
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  if (res.status === 400) {
    const errText = await res.text();
    throw new Error(errText);
  }
  const data = await res.json();
  return data;
  */

  // This version with a catch is making a new error from the previous one, so it says "Error: err.message"
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    if (res.status === 400) {
      const errText = await res.text();
      throw new Error(errText);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
}

function displayErrorMsg(message) {
  errorMsg.classList.add("alert-danger");
  errorMsg.innerHTML = message;
  userInput.classList.add("border-danger");
  userInput.classList.add("text-danger");
}

function clearErrorMsg() {
  errorMsg.innerHTML = "";
  userInput.classList.remove("text-danger");
  userInput.classList.remove("border-danger");
  errorMsg.classList.remove("alert-danger");
  answer.classList.remove("text-danger");
}

function buildResultOutput(data) {
  // clear the results
  renderResults.removeChild(renderResults.lastChild);

  let resultList = "";

  data.forEach((el) => {
    resultList += `<div class="border-bottom py-2 border-secondary">The Fibonacci Of <strong>${
      el.number
    }</strong> is <strong>${el.result}</strong>. Calculated at: ${new Date(
      el.createdDate
    ).toString()}</div>`;
  });

  const render = document.createElement("div");
  render.innerHTML = resultList;
  renderResults.appendChild(render);
}

async function getFibonacciResults() {
  // Display loading
  resultLoader.classList.add("spinner-border");

  const { results } = await request("getFibonacciResults");
  // Set result data
  resultData = results;

  if (results && results.length > 0) {
    // Display sortBy
    sortBy.style.visibility = "visible";
  }
  //Pre-sort the results
  results.sort((a, b) => a.number - b.number);

  buildResultOutput(results);

  // Remove loader
  resultLoader.classList.remove("spinner-border");
}

// Sort By Number Asc
sortByNumberAsc.addEventListener("click", () => {
  resultData.sort((a, b) => a.number - b.number);
  // Display the sorted data
  buildResultOutput(resultData);
});
// Sort By Number Desc
sortByNumberDesc.addEventListener("click", () => {
  resultData.sort((a, b) => b.number - a.number);
  // Display sorted data
  buildResultOutput(resultData);
});
// Sort By Date Asc
sortByDateAsc.addEventListener("click", () => {
  resultData.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
  // Display sorted data
  buildResultOutput(resultData);
});
// Sort By Date Desc
sortByDateDesc.addEventListener("click", () => {
  resultData.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  // Display the sorted data
  buildResultOutput(resultData);
});
getFibonacciResults();
