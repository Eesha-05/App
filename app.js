let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

const list = document.getElementById('taskList');
const input = document.getElementById('taskInput');
const priority = document.getElementById('priority');
const empty = document.getElementById('empty');
const countEl = document.getElementById('count');

function save() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

function render() {
  list.innerHTML = '';
  const filtered = tasks.filter(t =>
    currentFilter === 'all' ? true :
    currentFilter === 'active' ? !t.done : t.done
  );

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item' + (t.done ? ' done' : '');

    li.innerHTML = `
      <input type="checkbox" ${t.done ? 'checked' : ''} data-id="${t.id}">
      <span class="dot ${t.priority}"></span>
      <span class="task-text">${t.text}</span>
      <button class="del-btn" data-id="${t.id}" title="Delete">✕</button>
    `;
    list.appendChild(li);
  });

  const active = tasks.filter(t => !t.done).length;
  countEl.textContent = `${active} task${active !== 1 ? 's' : ''} left`;
  empty.classList.toggle('show', filtered.length === 0);
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now(), text, priority: priority.value, done: false });
  input.value = '';
  save(); render();
}

document.getElementById('addBtn').addEventListener('click', addTask);
input.addEventListener('keydown', e => e.key === 'Enter' && addTask());

list.addEventListener('change', e => {
  if (e.target.type === 'checkbox') {
    const t = tasks.find(t => t.id == e.target.dataset.id);
    if (t) { t.done = e.target.checked; save(); render(); }
  }
});

list.addEventListener('click', e => {
  if (e.target.classList.contains('del-btn')) {
    tasks = tasks.filter(t => t.id != e.target.dataset.id);
    save(); render();
  }
});

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

document.getElementById('clearDone').addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save(); render();
});

render();
