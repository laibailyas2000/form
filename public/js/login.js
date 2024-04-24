function loginValidation() {
  var userInput = document.querySelector('input[name="uname"]');
  var uname = userInput.value.trim();
  var isValid = true;

  if (uname.length < 5) {
    userInput.classList.remove("is-valid");
    userInput.classList.add("is-invalid");
    document.getElementById("uname-validation").innerText =
      "Name must be at least 5 characters";
    isValid = false;
  } else {
    userInput.classList.remove("is-invalid");
    userInput.classList.add("is-valid");
    document.getElementById("uname-validation").innerText = "";
  }

  return isValid;
}

function handleFormSubmission(event) {
  event.preventDefault(); // Prevent default form submission

  if (!loginValidation()) {
    console.log("Form validation failed");
    return; // Exit function if validation fails
  }

  const uname = document.querySelector('input[name="uname"]').value.trim();
  const password = document.querySelector('input[name="psw"]').value;

  const loginData = {
    uname: uname,
    password: password,
  };

  fetch("http://localhost:1000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid credentials"); // or parse the response for specific error message
      }
      return response.json(); // Return the response body as JSON
    })
    .then((data) => {
      console.log("Login response:", data.message); // Log the response message
      // console.log("Result:", data.result); // Log the result
      console.log("Inserted data:", data.result); // Log the inserted data

      if (data.message === "Login data inserted successfully") {
        console.log("Login successful");
        // Redirect or perform further actions upon successful login
      } else {
        console.error("Login failed:", data.message); // Log the error message
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

document
  .querySelector(".login-form")
  .addEventListener("submit", handleFormSubmission);
