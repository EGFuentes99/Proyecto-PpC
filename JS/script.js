/* ===============================
   1. SELECCIONAR ELEMENTOS DEL DOM
   =============================== */

/*
JavaScript primero debe localizar los elementos
con los que va a trabajar dentro de la página.
*/

// Campo donde el usuario escribe la tarea
const input = document.getElementById("taskInput");

// Botón para agregar tarea
const button = document.getElementById("addTaskBtn");

// Contenedor donde aparecerán las tareas
const taskList = document.getElementById("taskList");

//Elementos de total de tareas
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressTasks = document.getElementById("progress");

//Botones de ordenamiento
const sortAZ = document.getElementById("sortAZ");
const sortZA = document.getElementById("sortZA");
const completeAll = document.getElementById("completeAll");

// Modelo de datos
let tasks = [];

/* ===============================
   2. ALMACENAMIENTO EN LOCALSTORAGE
   =============================== */

// Guardar tareas en el navegador
function saveTasks() {
   localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Cargar tareas guardadas desde el navegador
function loadTasks() {
   const saved = localStorage.getItem("tasks");

   if (saved) {
      try {
         tasks = JSON.parse(saved);
      } catch (error) {
         console.error("Error al cargar tareas desde LocalStorage:", error);
         tasks = [];
      }
   }
}

/* ===============================
   3. EVENTOS DE LOS BOTONES
   =============================== */
//Boton AZ
sortAZ.addEventListener("click", function() {
   console.log("Boton AZ pressed")
   tasks.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
   saveTasks();
   renderTasks();
});

sortZA.addEventListener("click", function() {
   tasks.sort((a, b) => b.text.toLowerCase().localeCompare(a.text.toLowerCase()));
   saveTasks();
   renderTasks();
});

/* ===============================
   4. ACCIONES DE TAREAS EN MASA
   =============================== */

// Marcar todas como completadas
completeAll.addEventListener("click", function() {
   const checkboxes = document.querySelectorAll("#taskList input[type='checkbox']");

   checkboxes.forEach(function(checkbox, index) {
      checkbox.checked = true;
      if (tasks[index]) {
         tasks[index].completed = true;
      }
   });

   saveTasks();
   renderTasks();
});

/* ===============================
   5. FORMULARIO Y TECLAS
   =============================== */

/*
addEventListener permite ejecutar código
cuando ocurre una acción del usuario.
*/

button.addEventListener("click", function() {
    createTask();
});

input.addEventListener("keypress", function(tecla) {
   if (tecla.key === "Enter") {
      createTask();
   }
});

/* ===============================
   6. ESTADÍSTICAS DE TAREAS
   =============================== */

function updateStats() {
   const stats = getStats();

   totalTasks.textContent = stats.total;
   completedTasks.textContent = stats.done;
   pendingTasks.textContent = stats.pending;
   progressTasks.textContent = stats.percentage + "%";
}

function getStats() {
   const total = tasks.length;
   const done = tasks.filter(tarea => tarea.completed).length;

   return {
      total,
      done,
      pending: total - done,
      percentage: total > 0 ? Math.round((done / total) * 100) : 0
   }
}

/* ===============================
   7. RENDERIZADO DE LA LISTA
   =============================== */

function renderTasks() {

   taskList.innerHTML = "";

   tasks.forEach(function(task, index) {
          //Crear elemento de tarea
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const taskLeft = document.createElement("div");
    taskLeft.classList.add("task-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const span = document.createElement("span");
    span.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("delete-btn");

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    deleteButton.addEventListener("click", function() {
      const confirmed = confirm("¿Seguro que desea eliminar la tarea?");
      if (confirmed) {
         deleteTask(index);
      }
    });

    checkbox.addEventListener("change", function() {
      tasks[index].completed = checkbox.checked;

      if (checkbox.checked) {
        taskItem.classList.add("completed");
      } else {
        taskItem.classList.remove("completed");
      }

      saveTasks();
      renderTasks();
    })

    // Estructura HTML de cada tarea
    taskLeft.appendChild(checkbox);
    taskLeft.appendChild(span);

    // Añadir fecha de creación usando el valor guardado en la tarea
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("task-date");
    const createdDate = task.createdAt ? new Date(task.createdAt) : new Date();

    // Usar solo fecha local, sin hora
    dateSpan.textContent = "Creada: " + createdDate.toLocaleDateString();
    taskLeft.appendChild(dateSpan);

    taskItem.appendChild(taskLeft);
    taskItem.appendChild(deleteButton);

    //Insertar el texto dentro del elemento
    //taskItem.textContent = taskText;

    //Agregar la tarea al Dashboard
    taskList.appendChild(taskItem)
   });

   updateStats();

}

/* ===============================
   8. FUNCIONES PARA GESTIONAR TAREAS
   =============================== */

function toggleTask(index) {
   tasks[index].completed = !tasks[index].completed;
   saveTasks();
   renderTasks();
}

function deleteTask(index) {
   tasks.splice(index, 1);
   saveTasks();
   renderTasks();
}

function addTask(taskText) {
   const trimmedText = taskText.trim();

   // Guardamos el texto que escribio el usuario
   if (trimmedText === "") return;

   if (trimmedText.length < 5) {
      alert("La tarea debe tener al menos 5 caracteres.");
      return;
   }

   const newTask = {
      text: trimmedText,
      completed: false,
      createdAt: new Date().toISOString(),
      category: "General",
      priority: 1
   };

   tasks.push(newTask);

   saveTasks();
   renderTasks();
}

/* ===============================
   9. RETOS DE ARRAY: FILTER, FOR EACH, MAP
   =============================== */

function filterHealthPending() {
   return tasks.filter(task => task.category === "Salud" && task.completed === false);
}

function filterOddPriority() {
   return tasks.filter(task => Number(task.priority) % 2 === 1);
}

function filterAdvanced() {
   return tasks.filter(task =>
      task.completed === false &&
      Number(task.priority) >= 3 &&
      task.category !== "Personal"
   );
}

function findHighestPriorityTask() {
   if (tasks.length === 0) return null;
   return tasks.reduce((best, task) => {
      const priority = Number(task.priority) || 0;
      return !best || priority > Number(best.priority) ? task : best;
   }, null);
}

function getPriorityLevel(priority) {
   const value = Number(priority);
   if (value >= 4) return "High";
   if (value === 3) return "Medium";
   return "Low";
}

function mapTaskSummaries() {
   return tasks.map(task => ({
      title: task.text,
      status: task.completed ? "Completed" : "Pending",
      level: getPriorityLevel(task.priority)
   }));
}

function normalizeTasksText() {
   tasks = tasks.map(task => ({
      ...task,
      text: task.text.toLowerCase(),
      category: task.category ? task.category.toLowerCase() : task.category
   }));
   saveTasks();
   renderTasks();
}

function createTask() {
   addTask(input.value);
   input.value = "";
}

/* ===============================
   10. INICIALIZACIÓN
   =============================== */

loadTasks();
renderTasks();

