function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    
    if (taskInput.value.trim() === '') {
        alert('Please enter a task!');
        return;
    }

    const li = document.createElement('li');
    
    // Task text
    const taskText = document.createElement('span');
    taskText.textContent = taskInput.value;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function() {
        li.remove();
        saveTasks();
    };

    // Complete task
    taskText.onclick = function() {
        taskText.classList.toggle('completed');
        saveTasks();
    };

    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    
    taskInput.value = '';
    saveTasks();
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li span').forEach(task => {
        tasks.push({
            text: task.textContent,
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        
        if (task.completed) {
            taskText.classList.add('completed');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = function() {
            li.remove();
            saveTasks();
        };

        taskText.onclick = function() {
            taskText.classList.toggle('completed');
            saveTasks();
        };

        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Add task when Enter key is pressed
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Load tasks when page loads
window.onload = loadTasks;