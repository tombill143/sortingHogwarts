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

    // Capitalize names
    students.forEach((student) => {
      student.fullname = capitaliseName(student.fullname);
    });

    // Capitalize house
    students.forEach((student) => {
      student.house = capitaliseHouse(student.house);
    });

    /*  // Removes quotation marks
    students.forEach((student) => {
      student.fullname = removeQuotationMarks(student.fullname);
    }); */

    // Removes hyphen from name
    students.forEach((student) => {
      student.fullname = removeHyphenFromName(student.fullname);
    });

    // Places a capital letter after hyphens
    students.forEach((student) => {
      student.fullname = capitalizeAfterSpaceHyphen(student.fullname);
    });

    sortStudents("fullname");
    displayStudents();
    /*  hackTheSystem(); */
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

    const fullNameParts = student.fullname.trim().split(" ");
    const firstName = fullNameParts[0];
    let middleName =
      fullNameParts.length > 2
        ? fullNameParts.slice(1, -1).join(" ").trim()
        : "-";
    let lastName = fullNameParts[fullNameParts.length - 1].trim();

    const nickname =
      middleName.startsWith('"') && middleName.endsWith('"')
        ? middleName.slice(1, -1).charAt(0).toUpperCase() +
          middleName.slice(2, -1).toLowerCase()
        : "-";

    let row = document.createElement("tr");
    row.innerHTML = `
      <td data-field="squad" class="cup-icon ${student.squad ? "winner" : ""}">
        ${student.squad ? "🏆 Now on the Squad" : "🏆"}
      </td>
      <td data-field="star" class="star-icon ${student.star ? "active" : ""}">
        ${student.star ? "⭐" : "☆"}
      </td>
      <td class="${student.house.toLowerCase()}">${firstName}</td>
      <td class="${student.house.toLowerCase()}">${middleName}</td>
      <td class="${student.house.toLowerCase()} nickname">${nickname}</td>
      <td class="${student.house.toLowerCase()}">${lastName}</td>
      <td class="${student.house.toLowerCase()}">${student.gender}</td>
      <td class="${student.house.toLowerCase()}">${student.house}</td>
      <td class="${student.house.toLowerCase()}">${student.bloodStatus}</td>
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

    // Add click event listener to star icon
    const starIcon = row.querySelector(".star-icon");
    starIcon.addEventListener("click", () => {
      student.star = !student.star;
      starIcon.classList.toggle("active", student.star);
      starIcon.textContent = student.star ? "⭐" : "☆";
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
      // Code for expelled students
      let expelledRow = document.createElement("tr");
      expelledRow.innerHTML = `
        <td>${student.fullname}</td>
        <td class="gender-field ${student.gender.toLowerCase()}">${
        student.gender
      }</td>
        <td class="${student.house.toLowerCase()}">${student.house}</td>
        <td class="blood-status-field">${student.bloodStatus}</td>
      `;
      expelledTableBody.appendChild(expelledRow);
    } else {
      // Code for active students
      let activeRow = document.createElement("tr");

      const fullNameParts = student.fullname.trim().split(" ");
      const firstName = fullNameParts[0];
      let middleName =
        fullNameParts.length > 2
          ? fullNameParts.slice(1, -1).join(" ").trim()
          : "-";
      let lastName = fullNameParts[fullNameParts.length - 1].trim();

      const nickname =
        middleName.startsWith('"') && middleName.endsWith('"')
          ? middleName.slice(1, -1)
          : "-";

      activeRow.innerHTML = `
        <td data-field="squad" class="cup-icon ${
          student.squad ? "winner" : ""
        }">
          ${student.squad ? "🏆 Now on the Squad" : "🏆"}
        </td>
        <td data-field="star" class="star-icon ${student.star ? "active" : ""}">
          ${student.star ? "⭐" : "☆"}
        </td>
        <td class="${student.house.toLowerCase()}">${firstName}</td>
        <td class="${student.house.toLowerCase()}">${middleName}</td>
        <td class="${student.house.toLowerCase()} nickname">${nickname}</td>
        <td class="${student.house.toLowerCase()}">${lastName}</td>
        <td class="${student.house.toLowerCase()}">${student.gender}</td>
        <td class="${student.house.toLowerCase()}">${student.house}</td>
        <td class="${student.house.toLowerCase()}">${student.bloodStatus}</td>
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

      activeRow.addEventListener("click", () => {
        showStudentPopup(student);
      });

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

//-------------CLEANUP DATA-------------------

