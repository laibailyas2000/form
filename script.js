//This event listener is triggered when the DOM content is fully loaded. It ensures that the script
// inside the function is executed only when the DOM is ready.
document.addEventListener("DOMContentLoaded", function () {
  //This adds an event listener to the form with the ID "myForm" for the submit event. When the form
  //is submitted, the function inside will be executed.
  document.getElementById("myform").addEventListener("submit", takeVal);
});

console.log("script loaded");

//This is the function that handles form submission. It first prevents the default form submission
//behavior using event.preventDefault(), then gathers form data and sends it to the server.
function takeVal(event) {
  event.preventDefault(); // Prevent default form submission behavior
  if (validation()) {
    //These lines retrieve the input values from the form fields using the querySelector method and store them in variables

    console.log("takeval loaded");

    var name = document.querySelector('input[name="name"]').value;
    var fname = document.querySelector('input[name="fname"]').value;
    var email = document.querySelector('input[name="email"]').value;
    var phone = document.querySelector('input[name="phone"]').value;

    var formData = {
      name: name,
      fname: fname,
      email: email,
      phone: phone,
    };
    console.log("data formed");
    postData(formData);
  }

  //post method
  function postData(formData) {
    fetch("http://localhost:1000/formdata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  }
}
function updateTable() {
  fetch("http://localhost:1000/get", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      console.log("response received");
      // Handle the response here
      if (response.ok) {
        return response.json(); // Parse the JSON in the response
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((data) => {
      console.log("Data received from server:");
      displayTableData(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle any errors that occurred during the fetch
    });
}

function displayTableData(data) {
  // Get the table body element
  let tbody = document.getElementById("table-body");
  // Clear existing rows in the table
  tbody.innerHTML = "";

  // Iterate through the data and update the table
  data.forEach((item, index) => {
    let mytable = `<tr>
    <td scope="col">${index + 1}</td>
      <td scope="col"><span id="name-${index}">${item.name}</span></td>
      <td scope="col"><span id="fname-${index}">${item.fname}</td>
      <td scope="col"><span id="email-${index}">${item.email}</span></td>
      <td scope="col"><span id="phone-${index}">${item.phone}</span></td>
      <td>
        <button class="btn btn-danger delete-btn" onclick="deleteUser('${
          item._id
        }')">
          <i class="fa fa-trash" aria-hidden="true"></i></button>

        <button type="button" class="btn btn-danger" onclick="updateUserInCell('${
          item._id
        }', ${index})">
        <i class="fas fa-edit"></i></button>

        

     <button type="button" class="btn btn-danger" onclick="saveChanges('${
       item._id
     }', ${index})">
      <i class="fa fa-check-circle" aria-hidden="true"></i></button>
      </td>
      </tr>`;
    let tbody = document.getElementById("table-body");
    tbody.innerHTML += mytable; // Use innerHTML to append the HTML string
  });
}

document.addEventListener("DOMContentLoaded", updateTable);

async function deleteUser(userId) {
  fetch(`http://localhost:1000/delete/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      // Check if the response is successful
      if (response.ok) {
        location.reload();
        return response.text(); // Parse the JSON in the response
      } else {
        throw new Error("Network response of delete was not ok");
      }
    })
    .then((data) => {
      // Log or process the JSON response data
      console.log(data);
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

// This function makes a table cell editable by setting its contentEditable attribute to true
function makeEditable(element) {
  element.contentEditable = true;
  element.focus();
}
// This function makes the table cells editable to update user data directly in the table cell.
function updateUserInCell(id, index, formData) {
  // Get the table cell elements for name, email, and phone
  const nameCell = document.getElementById(`name-${index}`);
  const emailCell = document.getElementById(`email-${index}`);
  const phoneCell = document.getElementById(`phone-${index}`);
  // Make table cells editable
  makeEditable(nameCell);
  makeEditable(emailCell);
  makeEditable(phoneCell);
}
//This function saves the changes made to user data directly in the table cell by sending a PUT request
//to the server.
function saveChanges(userId, index) {
  // Get the updated values from the table cell
  const name = document.getElementById(`name-${index}`).textContent.trim();
  const email = document.getElementById(`email-${index}`).textContent.trim();
  const phone = document.getElementById(`phone-${index}`).textContent.trim();
  // Construct an object with the updated data
  const updatedData = {
    name: name,
    email: email,
    phone: phone,
  };

  // Send update request to server
  fetch(`http://localhost:1000/update/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data successfully UPDATED : ", data);
    })
    .catch((error) => console.error("Error:", error));
}

//validation function
function validation() {
  console.log("validation called");
  // Take variables for each input element
  var nameInput = document.querySelector('input[name="name"]');
  var name = nameInput.value.trim();

  var fnameInput = document.querySelector('input[name="fname"]');
  var fname = fnameInput.value.trim();

  var emailInput = document.querySelector('input[name="email"]');
  var email = emailInput.value.trim();

  var phoneInput = document.querySelector('input[name="phone"]');
  var phone = phoneInput.value.trim();

  var isValid = true; // Assume form is valid by default

  // Validate name field

  if (!name) {
    nameInput.classList.remove("is-valid");
    nameInput.classList.add("is-invalid");
    document.getElementById("name-validation").innerText =
      "Name field is required";
    isValid = false; // Set isValid to false if validation fails
  } else if (name.length < 5) {
    nameInput.classList.remove("is-valid");
    nameInput.classList.add("is-invalid");
    document.getElementById("name-validation").innerText =
      "Name must be at least 5 characters";
    isValid = false; // Set isValid to false if validation fails
  } else if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    nameInput.classList.remove("is-valid");
    nameInput.classList.add("is-invalid");
    document.getElementById("name-validation").innerText =
      "Name must not contain special characters";
    isValid = false; // Set isValid to false if validation fails
  } else {
    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");
    document.getElementById("name-validation").innerText = "";
  }

  // Validate fname field
  if (!fname) {
    fnameInput.classList.remove("is-valid");
    fnameInput.classList.add("is-invalid");
    document.getElementById("fname-validation").innerText =
      "Father name field is required";
    isValid = false; // Set isValid to false if validation fails
  } else if (fname.length < 5) {
    fnameInput.classList.remove("is-valid");
    fnameInput.classList.add("is-invalid");
    document.getElementById("fname-validation").innerText =
      "Father Name must be at least 5 characters";
    isValid = false; // Set isValid to false if validation fails
  } else if (!/^[a-zA-Z0-9 ]+$/.test(fname)) {
    fnameInput.classList.remove("is-valid");
    fnameInput.classList.add("is-invalid");
    document.getElementById("fname-validation").innerText =
      " Father Name must not contain special characters";
    isValid = false; // Set isValid to false if validation fails
  } else {
    fnameInput.classList.remove("is-invalid");
    fnameInput.classList.add("is-valid");
    document.getElementById("fname-validation").innerText = "";
  }

  // Validate email field
  if (!email) {
    emailInput.classList.remove("is-valid");
    emailInput.classList.add("is-invalid");
    document.getElementById("email-validation").innerText =
      "Email field is required";
    isValid = false; // Set isValid to false if validation fails
  } else {
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");
    document.getElementById("email-validation").innerText = "";
  }

  // Validate phone field
  if (!phone) {
    phoneInput.classList.remove("is-valid");
    phoneInput.classList.add("is-invalid");
    document.getElementById("phone-validation").innerText =
      "Phone number is required";
    isValid = false; // Set isValid to false if validation fails
  } else {
    phoneInput.classList.remove("is-invalid");
    phoneInput.classList.add("is-valid");
    document.getElementById("phone-validation").innerText = "";
  }

  return isValid; // Return isValid to indicate overall form validity
}
