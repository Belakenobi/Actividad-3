const API_URL = 'http://localhost:3000';
let token = localStorage.getItem('token');
let isRegisterMode = false;
let editingTaskId = null;

if (token) {
  showTasksSection();
}

function toggleAuthMode() {
  isRegisterMode = !isRegisterMode;
  document.getElementById('auth-title').textContent = isRegisterMode ? 'Registrarse' : 'Iniciar Sesión';
  document.getElementById('auth-btn').textContent = isRegisterMode ? 'Registrarse' : 'Iniciar Sesión';
  document.getElementById('toggle-auth-btn').textContent = isRegisterMode ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate';
  document.getElementById('auth-error').textContent = '';
  document.getElementById('auth-success').textContent = '';
}

async function handleAuth() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const endpoint = isRegisterMode ? '/register' : '/login';

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      document.getElementById('auth-error').textContent = data.error;
      return;
    }

    if (isRegisterMode) {
      document.getElementById('auth-success').textContent = data.mensaje;
      isRegisterMode = false;
      toggleAuthMode();
    } else {
      token = data.token;
      localStorage.setItem('token', token);
      showTasksSection();
    }
  } catch (error) {
    document.getElementById('auth-error').textContent = 'Error de conexión';
  }
}

function showTasksSection() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('tasks-section').classList.remove('hidden');
  loadTasks();
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('tasks-section').classList.add('hidden');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

async function loadTasks() {
  try {
    const res = await fetch(`${API_URL}/tareas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401) {
      logout();
      return;
    }
    const tareas = await res.json();
    renderTasks(tareas);
  } catch (error) {
    document.getElementById('task-error').textContent = 'Error al cargar tareas';
  }
}

function renderTasks(tareas) {
  const container = document.getElementById('tasks-list');
  container.innerHTML = tareas.map(tarea => `
    <div class="task ${tarea.completada ? 'completed' : ''}">
      ${editingTaskId === tarea.id ? `
        <div class="edit-form">
          <input type="text" id="edit-titulo-${tarea.id}" value="${tarea.titulo}" placeholder="Título">
          <input type="text" id="edit-desc-${tarea.id}" value="${tarea.descripcion || ''}" placeholder="Descripción">
          <button onclick="editTask(${tarea.id})">Guardar</button>
          <button class="secondary" onclick="showEditForm(${tarea.id})">Cancelar</button>
        </div>
      ` : `
        <div class="task-header">
          <span class="task-title">${tarea.titulo}</span>
          <div class="task-actions">
            <button class="btn-toggle" onclick="toggleTask(${tarea.id})">${tarea.completada ? 'Deshacer' : 'Completar'}</button>
            <button class="btn-edit" onclick="showEditForm(${tarea.id})">Editar</button>
            <button class="btn-delete" onclick="deleteTask(${tarea.id})">Eliminar</button>
          </div>
        </div>
        ${tarea.descripcion ? `<p>${tarea.descripcion}</p>` : ''}
      `}
    </div>
  `).join('');
}

async function createTask() {
  const titulo = document.getElementById('task-title').value;
  const descripcion = document.getElementById('task-desc').value;

  if (!titulo.trim()) {
    document.getElementById('task-error').textContent = 'El título es obligatorio';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/tareas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, descripcion })
    });

    if (res.ok) {
      document.getElementById('task-title').value = '';
      document.getElementById('task-desc').value = '';
      document.getElementById('task-error').textContent = '';
      loadTasks();
    }
  } catch (error) {
    document.getElementById('task-error').textContent = 'Error al crear tarea';
  }
}

async function toggleTask(id) {
  try {
    const res = await fetch(`${API_URL}/tareas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tareas = await res.json();
    const tarea = tareas.find(t => t.id === id);

    await fetch(`${API_URL}/tareas/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completada: !tarea.completada })
    });
    loadTasks();
  } catch (error) {
    document.getElementById('task-error').textContent = 'Error al actualizar tarea';
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/tareas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadTasks();
  } catch (error) {
    document.getElementById('task-error').textContent = 'Error al eliminar tarea';
  }
}

function showEditForm(id) {
  if (editingTaskId === id) {
    editingTaskId = null;
    loadTasks();
    return;
  }
  editingTaskId = id;
  loadTasks();
}

async function editTask(id) {
  const titulo = document.getElementById(`edit-titulo-${id}`).value;
  const descripcion = document.getElementById(`edit-desc-${id}`).value;

  if (!titulo.trim()) {
    document.getElementById('task-error').textContent = 'El título es obligatorio';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/tareas/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, descripcion })
    });

    if (res.ok) {
      editingTaskId = null;
      loadTasks();
    }
  } catch (error) {
    document.getElementById('task-error').textContent = 'Error al editar tarea';
  }
}
