const students = [];
const gryffindor = [];
const slytherin = [];
const hufflepuff = [];
const ravenclaw = [];
let currentHouse = "all";

console.log("Loading JSON data...");

const aboutButton = document.getElementById("about-button");
const aboutContainer = document.getElementById("about-container");

aboutButton.addEventListener("click", () => {
  if (aboutContainer.firstChild) {
    // If the container already has content, remove it to hide the table
    aboutContainer.innerHTML = "";
  } else {
    // If the container is empty, generate and display the table
    const gryffindorCount = gryffindor.length;
    const slytherinCount = slytherin.length;
    const hufflepuffCount = hufflepuff.length;
    const ravenclawCount = ravenclaw.length;
    const totalStudents = students.length;
    const expelledCount = students.filter((student) => student.expelled).length;
    const displayedCount = totalStudents - expelledCount;

    // Create the table element
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    // Create rows for each information
    const row1 = createTableRow("Gryffindor students:", gryffindorCount);
    const row2 = createTableRow("Slytherin students:", slytherinCount);
    const row3 = createTableRow("Hufflepuff students:", hufflepuffCount);
    const row4 = createTableRow("Ravenclaw students:", ravenclawCount);
    const row5 = createTableRow("Total students:", totalStudents);
    const row6 = createTableRow("Expelled students:", expelledCount);
    const row7 = createTableRow("Displayed students:", displayedCount);

    // Append rows to table body
    tbody.appendChild(row1);
    tbody.appendChild(row2);
    tbody.appendChild(row3);
    tbody.appendChild(row4);
    tbody.appendChild(row5);
    tbody.appendChild(row6);
    tbody.appendChild(row7);

    // Append table body to table
    table.appendChild(tbody);

    // Append table to about container
    aboutContainer.appendChild(table);
  }
});

function updateDisplayedCount() {
  const displayedCount =
    document.querySelectorAll("#students-body tr").length - 1;
  // Update the displayed count in the UI
  // For example:
  document.getElementById("displayed-count").textContent = displayedCount;
}

students.forEach((student) => {
  const expelButton = document.getElementById(`expel-button-${student.id}`);
  if (expelButton) {
    expelButton.addEventListener("click", () => {
      student.expelled = true;
      const expelledRow = document.getElementById(`student-row-${student.id}`);
      if (expelledRow) {
        expelledRow.style.display = "none";
        updateDisplayedCount();
      }
    });
  }
});

// Function to create a table row with two cells
function createTableRow(label, value) {
  const row = document.createElement("tr");
  const labelCell = document.createElement("td");
  const valueCell = document.createElement("td");
  labelCell.textContent = label;
  valueCell.textContent = value;
  row.appendChild(labelCell);
  row.appendChild(valueCell);
  return row;
}

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

let activeStudents = [];
let expelledStudents = [];

function displayStudents() {
  let activeStudents = [];
  let expelledStudents = [];

  if (currentHouse === "all") {
    activeStudents = students.filter((student) => !student.expelled);
    expelledStudents = students.filter((student) => student.expelled);
  } else {
    const houseStudents = getHouseStudents(currentHouse);
    activeStudents = houseStudents.filter((student) => !student.expelled);
    expelledStudents = houseStudents.filter((student) => student.expelled);
  }

  let activeTableBody = document.getElementById("students-body");
  let expelledTableBody = document.getElementById("expelled-table");

  activeTableBody.innerHTML = "";
  expelledTableBody.innerHTML = "";

  activeStudents.forEach((student) => {
    // Assign a random blood status value between 1 and 3
    student.bloodStatus = getBloodStatusLabel();

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
        <td>${student.bloodStatus}</td>
        <td>
          <button class="expel-button">${
            student.expelled ? "Reinstate" : "Expel"
          }</button>
          <span class="expelled-text">${
            student.expelled ? "Expelled" : ""
          }</span>
        </td>
      `;
    activeTableBody.appendChild(row);

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

    // Add click event listener to expel/reinstate button
    const expelButton = row.querySelector(".expel-button");
    const expelledText = row.querySelector(".expelled-text");
    expelButton.addEventListener("click", () => {
      student.expelled = !student.expelled;
      if (student.expelled) {
        expelledText.textContent = "Expelled";
        expelButton.textContent = "Reinstate";
        expelledStudents.push(student);
        activeStudents = activeStudents.filter((s) => s !== student);
      } else {
        expelledText.textContent = "";
        expelButton.textContent = "Expel";
        activeStudents.push(student);
        expelledStudents = expelledStudents.filter((s) => s !== student);
      }
      displayStudents();
      updateDisplayedCount();
      toggleExpelledTableVisibility(); // Add this line
    });
  });

  expelledStudents.forEach((student) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.fullname}</td>
        <td>${student.gender}</td>
        <td>${student.house}</td>
        <td>${student.bloodStatus}</td>
      `;
    expelledTableBody.appendChild(row);
  });

  // Add click event listeners to star icons
  let starIcons = document.querySelectorAll(".star-icon");
  starIcons.forEach((star) => {
    star.addEventListener("click", () => {
      let parentRow = star.closest("tr");
      let index = Array.from(parentRow.parentNode.children).indexOf(parentRow);
      let student = activeStudents[index];
      student.star = !student.star;
      star.textContent = student.star ? "⭐" : "☆";
    });
  });
}

function toggleExpelledTableVisibility() {
  const expelledContainer = document.getElementById("expelled-container");

  if (expelledContainer.style.display === "none") {
    expelledContainer.style.display = "block";
  } else {
    expelledContainer.style.display = "none";
  }
}

// Add event listener to the "Expelled Students" button
const expelledButton = document.getElementById("expelled-button");
expelledButton.addEventListener("click", toggleExpelledTableVisibility);
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
      <td data-field="squad" class="cup-icon ${student.squad ? "winner" : ""}">
        ${student.squad ? "🏆 Now on the squad" : "🏆"}
      </td>
      <td data-field="star" class="star-icon ${student.star ? "active" : ""}">
        ${student.star ? "⭐" : "☆"}
      </td>
      <td>${student.fullname}</td>
      <td>${student.gender}</td>
      <td>${student.house}</td>
      <td>${student.bloodStatus}</td>
      <td>
        <button class="expel-button">${
          student.expelled ? "Reinstate" : "Expel"
        }</button>
        <span class="expelled-text">${student.expelled ? "Expelled" : ""}</span>
      </td>
    `;
    tableBody.appendChild(row);

    // Add click event listener to cup icon
    const cupIcon = row.querySelector(".cup-icon");
    cupIcon.addEventListener("click", () => {
      student.squad = !student.squad;
      cupIcon.classList.toggle("winner");
      cupIcon.textContent = student.squad ? "🏆 Now on the Squad" : "🏆";
    });

    // Add click event listener to expel/reinstate button
    const expelButton = row.querySelector(".expel-button");
    const expelledText = row.querySelector(".expelled-text");
    expelButton.addEventListener("click", () => {
      student.expelled = !student.expelled;
      if (student.expelled) {
        expelledText.textContent = "Expelled";
        expelButton.textContent = "Reinstate";
      } else {
        expelledText.textContent = "";
        expelButton.textContent = "Expel";
      }
    });

    // Add click event listener to star icon
    const starIcon = row.querySelector(".star-icon");
    starIcon.addEventListener("click", () => {
      student.star = !student.star;
      starIcon.textContent = student.star ? "⭐" : "☆";
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
}
