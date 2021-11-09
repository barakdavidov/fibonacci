submit.addEventListener("click", async () => {
  if (userInput.value == "") return;
  const number = Number(userInput.value);
  // Reset display
  answer.textContent = "";
  clearErrorMsg();
  // Display loading
  answer.classList.add("spinner-border");
  answer.classList.remove("lead");

  let res;

  // If checkbox is not checked all it's done locally
  if (!saveCalculation.checked) {
    // This if,else if, else block checks if the number is correct, if it's not displays error message
    if (number > 50) {
      displayErrorMsg("Can't be larger than 50");
    } else if (number < 1) {
      displayErrorMsg("Can't be smaller than 1");
      // If we don't get any error the result is calculated locally
    } else {
      res = fibonacci(number);
    }
    answer.classList.remove("spinner-border");
    answer.classList.add("lead");
    // Set the answer on the DOM if there's an answer
    res && (answer.textContent = res);

    // If checkbox is checked then all it's done from the server
  } else {
    try {
      const { result } = await request("fibonacci/" + number);
      res = result;
      // Update results in list
      getFibonacciResults();

      // Remove spinner
      answer.classList.remove("spinner-border");
      answer.classList.add("lead");
      // Set the answer on the DOM
      answer.textContent = res;
    } catch (err) {
      answer.classList.remove("spinner-border");
      answer.classList.add("lead");
      if (number === 42) {
        answer.textContent = err.message;
        answer.classList.add("text-danger");
      } else {
        displayErrorMsg(err.message);
      }
    }
  }
});
