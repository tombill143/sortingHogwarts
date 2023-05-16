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
    let row = document.createElement("tr");
    row.innerHTML = `
        <td data-field="squad" class="cup-icon ${
          student.squad ? "winner" : ""
        }">
          ${student.squad ? "🏆 Now on the squad" : "🏆"}
        </td>
        <td data-field="star" class="star-icon ${student.star ? "active" : ""}">
          ${student.star ? "⭐" : "☆"}
        </td>
        <td>${student.fullname}</td>
        <td>${student.gender}</td>
        <td>${student.house}</td>
      `;
    tableBody.appendChild(row);

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
}
