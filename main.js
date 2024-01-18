const addTodoPopUp = document.getElementById("add-todo-pop-up");
const addTodosButton = document.getElementById("add-todos");
const closePopUpButton = document.getElementsByClassName('close')[0];
const addTodoForm = document.getElementById("add-todo-form");
const todoList = document.querySelector(".todos");
const remainingTodos = document.querySelector(".remaining-todos");
const completedTodos = document.querySelector(".completed-todos");
const totalTodos = document.querySelector(".total-todos");
const addTodoButton = document.getElementById("add-todo-button");
const todoIdHidden = document.getElementById("todo-id");
const titleField = document.getElementById("todo-title-field");
const descriptionField = document.getElementById("todo-description-field");

let todos = JSON.parse(localStorage.getItem('todos')) || [];

// load all the todos from local storage
if (todos != []){
    for(let todo of todos){
        createTodoGUI(todo);
    }
}

addTodoForm.addEventListener("submit", (event) => {
    event.preventDefault();



    if (titleField.value == ""){
        alert("No Todo Title Provided");
        return;
    }

    if(addTodoButton.innerHTML == "Update"){
        const todoId = todoIdHidden.innerHTML;
        const todo = todos.find((todo) => todo.id === parseInt(todoId));
        todo.title = titleField.value;
        todo.description = descriptionField.value;
        updateTodoGUI(todoId, titleField.value, descriptionField.value);
        addTodoButton.innerHTML = "Submit";
        localStorage.setItem("todos",JSON.stringify(todo));

    } else {    
        const todo = {
            id: Date.now(), // epoch value of current time
            title: titleField.value,
            description: descriptionField.value,
            isCompleted: false,
        }
        
        // add to local storage
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));

        createTodoGUI(todo);
    }

    // clear out title & description values
    titleField.value = "";
    descriptionField.value = "";

    // exit the popup
    addTodoPopUp.style.display = "none";
});

function createTodoGUI(todo){
    const listItem = document.createElement('li');
    listItem.setAttribute('id', todo.id);
    const todoListItem = `
        <div class="todo">
            <label for="${todo.id}">
                <input type="checkbox" class="checkbox" id="${todo.id}" name="todos" ${todo.isCompleted ? 'checked': ''}>
                <span class="checkbox-circle"></span>
            </label>
            <div class="todo-content">
                <span class="todo-title-text">${todo.title}</span>
                <span class="todo-description-text">${todo.description}</span>
            </div>
            <span title="Remove Todo" class="remove-todo">&times;</span>
        </div>`;

    listItem.innerHTML = todoListItem;
    todoList.appendChild(listItem);
    updateStates();
}

todoList.addEventListener("click" , (event) => {
    if (event.target.classList.contains("remove-todo")){
        const todoId = event.target.closest('li').id;
        removeTodo(todoId);
    } else if(event.target.classList.contains("checkbox-circle")){
        const todoId = event.target.closest('li').id;
        changeIsCompleted(todoId);
    } else {
        const todoId = event.target.closest('li').id;
        updateTodoInitializer(todoId);
    }
});

function updateTodoInitializer(todoId){
    const todo = todos.find((todo) => todo.id === parseInt(todoId));
    titleField.value = todo.title;
    descriptionField.value = todo.description;
    addTodoButton.innerHTML = "Update";
    todoIdHidden.innerHTML = todoId;
    addTodoPopUp.style.display = "block";
}

function updateTodoGUI(todoId, title, description){
    const listItem = document.getElementById(todoId);
    const todoContent = listItem.querySelector(".todo > .todo-content");
    todoContent.querySelector(".todo-title-text").textContent = title;
    todoContent.querySelector(".todo-description-text").textContent = description;
}

function changeIsCompleted(todoId) {
    const todo = todos.find((todo)=> todo.id === parseInt(todoId));
    todo.isCompleted = !todo.isCompleted;
    const listElement = document.getElementById(todoId);
    const checkbox = listElement.querySelector(".todo > label > .checkbox");
    if (checkbox.checked) {
        checkbox.checked = false;
    } else {
        checkbox.checked = true;
    }
    localStorage.setItem("todos", JSON.stringify(todos));
    updateStates();
}

function removeTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== parseInt(todoId));
    localStorage.setItem("todos", JSON.stringify(todos));
    document.getElementById(todoId).remove();
    updateStates();
}

// Update Statistics
function updateStates(){
    const completedTodosList = todos.filter((todo) => todo.isCompleted === true);
    totalTodos.textContent = todos.length;
    completedTodos.textContent = completedTodosList.length;
    remainingTodos.textContent = todos.length - completedTodosList.length;
}

// open add todo popup
addTodosButton.onclick = function () {
    addTodoPopUp.style.display = "block";
}

// close add todo popup
closePopUpButton.onclick = function () {
    titleField.value = "";
    descriptionField.value = "";
    addTodoButton.innerHTML = "Submit";
    addTodoPopUp.style.display = "none";
}

// to close on click outside of popup
window.onclick = function(event) {
    if (event.target == addTodoPopUp) {
        titleField.value = "";
        descriptionField.value = "";
        addTodoButton.innerHTML = "Submit";
        addTodoPopUp.style.display = "none";
    }
}