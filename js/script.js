document.addEventListener("DOMContentLoaded", () => {
  const EMPLOYEES_KEY = "employees";
  const EMPLOYEES_PER_PAGE = 5;
  let currentPage = 1;
  let employees = JSON.parse(localStorage.getItem(EMPLOYEES_KEY)) || [];

  const employeeForm = document.getElementById("employeeForm");
  if (employeeForm) {
    employeeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const position = document.getElementById("position").value.trim();
      const about = document.getElementById("about").value.trim();
      const joining_date = document.getElementById("joining_date").value;

      if (!name || !position || !about || !joining_date) {
        alert("All fields are required.");
        return;
      }

      const newEmployee = { name, position, about, joining_date };
      employees.push(newEmployee);
      localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));

      window.location.href = "listing.html";
    });
  }

  const employeeTableBody = document.getElementById("employeeTableBody");
  const paginationDiv = document.getElementById("pagination");

  function renderTable() {
    if (!employeeTableBody) return;

    const start = (currentPage - 1) * EMPLOYEES_PER_PAGE;
    const end = start + EMPLOYEES_PER_PAGE;
    const currentEmployees = employees.slice(start, end);

    employeeTableBody.innerHTML = "";
    currentEmployees.forEach((employee, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>${employee.about}</td>
        <td>${employee.joining_date}</td>
        <td><button class="delete-btn" data-index="${start + index}">Delete</button></td>
      `;
      employeeTableBody.appendChild(row);
    });

    renderPage();
  }

  function renderPage() {
    if (!paginationDiv) return;

    paginationDiv.innerHTML = "";
    const totalPages = Math.ceil(employees.length / EMPLOYEES_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.className = i === currentPage ? "active" : "";
      button.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      paginationDiv.appendChild(button);
    }
  }

  if (employeeTableBody) {
    renderTable();

    employeeTableBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const index = parseInt(e.target.getAttribute("data-index"));
        employees.splice(index, 1);
        localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
        renderTable();
      }
    });
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      employees = JSON.parse(localStorage.getItem(EMPLOYEES_KEY)) || [];
      if (query) {
        employees = employees.filter((employee) =>
          employee.name.toLowerCase().includes(query)
        );
      }
      currentPage = 1;
      renderTable();
    });
  }

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("hidden");
    });
  }
});
