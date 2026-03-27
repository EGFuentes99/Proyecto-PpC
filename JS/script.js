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
   tasks.forEach(function(task) {
      task.completed = true;
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
   const stats = getStats();

   totalTasks.textContent = stats.total;
   completedTasks.textContent = stats.done;
   pendingTasks.textContent = stats.pending;
   progressTasks.textContent = stats.percentage + "%";
}

function getStats() {
   const total = tasks.length;
   const done = tasks.filter(tarea => tarea.completed).length;

   return{
      total,
      done,
      pending: total - done,
      percentage: total > 0 ? Math.round( (done / total) * 100 ) : 0
   }
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
      deleteTask(index);
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

    //Añadir fecha de creación usando Date()
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("task-date");
    const now = new Date();
    //Usar solo fecha local, sin hora
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
  //Guardamos el texto que escribio el usuario
    if (taskText === "" ) return;

    const newTask = {
      text: taskText,
      completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();
}

function createTask() {
 addTask(input.value);
 input.value = "";
}

//Inicializacion
loadTasks();
renderTasks();