function capitaliseName(name) {
  if (!name) {
    return "";
  }
  const nameParts = name.split(" ");
  return nameParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function capitaliseHouse(house) {
  const makeHouseUppercase = house.split(" ");
  return makeHouseUppercase
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

/* function removeQuotationMarks(fullname) {
  let result = fullname.replace(/["\\]/g, "");
  return result;
} */

function removeHyphenFromName(fullname) {
  let output = "";
  let nicknameStarted = false;

  for (let i = 0; i < fullname.length; i++) {
    if (fullname.charAt(i) === "-") {
      output += " ";
      nicknameStarted = true;
    } else if (nicknameStarted) {
      output += fullname.charAt(i);
    } else {
      output += fullname.charAt(i);
    }
  }

  return output;
}

function capitalizeAfterSpaceHyphen(input) {
  let output = input.charAt(0);
  for (let i = 1; i < input.length; i++) {
    if (input.charAt(i - 1) === " " || input.charAt(i - 1) === "-") {
      output += input.charAt(i).toUpperCase();
    } else {
      output += input.charAt(i);
    }
  }
  return output;
}

//---------------HACK THE SYSTEM-----------------------------

function hackTheSystem() {
  // Inject your own student data
  const yourName = "Aromatic Pat";
  const yourHouse = "Gryffindor";
  const yourGender = "boy";
  const yourBloodStatus = "Pure Blood";

  const newStudent = {
    fullname: yourName,
    house: yourHouse,
    gender: yourGender,
    bloodStatus: yourBloodStatus,
    expelled: false,
    squad: false,
    star: false,
  };

  students.push(newStudent);

  // Modify blood status randomly for former pure-bloods
  students.forEach((student) => {
    if (student.bloodStatus === "Pure Blood") {
      student.bloodStatus = Math.random() < 0.5 ? "Pure Blood" : "Half Blood";
    } else {
      student.bloodStatus = Math.random() < 0.5 ? "Pure Blood" : "Muggle Blood";
    }
  });

  // Add student to inquisitorial squad for a limited time
  const squadDuration = 50; // Duration in milliseconds
  newStudent.squad = true;
  setTimeout(() => {
    newStudent.squad = false;
  }, squadDuration);

  // Display notification message
  const notification = document.getElementById("notification");
  notification.textContent =
    "System hacked! You are now immortal, blood statuses are unreliable, and you are temporarily in the Inquisitorial Squad.";

  // Remove notification after a certain time
  const notificationDuration = 100; // Duration in milliseconds
  setTimeout(() => {
    notification.textContent = "";
  }, notificationDuration);
}

//----------------------STUDENT INFO POPUP-----------------------------

/* function showStudentDetailsPopup(student) {
  const popupContainer = document.getElementById("student-popup");
  const popupContent = document.getElementById("student-popup-content");

  // Clear previous content
  popupContent.innerHTML = "";

  // Create elements with student details
  const firstName = document.createElement("p");
  firstName.textContent = "First Name: " + student.first_name;
  popupContent.appendChild(firstName);

  const middleName = document.createElement("p");
  middleName.textContent = "Middle Name: " + (student.middle_name || "N/A");
  popupContent.appendChild(middleName);

  const nickName = document.createElement("p");
  nickName.textContent = "Nick Name: " + (student.nick_name || "N/A");
  popupContent.appendChild(nickName);

  const lastName = document.createElement("p");
  lastName.textContent = "Last Name: " + student.last_name;
  popupContent.appendChild(lastName);

  if (student.photo) {
    const photo = document.createElement("img");
    photo.src = student.photo;
    photo.alt = student.first_name + " " + student.last_name + " photo";
    popupContent.appendChild(photo);
  }

  const houseCrestImage = document.createElement("img");
  houseCrestImage.src = getHouseCrestImage(student.house);
  houseCrestImage.alt = student.house + " crest";
  popupContent.appendChild(houseCrestImage);

  const bloodStatus = document.createElement("p");
  bloodStatus.textContent = "Blood Status: " + student.bloodStatus;
  popupContent.appendChild(bloodStatus);

  const prefectStatus = document.createElement("p");
  prefectStatus.textContent = "Prefect: " + (student.prefect ? "Yes" : "No");
  popupContent.appendChild(prefectStatus);

  const expelledStatus = document.createElement("p");
  expelledStatus.textContent = "Expelled: " + (student.expelled ? "Yes" : "No");
  popupContent.appendChild(expelledStatus);

  const inquisitorialSquadStatus = document.createElement("p");
  inquisitorialSquadStatus.textContent =
    "Inquisitorial Squad: " + (student.inquisitorialSquad ? "Yes" : "No");
  popupContent.appendChild(inquisitorialSquadStatus);

  // Add house theme to the popup
  popupContainer.classList.add(student.house.toLowerCase());

  // Display the popup
  popupContainer.style.display = "block";

  // Close the popup when close button is clicked
  const closeButton = document.createElement("span");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => {
    popupContainer.style.display = "none";
    // Remove house theme from the popup
    popupContainer.classList.remove(student.house.toLowerCase());
  });
  popupContent.appendChild(closeButton);
}

// Helper function to get the house crest image URL based on the house name
function getHouseCrestImage(house) {
  // Map house names to their corresponding crest image URLs
  const houseCrests = {
    Gryffindor: "styleimages/gryffindor.png",
    Slytherin: "styleimages/slytherin.png",
    Hufflepuff: "styleimages/hufflepuff.png",
    Ravenclaw: "styleimages/ravenclaw.png",
  };

  // Return the crest image URL for the given house
  return houseCrests[house] || "";
} */
