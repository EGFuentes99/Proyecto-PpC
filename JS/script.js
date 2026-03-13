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

//Modelo de datos
let tasks = [];

//Guardar en LocalStorage
function saveTasks() {
   localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
   const saved = localStorage.getItem("tasks");

   if(saved) {
      tasks =JSON.parse(saved);
   }
}

/* ===============================
   2. ESCUCHAR EVENTO DEL BOTÓN
   =============================== */
//Boton AZ
sortAZ.addEventListener("click", function() {
   console.log("Boton AZ pressed")
   const tasks = Array.from( document.querySelectorAll(".task-item") );

   tasks.sort(function(a,b) {
      const textA = a.querySelector("span").textContent.toLowerCase();
      const textB = b.querySelector("span").textContent.toLowerCase();
      
      return textA.localeCompare(textB);
   });

   taskList.innerHTML = "";

   tasks.forEach(function(task) {
      taskList.appendChild(task);
   });

});

sortZA.addEventListener("click", function() {
   const tasks = Array.from( document.querySelectorAll(".task-item"));

   tasks.sort(function(primerPalabra, segundaPalabra) {
      const textA = primerPalabra.querySelector("span").textContent.toLowerCase();
      const textB = segundaPalabra.querySelector("span").textContent.toLowerCase();

      return textB.localeCompare(textA);
   });

   taskList.innerHTML = "";

   tasks.forEach(function(task){
      taskList.appendChild(task);
   });
});

// marcar todas como completadas
completeAll.addEventListener("click", function() {
   const tasks = document.querySelectorAll(".task-item");
   tasks.forEach(function(task) {
      const checkbox = task.querySelector("input[type=checkbox]");
      if (!checkbox.checked) {
         checkbox.checked = true;
         task.classList.add("completed");
      }
   });

   saveTasks();
   renderTasks();
});

/*
addEventListener permite ejecutar código
cuando ocurre una acción del usuario.
*/

button.addEventListener("click", function() {
    createTask();
});

input.addEventListener("keypress", function(tecla) {
   if(tecla.key === "Enter") {
      createTask();
   }
});

function updateStats() {
   const tasks = document.querySelectorAll(".task-item");
   const completed = document.querySelectorAll(".task-item.completed");

   const total = tasks.length;
   const done = completed.length;

   totalTasks.textContent = total;
   completedTasks.textContent = done;
   pendingTasks.textContent = total - done;

   let porcentaje = 0;
   if(total > 0) {
      const resultado = (done / total) * 100
      porcentaje = Math.round(resultado);
   }

   progressTasks.textContent = porcentaje + "%"
}

function renderTasks() {

   taskList.innerHTML = "";

   tasks.forEach( function(task, index) {
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
      if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
        tasks.splice(index, 1);

        saveTasks();
        renderTasks();
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

    //Estructura HTML de cada tarea
    taskLeft.appendChild(checkbox);
    taskLeft.appendChild(span);

    // añadir fecha de creación usando Date()
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("task-date");
    const now = new Date();
    // usar solo fecha local, sin hora
    dateSpan.textContent = "Creada: " + now.toLocaleDateString();
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

function createTask() {
   //Guardamos el texto que escribio el usuario
    const taskText = input.value.trim();
    console.log(taskText);

    // Validacion de longitud mínima
    if (taskText === "" ) return;
    if (taskText.length < 5) {
        alert("La tarea debe tener al menos 5 caracteres.");
        return;
    }

    const newTask = {
      text: taskText,
      completed: false
    };

    tasks.push(newTask);
    //Limpiar input
    input.value = "";

    saveTasks();
    renderTasks();
}

//Inicializacion
loadTasks();
renderTasks();