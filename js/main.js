const taskInput = document.getElementById("taskInput");
const form = document.getElementById("form");
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownMenu = document.getElementById("dropdown-menu");
const tasks = document.getElementById("tasks");
const taskItem = document.querySelector(".task-item");
const footer = document.getElementById("footer");
const clear = document.getElementById("clear");
const searchInput = document.getElementById("search-input");

dropdownBtn.addEventListener("click", toggleDropdown);
dropdownMenu.addEventListener("click", filter);
form.addEventListener("submit", addTask);
tasks.addEventListener("click", removeTask);
tasks.addEventListener("click", completeTask);
document.addEventListener("DOMContentLoaded", getTasksFromLocalStorage);
clear.addEventListener("click", clearTasks);
searchInput.addEventListener("keyup", searchTask);

footer.innerHTML = `&copy ${new Date().getFullYear()} Bryan Henryon — <a href="https://www.bryanhenryon.fr/" target="_blank"> www.bryanhenryon.fr</a>`;

function toggleDropdown(e) {
  dropdownMenu.classList.toggle("active");

  if (dropdownMenu.classList.contains("active")) {
    dropdownMenu.style.display = "block";
    document.getElementById("dropdown-icon").style.transition = "0.2s";
    document.getElementById("dropdown-icon").style.transform = "rotate(180deg)";
  } else {
    dropdownMenu.style.display = "none";
    document.getElementById("dropdown-icon").style.transition = "0.2s";
    document.getElementById("dropdown-icon").style.transform = "rotate(0)";
  }
  e.preventDefault();
}

function filter(e) {
  const taskItems = document.querySelectorAll(".task-item");

  for (task of taskItems) {
    switch (e.target.textContent) {
      case "Toutes":
        task.style.display = "flex";
        dropdownBtn.children[0].textContent = "Toutes";
        hideDropdownMenu();
        break;
      case "Complétées":
        dropdownBtn.children[0].textContent = "Complétées";
        if (task.classList.contains("completed")) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        hideDropdownMenu();
        break;
      case "En cours":
        dropdownBtn.children[0].textContent = "En cours";
        if (!task.classList.contains("completed")) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        hideDropdownMenu();
    }
  }

  function hideDropdownMenu() {
    dropdownMenu.classList.remove("active");
    dropdownMenu.style.display = "none";

    document.getElementById("dropdown-icon").style.transition = "0.2s";
    document.getElementById("dropdown-icon").style.transform = "rotate(0)";
  }
}

function addTask(e) {
  const error = document.getElementById("error");
  if (taskInput.value === "") {
    error.textContent = "Veuillez renseigner une tâche";
    error.style.display = "block";
  } else {
    if (checkDuplicate(taskInput.value) !== "duplicate") {
      error.style.display = "none";
      const li = document.createElement("li");
      li.classList.add("task-item");

      const span = document.createElement("span");
      span.appendChild(document.createTextNode(taskInput.value));
      span.id = "task";

      li.appendChild(span);

      const check = document.createElement("i");
      check.className = "fas fa-check";

      const trash = document.createElement("i");
      trash.className = "fas fa-trash";

      li.appendChild(check);
      li.appendChild(trash);

      tasks.appendChild(li);

      addTaskToLocalStorage(taskInput.value);

      taskInput.value = "";
    } else {
      error.textContent = "Cette tâche existe déjà";
      error.style.display = "block";
    }
  }
  e.preventDefault();
}

function checkDuplicate(taskInputValue) {
  let tasksList;

  if (localStorage.getItem("tasks") === null) {
    tasksList = [];
  } else {
    tasksList = JSON.parse(localStorage.getItem("tasks"));
  }

  for (let i = 0; i < tasksList.length; i++) {
    if (tasksList[i]["task"] === taskInputValue) {
      return "duplicate";
    }
  }
}

function removeTask(e) {
  if (e.target.classList.contains("fa-trash")) {
    e.target.parentNode.remove();
    removeTaskFromLocalStorage(e.target.parentNode);
  }
}

function completeTask(e) {
  if (e.target.classList.contains("fa-check")) {
    const taskItem = e.target.parentNode;

    taskItem.classList.toggle("completed");

    if (taskItem.classList.contains("completed")) {
      taskItem.style.transition = "0.3s";
      taskItem.style.opacity = 0.5;
      e.target.previousSibling.style.textDecoration = "line-through";
    } else {
      taskItem.style.transition = "0.3s";
      taskItem.style.opacity = 1;
      e.target.previousSibling.style.textDecoration = "none";
    }

    markCompleted(taskItem);
  }
}

function searchTask(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll(".task-item").forEach(function (task) {
    const item = task.firstChild.textContent;
    if (item.toLowerCase().indexOf(text) != -1) {
      dropdownBtn.children[0].textContent = "Toutes";
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}

function clearTasks() {
  tasks.innerHTML = "";
  localStorage.clear();
}

function markCompleted(taskItem) {
  let tasksList;

  if (localStorage.getItem("tasks") === null) {
    tasksList = [];
  } else {
    tasksList = JSON.parse(localStorage.getItem("tasks"));
  }

  const taskIndex = taskItem.children[0].innerText;
  let index = tasksList.findIndex((obj) => obj.task == taskIndex);

  if (tasksList[index].status === "uncompleted") {
    tasksList[index].status = "completed";
    localStorage.setItem("tasks", JSON.stringify(tasksList));
  } else {
    tasksList[index].status = "uncompleted";
    localStorage.setItem("tasks", JSON.stringify(tasksList));
  }
}

function getTasksFromLocalStorage() {
  let tasksList;
  if (localStorage.getItem("tasks") === null) {
    tasksList = [];
  } else {
    tasksList = JSON.parse(localStorage.getItem("tasks"));
  }

  tasksList.forEach(function (task) {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const span = document.createElement("span");
    span.appendChild(document.createTextNode(task["task"]));
    span.id = "task";

    li.appendChild(span);

    const check = document.createElement("i");
    check.className = "fas fa-check";

    const trash = document.createElement("i");
    trash.className = "fas fa-trash";

    li.appendChild(check);
    li.appendChild(trash);

    tasks.appendChild(li);

    if (task.status == "completed") {
      li.classList.toggle("completed");
      li.children[0].style.textDecoration = "line-through";
    }
  });
}

function addTaskToLocalStorage(task) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  let data = {
    task,
    status: "uncompleted",
  };

  tasks.push(data);

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(li) {
  let tasksList;
  if (localStorage.getItem("tasks") === null) {
    tasksList = [];
  } else {
    tasksList = JSON.parse(localStorage.getItem("tasks"));
  }

  const taskIndex = li.children[0].innerText;
  let index = tasksList.findIndex((obj) => obj.task === taskIndex);

  tasksList.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasksList));
}
