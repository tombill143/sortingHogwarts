const students = [];
const gryffindor = [];
const slytherin = [];
const hufflepuff = [];
const ravenclaw = [];
let currentHouse = "all";

console.log("Loading JSON data...");

fetch("hogwarts.json")
  .then((response) => response.json())
  .then((data) => {
    students.push(...data);
    sortStudents("fullname");
    displayStudents();
  })
  .catch((error) => {
    console.error("Error fetching student data:", error);
  });

function displayStudents() {
  let studentList = [];

  if (currentHouse === "all") {
    studentList = students;
  } else {
    switch (currentHouse) {
      case "gryffindor":
        studentList = gryffindor;
        break;
      case "slytherin":
        studentList = slytherin;
        break;
      case "hufflepuff":
        studentList = hufflepuff;
        break;
      case "ravenclaw":
        studentList = ravenclaw;
        break;
    }
  }

  let tableBody = document.getElementById("students-body");
  tableBody.innerHTML = "";

  studentList.forEach((student) => {
    // Assign a random blood status value between 1 and 3
    student.bloodStatus = getBloodStatusLabel();

    let row = document.createElement("tr");
    row.innerHTML = `
          <td data-field="squad" class="cup-icon ${
            student.squad ? "winner" : ""
          }">
            ${student.squad ? "🏆 Now on the squad" : "🏆"}
          </td>
          <td data-field="star" class="star-icon ${
            student.star ? "active" : ""
          }">
            ${student.star ? "⭐" : "☆"}
          </td>
          <td>${student.fullname}</td>
          <td>${student.gender}</td>
          <td>${student.house}</td>
          <td>${student.bloodStatus}</td>
          <td>${student.expelled}</td>
        `;
    tableBody.appendChild(row);

    // Add click event listener to row
    row.addEventListener("click", () => {
      showStudentPopup(student);
    });

    // Add click event listener to cup icon
    const cupIcon = row.querySelector(".cup-icon");
    cupIcon.addEventListener("click", () => {
      student.squad = !student.squad;
      cupIcon.classList.toggle("winner");
      cupIcon.textContent = student.squad ? "🏆 Now on the Squad" : "🏆";
    });
  });

  // Add click event listeners to star icons
  let starIcons = document.querySelectorAll(".star-icon");
  starIcons.forEach((star) => {
    star.addEventListener("click", () => {
      let parentRow = star.closest("tr");
      let index = Array.from(parentRow.parentNode.children).indexOf(parentRow);
      let student = studentList[index];
      student.star = !student.star;
      star.textContent = student.star ? "⭐" : "☆";
    });
  });
}

function getBloodStatusLabel() {
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  switch (randomNumber) {
    case 1:
      return "Pure Blood";
    case 2:
      return "Half Blood";
    case 3:
      return "Muggle";
    default:
      return "Unknown";
  }
}

function sortStudents(property) {
  students.sort((a, b) => a[property].localeCompare(b[property]));

  gryffindor.length = 0;
  slytherin.length = 0;
  hufflepuff.length = 0;
  ravenclaw.length = 0;

  students.forEach((student) => {
    switch (student.house.toLowerCase()) {
      case "gryffindor":
        gryffindor.push(student);
        break;
      case "slytherin":
        slytherin.push(student);
        break;
      case "hufflepuff":
        hufflepuff.push(student);
        break;
      case "ravenclaw":
        ravenclaw.push(student);
        break;
    }
  });

  // If there are filtered students, re-filter them
  let filteredStudents = [];
  if (currentHouse === "all") {
    filteredStudents = students;
  } else {
    filteredStudents = students.filter(
      (student) => student.house.toLowerCase() === currentHouse
    );
  }

  if (filteredStudents.length > 0) {
    displayFilteredStudents(filteredStudents);
  } else {
    displayStudents();
  }
}

document.getElementById("option").addEventListener("change", (event) => {
  currentHouse = event.target.value;
  sortStudents("fullname");
});

document.getElementById("search").addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredStudents = students.filter((student) =>
    student.fullname.toLowerCase().includes(searchTerm)
  );
  currentHouse = "all";
  displayFilteredStudents(filteredStudents);
});

