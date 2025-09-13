/*
*   <li class="todo-item high urgent">
            <input type="checkbox" id="todo3">
            <div class="todo-content">
                <label for="todo3">Fix server outage</label>
                <span class="category">Urgent</span>
                <span class="meta">Due: 2023-10-12 | Priority: High</span>
                <div class="notes">Contact IT team immediately.</div>
            </div>
            <button class="edit-btn">✎</button>
            <button class="delete-btn">×</button>
        </li>
* */

// todo:: we need to create a feature for adding a new todo item
const todoList = document.querySelector('.todo-list'),
    todoForm = document.querySelector('#todoForm');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

//We need to check if the priority is valid or not
const validPriorities = ['low', 'medium', 'high'];

function addTodo(event){
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target).entries());

    if (! validateFormData(formData)) {
        return ;
    }

    // now we need to create a new todo item and save it into local storage
    addTodoItem(formData);
}

// create a function to validate all the form data before adding a new todo item
function validateFormData(formData) {
    //We need to check if the title is empty or not
    if (!formData.title || formData.title.trim() === '') {
        alert('Title is required');
        return false;
    }

    if(formData.dueDate.trim() === ''){
        alert('Due Date is required');
        return false;
    }

    // we need to check if the due date is valid or not
    if (formData.dueDate && isNaN(Date.parse(formData.dueDate))) {
        alert('Due date is not valid');
        return false;
    }

    if (formData.priority && !validPriorities.includes(formData.priority.toLowerCase())) {
        alert('Priority must be Low, Medium, or High');
        return false;
    }

    return true;
}

// create a function to save todos to local storage
function saveTodos(newTodo){
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function renderTodos(){
    // clear the existing todo list
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        const className = `todo_class_${todo.id}`;

        li.className = `todo-item ${todo.priority} ${todo.category ? todo.category.toLowerCase() : ''} `;

        li.innerHTML = `
            <input type="checkbox" id="todoInput${todo.id}">
            <div class="todo-content">
                <label for="todo1">${todo.title}</label>
                <span class="category">${ todo.category }</span>
                <span class="meta">Due: ${ todo.dueDate } | Priority: ${ todo.priority }</span>
                <div class="notes">${ todo.note }</div>
            </div>
            <button class="edit-btn edit_${className}">✎</button>
            <button class="delete-btn delete_${className}">×</button>
        `;

        todoList.appendChild(li);
    });
}

function editTodo(id){
    // now we need to find the todo item by id and edit it
    const todo = todos.find(todo => todo.id === id);

    // now we need to update the todo item value through the form fields
    if (todo) {
        // populate the form fields with the todo item values
        todoForm.title.value = todo.title;
        todoForm.dueDate.value = todo.dueDate;
        todoForm.priority.value = todo.priority;
        todoForm.category.value = todo.category;
        todoForm.note.value = todo.note;

        todoForm.querySelector('button').innerText = 'Update Todo';
        todoForm.setAttribute('data-edit-form', true);
        todoForm.setAttribute('data-edit-id', id);
    }
}

function deleteTodo(id){
    // now we need to find the todo item by id and delete it
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function addTodoItem(formData){
    // this form data contains values like title, dueDate, priority, category, note

    const newTodo = {
        id: randomId(),
        title: formData.title,
        dueDate: formData.dueDate,
        priority: formData.priority.toLowerCase(),
        category: formData.category,
        note: formData.note,
        completed: false
    };

   saveTodos(newTodo);
}

function handleTodo(event) {
    event.preventDefault();
    // check if the form is in edit mode
    const isEditForm = todoForm.getAttribute('data-edit-form');

    if(isEditForm){
        // update the existing todo item
        // get the todo id from the hidden input field
        const todoId = todoForm.getAttribute('data-edit-id');

        const formData = Object.fromEntries(new FormData(event.target).entries());

        if (! validateFormData(formData)) {
            return ;
        }

        const todoIndex = todos.findIndex(todo => todo.id === todoId);

        if (todoIndex !== -1) {
            todos[todoIndex] = {
                ...todos[todoIndex],
                title: formData.title,
                dueDate: formData.dueDate,
                priority: formData.priority.toLowerCase(),
                category: formData.category,
                note: formData.note
            };

            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();

            // reset the form
            todoForm.reset();
            todoForm.querySelector('button').innerText = 'Add Todo';
            todoForm.removeAttribute('data-edit-form');
            todoForm.removeAttribute('data-edit-id');
        }
    }
}

function randomId(){
    return Math.random().toString(36).substr(2, 9);
}
// add event listener to the todoForm element
todoForm.addEventListener('submit', handleTodo);

// add event listener to the todoList element for edit and delete buttons
todoList.addEventListener('click', function(event){
    if (event.target.classList.contains('edit-btn')) {
        const classList = event.target.className.split(' ');

        const todoClass = classList.find(cls => cls.startsWith('edit_'));

        if (todoClass) {
            const todoId = todoClass.replace('edit_todo_class_', '');
            editTodo(todoId);
        }
    } else if (event.target.classList.contains('delete-btn')) {
        const classList = event.target.className.split(' ');
        const todoClass = classList.find(cls => cls.startsWith('delete_'));
        if (todoClass) {
            const todoId = todoClass.replace('delete_todo_class_', '');
            deleteTodo(todoId);
        }
    }
});

// render the existing todos on page load
renderTodos();

// document.querySelector('button').addEventListener('click', addTodo);