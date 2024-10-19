// Dark/Light Mode Toggle
const toggleThemeButton = document.getElementById('toggleTheme');
const body = document.body;

toggleThemeButton.textContent = body.classList.contains('dark-mode') ? "Dark" : "Light";

toggleThemeButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        toggleThemeButton.textContent = "Light";
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        toggleThemeButton.textContent = "Dark";
    }
});

// Task management interactions
const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTaskButton');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDate');
const prioritySelect = document.getElementById('prioritySelect');

// Filter buttons
const filterAllButton = document.getElementById('filterAll');
const filterActiveButton = document.getElementById('filterActive');
const filterCompletedButton = document.getElementById('filterCompleted');

let tasks = [];
let lastCompletedTaskIndex = null; // To track the last completed task
let undoTimeout = null; // To manage undo functionality

// Validate date input for year limit
dueDateInput.addEventListener('input', () => {
    const dateValue = dueDateInput.value;
    const year = dateValue.substring(0, 4);
    
    if (year.length > 4) {
        alert("Please enter a valid year (4 digits only).");
        dueDateInput.value = ""; // Clear the input
    }
});

// Date formatting function
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Adding task with animation
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const dueDateValue = dueDateInput.value;
    const priorityValue = prioritySelect.value;

    if (taskText === "" || dueDateValue === "") return; // Prevent adding empty tasks

    const dueDate = new Date(dueDateValue);
    const newTask = {
        text: taskText,
        dueDate: formatDate(dueDate),
        priority: priorityValue,
        completed: false
    };
    
    tasks.push(newTask);
    renderTasks();
    taskInput.value = ""; // Clear input field
    dueDateInput.value = ""; // Clear due date field
});

// Render tasks based on the current filter
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // all tasks
    });

    filteredTasks.forEach((task, index) => {
        const newTask = document.createElement('li');
        newTask.className = 'task-added'; // Adding fade-in animation
        newTask.innerHTML = `
            <div>
                <strong>${task.text}</strong><br>
                Due: ${task.dueDate} <br>
                Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} <!-- Capitalize first letter -->
            </div>
            <div>
                <button class="complete">✔</button>
                <button class="delete">🗑</button>
                ${task.completed ? `<button class="undo">↩</button>` : ''}
            </div>
            <div class="note">Note: Press the tick mark if completed</div>
        `;
        taskList.appendChild(newTask);

        // Mark task as completed
        newTask.querySelector('.complete').addEventListener('click', () => {
            if (!task.completed) {
                task.completed = true;
                renderTasks(filter);
                showUndoOption(newTask); // Show undo option next to the task
            }
        });

        // Undo last completion
        newTask.querySelector('.undo')?.addEventListener('click', () => {
            task.completed = false; // Revert completion
            renderTasks(filter);
        });

        // Add micro-interaction for delete
        newTask.querySelector('.delete').addEventListener('click', () => {
            tasks.splice(index, 1); // Remove task from array
            renderTasks(filter);
        });
    });
}

// Show undo option next to the task
function showUndoOption(taskItem) {
    const undoButton = taskItem.querySelector('.undo');
    if (undoButton) {
        clearTimeout(undoTimeout); // Clear previous timeout
        undoButton.style.display = 'inline'; // Show undo button

        undoTimeout = setTimeout(() => {
            undoButton.style.display = 'none'; // Hide after timeout
        }, 5000); // Show for 5 seconds
    }
}

// Filter button event listeners
filterAllButton.addEventListener('click', () => renderTasks('all'));
filterActiveButton.addEventListener('click', () => renderTasks('active'));
filterCompletedButton.addEventListener('click', () => renderTasks('completed'));
