// Language data
const translations = {
    ar: {
        dir: "rtl",
        title: "قائمة المهام",
        placeholder: "أضف مهمة جديدة...",
        add: "إضافة",
        clear: "مسح الكل",
        deleteTitle: "حذف المهمة",
        confirmClear: "هل أنت متأكد من مسح جميع المهام؟"
    },
    en: {
        dir: "ltr",
        title: "To-Do List",
        placeholder: "Add a new task...",
        add: "Add",
        clear: "Clear All",
        deleteTitle: "Delete task",
        confirmClear: "Are you sure you want to clear all tasks?"
    }
};

let currentLang = localStorage.getItem('todo-lang') || 'ar';

// Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const clearBtn = document.getElementById('clear-btn');
const appTitle = document.getElementById('app-title');
const addBtn = document.getElementById('add-btn');
const langAr = document.getElementById('lang-ar');
const langEn = document.getElementById('lang-en');

// Multi-language UI update
function updateLangUI() {
    document.documentElement.lang = currentLang;
    document.body.dir = translations[currentLang].dir;
    appTitle.textContent = translations[currentLang].title;
    todoInput.placeholder = translations[currentLang].placeholder;
    addBtn.textContent = translations[currentLang].add;
    clearBtn.textContent = translations[currentLang].clear;
    langAr.classList.toggle('active', currentLang === 'ar');
    langEn.classList.toggle('active', currentLang === 'en');
    renderTodos(); // To update delete button titles
}

// Local Storage helpers
function getTodos() {
    return JSON.parse(localStorage.getItem('todos') || '[]');
}
function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Render todos
function renderTodos() {
    const todos = getTodos();
    todoList.innerHTML = '';
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <span class="task" data-idx="${idx}">${todo.text}</span>
            <button class="delete-btn" data-idx="${idx}" title="${translations[currentLang].deleteTitle}">&times;</button>
        `;
        todoList.appendChild(li);
    });
}

// Add
todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;
    const todos = getTodos();
    todos.push({ text, completed: false });
    saveTodos(todos);
    renderTodos();
    todoInput.value = '';
});

// Complete or delete
todoList.addEventListener('click', function(e) {
    const idx = e.target.getAttribute('data-idx');
    if (e.target.classList.contains('delete-btn')) {
        const todos = getTodos();
        todos.splice(idx, 1);
        saveTodos(todos);
        renderTodos();
    } else if (e.target.classList.contains('task')) {
        const todos = getTodos();
        todos[idx].completed = !todos[idx].completed;
        saveTodos(todos);
        renderTodos();
    }
});

// Clear all
clearBtn.addEventListener('click', function() {
    if (confirm(translations[currentLang].confirmClear)) {
        saveTodos([]);
        renderTodos();
    }
});

// Language switches
langAr.addEventListener('click', function() {
    if (currentLang !== 'ar') {
        currentLang = 'ar';
        localStorage.setItem('todo-lang', 'ar');
        updateLangUI();
    }
});
langEn.addEventListener('click', function() {
    if (currentLang !== 'en') {
        currentLang = 'en';
        localStorage.setItem('todo-lang', 'en');
        updateLangUI();
    }
});

// Init UI
updateLangUI();