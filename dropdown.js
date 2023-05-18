const students = [];
const gryffindor = [];
const slytherin = [];
const hufflepuff = [];
const ravenclaw = [];
let currentHouse = "all";

console.log("Loading JSON data...");

const aboutButton = document.getElementById("about-button");
const aboutContainer = document.getElementById("about-container");

// Add event listener to the "Expelled Students" button
const expelledButton = document.getElementById("expelled-button");
const expelledContainer = document.getElementById("expelled-table");
let isExpelledVisible = false;

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

expelledButton.addEventListener("click", () => {
  if (!isExpelledVisible) {
    // Show the expelled container
    expelledContainer.style.display = "block";
    // Generate and display the expelled student data
    displayExpelledStudents(); // Define this function to generate and display the expelled student data
    isExpelledVisible = true;
    expelledButton.textContent = "Hide Expelled Students"; // Update button text
  } else {
    // Hide the expelled container
    expelledContainer.style.display = "none";
    // Clear the expelled student data
    clearExpelledStudents(); // Define this function to clear the expelled student data
    isExpelledVisible = false;
    expelledButton.textContent = "Expelled Students"; // Update button text
  }
});

function updateDisplayedCount() {
  const activeCount = document.getElementById("active-count");
  const expelledCount = document.getElementById("expelled-count");

  if (activeCount && expelledCount) {
    const activeStudentsCount = activeStudents.length;
    const expelledStudentsCount = expelledStudents.length;

    activeCount.textContent = activeStudentsCount.toString();
    expelledCount.textContent = expelledStudentsCount.toString();
  }
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

  let filteredActiveStudents = activeStudents.filter(
    (student) => !expelledStudents.includes(student)
  );

  filteredActiveStudents.forEach((student) => {
    // Assign a random blood status value between 1 and 3
    student.bloodStatus = getBloodStatusLabel();

    let row = document.createElement("tr");
    row.innerHTML = `
      <td data-field="squad" class="cup-icon ${student.squad ? "winner" : ""}">
        ${student.squad ? "🏆 Now on the Squad" : "🏆"}
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
    activeTableBody.appendChild(row);

    // Add click event listener to row
    row.addEventListener("click", () => {
      showStudentPopup(student);
    });

    // Add click event listener to cup icon
    const cupIcon = row.querySelector(".cup-icon");
    cupIcon.addEventListener("click", () => {
      const isSlytherin = student.house.toLowerCase() === "slytherin";
      const isPureBlood = student.bloodStatus.toLowerCase() === "pure blood";

      if ((isSlytherin || isPureBlood) && !student.squad) {
        const inquisitorialSquadMembers = filteredActiveStudents.filter(
          (s) =>
            s.squad &&
            (s.house.toLowerCase() === "slytherin" ||
              s.bloodStatus.toLowerCase() === "pure blood")
        );

        if (inquisitorialSquadMembers.length < 12) {
          student.squad = true;
          cupIcon.classList.add("winner");
          cupIcon.textContent = "🏆 Now on the Squad";
        }
      } else {
        student.squad = false;
        cupIcon.classList.remove("winner");
        cupIcon.textContent = "🏆";
      }
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
        activeTableBody.removeChild(row);
        expelledTableBody.appendChild(row);
      } else {
        expelledText.textContent = "";
        expelButton.textContent = "Expel";
        expelledStudents.splice(expelledStudents.indexOf(student), 1);
        activeTableBody.appendChild(row);
        expelledTableBody.removeChild(row);
      }
    });
  });
}

function toggleExpelledTableVisibility() {
  const expelledContainer = document.getElementById("expelled-table");
  if (expelledContainer) {
    expelledContainer.classList.toggle("hidden");
  }
}

function toggleExpelledTableVisibility() {
  const expelledContainer = document.getElementById("expelled-table");

  if (expelledContainer) {
    expelledContainer.classList.toggle("hidden");
  }
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

expelledButton.addEventListener("click", () => {
  if (!isExpelledVisible) {
    // Show the expelled container
    expelledContainer.style.display = "block";
    // Generate and display the expelled student data
    // Your code to generate and display the expelled student data
    isExpelledVisible = true;
    expelledButton.textContent = "Hide Expelled Students"; // Update button text
  } else {
    // Hide the expelled container
    expelledContainer.style.display = "none";
    // Clear the expelled student data
    // Your code to clear the expelled student data
    isExpelledVisible = false;
    expelledButton.textContent = "Expelled Students"; // Update button text
  }
});

function displayFilteredStudents(filteredStudents) {
  let activeTableBody = document.getElementById("students-body");
  let expelledTableBody = document.getElementById("expelled-table");
  activeTableBody.innerHTML = "";
  expelledTableBody.innerHTML = "";

  filteredStudents.forEach((student) => {
    if (student.expelled) {
      let expelledRow = document.createElement("tr");
      expelledRow.innerHTML = `
        <td>${student.fullname}</td>
        <td>${student.gender}</td>
        <td>${student.house}</td>
        <td>${student.bloodStatus}</td>
      `;
      expelledTableBody.appendChild(expelledRow);
    } else {
      let activeRow = document.createElement("tr");
      activeRow.innerHTML = `
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
      activeTableBody.appendChild(activeRow);

      const cupIcon = activeRow.querySelector(".cup-icon");
      cupIcon.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent row click event from firing when cup icon is clicked
        const isSlytherin = student.house.toLowerCase() === "slytherin";
        const isPureBlood = student.bloodStatus.toLowerCase() === "pure blood";

        if ((isSlytherin || isPureBlood) && !student.squad) {
          const inquisitorialSquadMembers = filteredStudents.filter(
            (s) =>
              s.squad &&
              (s.house.toLowerCase() === "slytherin" ||
                s.bloodStatus.toLowerCase() === "pure blood")
          );

          if (inquisitorialSquadMembers.length < 12) {
            student.squad = true;
            cupIcon.classList.add("winner");
            cupIcon.textContent = "🏆 Now on the Squad";
          }
        } else {
          student.squad = false;
          cupIcon.classList.remove("winner");
          cupIcon.textContent = "🏆";
        }
      });

      const expelButton = activeRow.querySelector(".expel-button");
      const expelledText = activeRow.querySelector(".expelled-text");
      expelButton.addEventListener("click", () => {
        student.expelled = !student.expelled;
        if (student.expelled) {
          expelledText.textContent = "Expelled";
          expelButton.textContent = "Reinstate";
          expelledTableBody.appendChild(activeRow);
          activeTableBody.removeChild(activeRow);
        } else {
          expelledText.textContent = "";
          expelButton.textContent = "Expel";
          activeTableBody.appendChild(activeRow);
          expelledTableBody.removeChild(activeRow);
        }
      });
      activeRow.addEventListener("click", () => {
        showStudentPopup(student);
      });

      const starIcon = activeRow.querySelector(".star-icon");
      starIcon.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent row click event from firing when star icon is clicked
        const currentStars = filteredStudents.filter((student) => student.star);
        if (currentStars.length < 2 || student.star) {
          student.star = !student.star;
          starIcon.textContent = student.star ? "⭐" : "☆";
        }
      });
    }
  });
}

function showStudentPopup(student) {
  if (!student.expelled) {
    return; // If the student is not expelled, exit the function and don't show the popup
  }

  const popup = document.getElementById("popup");
  const popupName = document.getElementById("popup-name");
  const popupDetails = document.getElementById("popup-details");

  // Populate the popup with student information
  popupName.textContent = student.fullname;
  popupDetails.textContent = "Has been expelled!";

  // Show the popup
  popup.style.display = "block";

  // Close the popup when the close button is clicked
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });
}
