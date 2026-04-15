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

// Audio de fondo - Agregué selección para activarlo con interacción
const backgroundAudio = document.getElementById("backgroundAudio");

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
         tasks = tasks.map(task => ({ ...task, pinned: task.pinned ?? false }));
      } catch (error) {
         console.error("Error al cargar tareas desde LocalStorage:", error);
         tasks = [];
      }
   }
}

/* ===============================
   3. EVENTOS DE LOS BOTONES
   =============================== */
//Botón Ordenar A-Z
sortAZ.addEventListener("click", function() {
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

// Verificar si todas las tareas están completadas
function areAllTasksCompleted() {
   return tasks.length > 0 && tasks.every(task => task.completed);
}

// Actualizar el estado del botón de completar todas
function updateCompleteAllButton() {
   if (areAllTasksCompleted()) {
      completeAll.textContent = "Desmarcar todas las tareas";
   } else {
      completeAll.textContent = "Marcar todas completadas";
   }
}

// Marcar o desmarcar todas las tareas
completeAll.addEventListener("click", function() {
   const allCompleted = areAllTasksCompleted();
   
   tasks.forEach(function(task) {
      task.completed = !allCompleted;
   });

   saveTasks();
   renderTasks();
   updateCompleteAllButton();
});

/* ===============================
   5. FORMULARIO Y TECLAS
   =============================== */

/*
addEventListener permite ejecutar código
cuando ocurre una acción del usuario.
*/

button.addEventListener("click", function() {
    button.classList.remove("btn-click-animate");
    void button.offsetWidth; // reinicia la animación si se presiona varias veces seguidas
    button.classList.add("btn-click-animate");
    // Activar audio de fondo en el primer click - Agregué para superar bloqueo de autoplay
    if (backgroundAudio.paused) {
        backgroundAudio.play().catch(e => console.log("Audio autoplay bloqueado:", e));
    }
    createTask();
});

button.addEventListener("animationend", function() {
    button.classList.remove("btn-click-animate");
});

input.addEventListener("keypress", function(tecla) {
   if (tecla.key === "Enter") {
      // Activar audio de fondo en el primer Enter - Agregué para superar bloqueo de autoplay
      if (backgroundAudio.paused) {
         backgroundAudio.play().catch(e => console.log("Audio autoplay bloqueado:", e));
      }
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

   // Ordenar tareas para que las ancladas aparezcan primero
   tasks.sort((a, b) => b.pinned - a.pinned);

   tasks.forEach(function(task, index) {
          // Crear elemento de tarea
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const taskLeft = document.createElement("div");
    taskLeft.classList.add("task-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const span = document.createElement("span");
    span.textContent = task.text;

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("edit-btn");

    const pinButton = document.createElement("button");
    pinButton.textContent = task.pinned ? "Desanclar" : "📌";
    pinButton.classList.add("pin-btn");

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

    editButton.addEventListener("click", function() {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.classList.add("edit-input");

      // Reemplazar span con input
      taskLeft.replaceChild(input, span);
      input.focus();

      // Guardar al presionar Enter
      input.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          const newText = input.value.trim();
          if (newText !== "" && newText.length >= 5) {
            tasks[index].text = newText;
            saveTasks();
            renderTasks();
          } else {
            // Cancelar si es inválido
            taskLeft.replaceChild(span, input);
          }
        }
      });

      // Cancelar al presionar Escape
      input.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
          taskLeft.replaceChild(span, input);
        }
      });

      // Guardar al perder el foco
      input.addEventListener("blur", function() {
        const newText = input.value.trim();
        if (newText !== "" && newText.length >= 5) {
          tasks[index].text = newText;
          saveTasks();
          renderTasks();
        } else {
          taskLeft.replaceChild(span, input);
        }
      });
    });

    pinButton.addEventListener("click", function() {
      tasks[index].pinned = !tasks[index].pinned;
      saveTasks();
      renderTasks();
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
    taskItem.appendChild(editButton);
    taskItem.appendChild(pinButton);
    taskItem.appendChild(deleteButton);

    // Agregar la tarea al Dashboard
    taskList.appendChild(taskItem)
   });

   updateStats();
   updateCompleteAllButton();

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

   // Guardamos el texto que escribió el usuario
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
      priority: 1,
      pinned: false
   };

   tasks.push(newTask);

   saveTasks();
   renderTasks();
}

/* ===============================
   9. CREAR TAREA
   =============================== */

function createTask() {
   addTask(input.value);
   input.value = "";
}

/* ===============================
   10. INICIALIZACIÓN
   =============================== */

loadTasks();
renderTasks();
updateCompleteAllButton();