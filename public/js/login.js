document.addEventListener("DOMContentLoaded", function () {
  const loginForms = document.querySelectorAll("#login-form");
  const signupForms = document.querySelectorAll("#signup-form");

  // Event listeners for signup forms
  signupForms.forEach(function (form) {
    const signupBtn = form.querySelector("#signup-btn");
    //const loginBtn = form.querySelector("#login-btn");

    //signup btn
    signupBtn.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default action

      const currentPage =
        "file:///C:/Users/Blue%20Star%20Computer/Desktop/laiba/myFORM/public/html/signup.html"
          .split("/")
          .pop();

      if (currentPage === "login.html") {
        window.location.href = "signup.html";
      } else if (currentPage === "signup.html" && signupValidation()) {
        signupSubmission(event);
      }
    });
  });

  // Event listeners for login forms
  loginForms.forEach(function (form) {
    const signupBtn = form.querySelector("#signup-btn");
    const loginBtn = form.querySelector("#login-btn");

    //login btn
    loginBtn.addEventListener("click", function (event) {
      event.preventDefault();
      const currentPage =
        "file:///C:/Users/Blue%20Star%20Computer/Desktop/laiba/myFORM/public/html/login.html"
          .split("/")
          .pop();
      if (currentPage === "signup.html") {
        window.location.href = "login.html";
      } else if (currentPage === "login.html") {
        loginSubmission(event);
      }
    });
  });
});

function loginSubmission(event) {
  event.preventDefault();
  const email = document.querySelector('input[name="email"]').value.trim();
  const password = document.querySelector("input[name=psw]").value;

  const loginData = {
    email: email,
    password: password,
  };

  fetchLoginData(loginData);
}

function fetchLoginData(loginData) {
  fetch("http://localhost:1000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (response.status === 401) {
        window.alert("User not found");
      } else if (!response.ok) {
        console.log("erver side error");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data from the login server: ", data.message);

      if (data.message === "Login successful") {
        {
          const userData = {
            user: data.user,
            token: data.token,
          };
          console.log("User logged in : ", userData.user);
          console.log("With a token of :", userData.token);
        }
        // Navigate to another page upon successful login
        //window.location.href =
        //        "file:///C:/Users/Blue%20Star%20Computer/Desktop/laiba/myFORM/public/html/form.html";
      }
      return data;
    })
    .catch((error) => {
      console.error("Fetch error: ", error);
    });
}

function signupValidation() {
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

function signupSubmission(event) {
  event.preventDefault(); // Prevent default form submission

  if (!signupValidation()) {
    console.log("Form validation failed");
    return; // Exit function if validation fails
  }

  const uname = document.querySelector('input[name="uname"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const password = document.querySelector('input[name="psw"]').value;

  const signupData = {
    uname: uname,
    email: email,
    password: password,
  };
  fetchSignupData(signupData);
}

function fetchSignupData(signupData) {
  fetch("http://localhost:1000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupData),
  })
    .then((response) => {
      if (response.status === 400) {
        window.alert("Email already exists");
      } else if (!response.ok) {
        console.log("Server side error");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data from server:", data.message);

      return data;
    })
    .then((data) => {
      console.log("data inserted through signup:", data.result);

      if (data.message === "signup data inserted successfully") {
        console.log("signup successful");
        window.alert("signup successful");
      } else {
        console.error("signup failed"); // Log the error message
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
