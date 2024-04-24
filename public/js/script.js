document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("myform").addEventListener("submit", takeVal);
});
console.log("script loaded");

function takeVal(event) {
  //console.log("Event object:", event);
  console.log("takeval loaded");
  event.preventDefault(); // Prevent default form submission behavior
  if (validation()) {
    console.log("validation runned");
    //These lines retrieve the input values from the form fields using the querySelector method and store them in variables

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
    postData(formData);
    //console.log("data formed");
  }
}

//post method
function postData(formData) {
  console.log("post api called");
  fetch("http://localhost:1000/formdata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((data) => {
      location.reload();
      console.log("data is added: ", data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// const testData = {
//   name: "John",
//   fname: "Doe",
//   email: "john@example.com",
//   phone: "1234567890",
// };
// postData(testData);
function updateTable() {
  console.log("get method worked");
  fetch("http://localhost:1000/get", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      console.log("response received");
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((data) => {
      console.log("table received from server");
      displayTableData(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayTableData(data) {
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
    tbody.innerHTML += mytable;
  });
}

document.addEventListener("DOMContentLoaded", updateTable);

async function deleteUser(userId) {
  fetch(`http://localhost:1000/delete/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (response.ok) {
        location.reload();
        return response.text();
      } else {
        throw new Error("Network response of delete was not ok");
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

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
  console.log("update api called");
}

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

  if (!name) {
    nameInput.classList.remove("is-valid");
    nameInput.classList.add("is-invalid");
    document.getElementById("name-validation").innerText =
      "Name field is required";
    isValid = false;
  } else if (name.length < 5) {
    nameInput.classList.remove("is-valid");
    nameInput.classList.add("is-invalid");
    document.getElementById("name-validation").innerText =
      "Name must be at least 5 characters";
    isValid = false;
  } else if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    nameInput.classList.remove("is-valid");
    nameInput.classList.add("is-invalid");
    document.getElementById("name-validation").innerText =
      "Name must not contain special characters";
    isValid = false;
  } else {
    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");
    document.getElementById("name-validation").innerText = "";
  }

  if (!fname) {
    fnameInput.classList.remove("is-valid");
    fnameInput.classList.add("is-invalid");
    document.getElementById("fname-validation").innerText =
      "Father name field is required";
    isValid = false;
  } else if (fname.length < 5) {
    fnameInput.classList.remove("is-valid");
    fnameInput.classList.add("is-invalid");
    document.getElementById("fname-validation").innerText =
      "Father Name must be at least 5 characters";
    isValid = false;
  } else if (!/^[a-zA-Z0-9 ]+$/.test(fname)) {
    fnameInput.classList.remove("is-valid");
    fnameInput.classList.add("is-invalid");
    document.getElementById("fname-validation").innerText =
      " Father Name must not contain special characters";
    isValid = false;
  } else {
    fnameInput.classList.remove("is-invalid");
    fnameInput.classList.add("is-valid");
    document.getElementById("fname-validation").innerText = "";
  }

  if (!email) {
    emailInput.classList.remove("is-valid");
    emailInput.classList.add("is-invalid");
    document.getElementById("email-validation").innerText =
      "Email field is required";
    isValid = false;
  } else {
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");
    document.getElementById("email-validation").innerText = "";
  }

  if (!phone) {
    phoneInput.classList.remove("is-valid");
    phoneInput.classList.add("is-invalid");
    document.getElementById("phone-validation").innerText =
      "Phone number is required";
    isValid = false;
  } else {
    phoneInput.classList.remove("is-invalid");
    phoneInput.classList.add("is-valid");
    document.getElementById("phone-validation").innerText = "";
  }

  return isValid;
}
