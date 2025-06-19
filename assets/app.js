// عناصر الصفحة
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const clearBtn = document.getElementById('clear-btn');
const appTitle = document.getElementById('app-title');
const addBtn = document.getElementById('add-btn');
const langAr = document.getElementById('lang-ar');
const langEn = document.getElementById('lang-en');
const yearSpan = document.getElementById('year');

// إعداد اللغة
let currentLang = localStorage.getItem('todo-lang') || 'ar';
function updateLangUI() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = LANGS[currentLang].dir;
    appTitle.textContent = LANGS[currentLang].title;
    todoInput.placeholder = LANGS[currentLang].placeholder;
    addBtn.textContent = LANGS[currentLang].add;
    clearBtn.textContent = LANGS[currentLang].clear;
    langAr.classList.toggle('active', currentLang === 'ar');
    langEn.classList.toggle('active', currentLang === 'en');
    renderTodos(); // تحديث أزرار الحذف
}
if (langAr && langEn) {
    langAr.addEventListener('click', () => {
        if (currentLang !== 'ar') {
            currentLang = 'ar';
            localStorage.setItem('todo-lang', 'ar');
            updateLangUI();
        }
    });
    langEn.addEventListener('click', () => {
        if (currentLang !== 'en') {
            currentLang = 'en';
            localStorage.setItem('todo-lang', 'en');
            updateLangUI();
        }
    });
}

// إدارة المهام
function getTodos() {
    return JSON.parse(localStorage.getItem('todos') || '[]');
}
function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function renderTodos() {
    const todos = getTodos();
    todoList.innerHTML = '';
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <span class="task" data-idx="${idx}" tabindex="0">${todo.text}</span>
            <button class="delete-btn" data-idx="${idx}" title="${LANGS[currentLang].deleteTitle}">&times;</button>
        `;
        todoList.appendChild(li);
    });
}
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
todoList.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('task') && (e.key === 'Enter' || e.key === ' ')) {
        const idx = e.target.getAttribute('data-idx');
        const todos = getTodos();
        todos[idx].completed = !todos[idx].completed;
        saveTodos(todos);
        renderTodos();
    }
});
clearBtn.addEventListener('click', function() {
    if (confirm(LANGS[currentLang].confirmClear)) {
        saveTodos([]);
        renderTodos();
    }
});

// تحديث السنة تلقائياً في الفوتر
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// أول تحميل
updateLangUI();