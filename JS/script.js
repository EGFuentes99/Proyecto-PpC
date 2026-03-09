//Obtener elementos del HTML

const input= document.getElementById("taskInput");
const addButton= document.getElementById("addTaskBtn");
const taskList= document.getElementById("taskList");

//Evento del botón agregar 
addButton.addEventListener("click", function() {
    const taskText= input.value;
    console.log(taskText);

    if(taskText.trim() === "") {
        return;
    }

    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.textContent= taskText;

    taskList.appendChild(taskItem);

    input.value="";

    const checknox = document.createElement('Input');
    checknox.type = "checkbox"
    checknox.classList.add('Complete-btn');
    taskItem.appendChild(checknox);
});

// Evento para eliminar 