function displayFilteredStudents(filteredStudents) {
  let tableBody = document.getElementById("students-body");
  tableBody.innerHTML = "";

  filteredStudents.forEach((student) => {
    // Set default values for winner and star properties
    if (student.squad === undefined) {
      student.squad = false;
    }
    if (student.star === undefined) {
      student.star = false;
    }

    let row = document.createElement("tr");
    row.innerHTML = `
          <td data-field="squad" class="cup-icon">${
            student.squad ? "🏆 Now on the squad" : "🏆"
          }</td>
          <td data-field="star" class="star-icon">${
            student.star ? "⭐" : "☆"
          }</td>
          <td>${student.fullname}</td>
          <td>${student.gender}</td>
          <td>${student.house}</td>
          <td>${student.bloodStatus}</td>
          <td>${student.expelled}</td>
        `;
    tableBody.appendChild(row);
  });

  // Add click event listeners to star icons
  let starIcons = document.querySelectorAll(".star-icon");
  starIcons.forEach((star) => {
    star.addEventListener("click", () => {
      let parentRow = star.closest("tr");
      let index = Array.from(parentRow.parentNode.children).indexOf(parentRow);
      let student = filteredStudents[index];
      student.star = !student.star;
      star.textContent = student.star ? "⭐" : "☆";
    });
  });

  // Add click event listeners to cup icons
  let cupIcons = document.querySelectorAll(".cup-icon");
  cupIcons.forEach((cup) => {
    cup.addEventListener("click", () => {
      let parentRow = cup.closest("tr");
      let index = Array.from(parentRow.parentNode.children).indexOf(parentRow);
      let student = filteredStudents[index];
      student.squad = !student.squad;
      cup.textContent = student.squad ? "🏆 Now on the squad" : "🏆";
    });
  });
  function displayStudents() {
    let studentList = [];

    if (currentHouse === "all") {
      studentList = students;
    } else {
      switch (currentHouse) {
        case "gryffindor":
          studentList = gryffindor;
          break;
        case "slytherin":
          studentList = slytherin;
          break;
        case "hufflepuff":
          studentList = hufflepuff;
          break;
        case "ravenclaw":
          studentList = ravenclaw;
          break;
      }
    }

    let tableBody = document.getElementById("students-body");
    tableBody.innerHTML = "";

    studentList.forEach((student) => {
      let row = document.createElement("tr");
      row.innerHTML = `
          <td data-field="squad" class="cup-icon ${
            student.squad ? "winner" : ""
          }">
            ${student.squad ? "🏆 Now on the squad" : "🏆"}
          </td>
          <td data-field="star" class="star-icon ${
            student.star ? "active" : ""
          }">
            ${student.star ? "⭐" : "☆"}
          </td>
          <td>${student.fullname}</td>
          <td>${student.gender}</td>
          <td>${student.house}</td>
          <td>${student.bloodStatus}</td>
        `;
      tableBody.appendChild(row);

      // Add click event listener to row
      row.addEventListener("click", () => {
        showStudentPopup(student);
      });

      // Add click event listener to cup icon
      const cupIcon = row.querySelector(".cup-icon");
      cupIcon.addEventListener("click", () => {
        student.squad = !student.squad;
        cupIcon.classList.toggle("winner");
        cupIcon.textContent = student.squad ? "🏆 Now on the Squad" : "🏆";
      });
    });

    // Add click event listeners to star icons
    let starIcons = document.querySelectorAll(".star-icon");
    starIcons.forEach((star) => {
      star.addEventListener("click", () => {
        let parentRow = star.closest("tr");
        let index = Array.from(parentRow.parentNode.children).indexOf(
          parentRow
        );
        let student = studentList[index];
        student.star = !student.star;
        star.textContent = student.star ? "⭐" : "☆";
      });
    });
  }

  /*   function showStudentPopup(student) {
    // Get the popup element
    const popup = document.getElementById("student-popup");

    // Get the elements for displaying the student details
    const firstNameElement = popup.querySelector(".first-name");
    const middleNameElement = popup.querySelector(".middle-name");
    const nickNameElement = popup.querySelector(".nick-name");
    const lastNameElement = popup.querySelector(".last-name");
    const photoElement = popup.querySelector(".photo");
    const crestElement = popup.querySelector(".crest");
    const bloodStatusElement = popup.querySelector(".blood-status");
    const prefectElement = popup.querySelector(".prefect");
    const expelledElement = popup.querySelector(".expelled");
    const inquisitorialElement = popup.querySelector(".inquisitorial");

    // Set the values of the student details elements
    firstNameElement.textContent = student.firstName;
    middleNameElement.textContent = student.middleName
      ? student.middleName
      : "";
    nickNameElement.textContent = student.nickName
      ? `(${student.nickName})`
      : "";
    lastNameElement.textContent = student.lastName;
    photoElement.src = student.photo
      ? student.photo
      : "images/default-photo.png";
    crestElement.src = student.crest
      ? student.crest
      : "images/default-crest.png";
    crestElement.style.backgroundColor = student.houseColor;
    bloodStatusElement.textContent = student.bloodStatus;
    prefectElement.textContent = student.prefect ? "Yes" : "No";
    expelledElement.textContent = student.expelled ? "Yes" : "No";
    inquisitorialElement.textContent = student.inquisitorial ? "Yes" : "No";

    // Show the popup
    popup.classList.add("show");
  } */
}
