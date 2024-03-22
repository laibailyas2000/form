console.log("script loaded");
function takeVal() {
  if (!validation()) {
    return false;
  }

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

  fetch("http://localhost:1000/formdata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
}

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
    // Loop through the data and add rows to the table
    data.forEach((item, index) => {
      let mytable = `<tr>
          <td scope="col">${index + 1}</td>
          <td scope="col">${item.name}</td>
          <td scope="col">${item.fname}</td>
          <td scope="col">${item.email}</td>
          <td scope="col">${item.phone}</td>
          <td>
          <button class="btn btn-danger delete-btn" onclick="deleteUser('${
            item._id
          }')">Delete</button>
          </td>
          <td>
          <button class="btn btn-secondary" onclick="openUpdateModal('${
            item._id
          }')">Update</button>
        </td>
        
        </tr>`;
      let tbody = document.getElementById("table-body");
      tbody.innerHTML += mytable; // Use innerHTML to append the HTML string
    });
  })
  .catch((error) => {
    console.error("Error:", error);
    // Handle any errors that occurred during the fetch
  });

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

fetch("http://localhost:1000/update", {
  method: "PUT",
  headers: { "content-type": "application/json" },
})
  .then((response) => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error("Network response of update was not ok");
    }
  })
  .then((text) => {
    // Log or process the JSON response data
    console.log(text);
  })
  .catch((error) => {
    console.error("Error: ", error);
  });

function updateUser() {
  // Validation logic here if needed

  // Get updated user data from modal fields
  var name = document.querySelector('#updateForm input[name="name"]').value;
  var fname = document.querySelector('#updateForm input[name="fname"]').value;
  var email = document.querySelector('#updateForm input[name="email"]').value;
  var phone = document.querySelector('#updateForm input[name="phone"]').value;

  var formData = {
    name: name,
    fname: fname,
    email: email,
    phone: phone,
  };

  // Send update request to server
  fetch(`http://localhost:1000/update/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Log or process response
      // Optionally, you can close the modal after successful update
      var myModal = new bootstrap.Modal(document.getElementById("updateModal"));
      myModal.hide();
    })
    .catch((error) => console.error("Error:", error));

  return false; // Prevent form submission
}

// Add this function to handle update button click and populate modal with user data
function openUpdateModal(userId) {
  fetch(`http://localhost:1000/get/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      // Populate modal fields with user data
      document.querySelector('#updateForm input[name="name"]').value =
        user.name;
      document.querySelector('#updateForm input[name="fname"]').value =
        user.fname;
      document.querySelector('#updateForm input[name="email"]').value =
        user.email;
      document.querySelector('#updateForm input[name="phone"]').value =
        user.phone;
      // Show update modal
      var myModal = new bootstrap.Modal(document.getElementById("updateModal"));
      myModal.show();
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
