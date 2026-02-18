const API_URL = 'http://localhost:3000';
let token = localStorage.getItem('token');
let isRegisterMode = false;
let editingEntryId = null;

if (token) {
  showEntriesSection();
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
      showEntriesSection();
    }
  } catch (error) {
    document.getElementById('auth-error').textContent = 'Error de conexión';
  }
}

function showEntriesSection() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('entries-section').classList.remove('hidden');
  loadEntries();
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('entries-section').classList.add('hidden');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

async function loadEntries() {
  try {
    const res = await fetch(`${API_URL}/entradas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401) {
      logout();
      return;
    }
    const entradas = await res.json();
    renderEntries(entradas);
  } catch (error) {
    document.getElementById('entry-error').textContent = 'Error al cargar entradas';
  }
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderEntries(entradas) {
  const container = document.getElementById('entries-list');
  if (entradas.length === 0) {
    container.innerHTML = '<p class="empty-message">No hay entradas todavía. ¡Escribe tu primera entrada!</p>';
    return;
  }
  
  container.innerHTML = entradas.map(entrada => `
    <div class="entry">
      ${editingEntryId === entrada.id ? `
        <div class="edit-form">
          <input type="text" id="edit-titulo-${entrada.id}" value="${entrada.titulo}" placeholder="Título">
          <textarea id="edit-contenido-${entrada.id}" placeholder="Contenido">${entrada.contenido}</textarea>
          <input type="text" id="edit-etiquetas-${entrada.id}" value="${entrada.etiquetas.join(', ')}" placeholder="Etiquetas (separadas por coma)">
          <button onclick="editEntry(${entrada.id})">Guardar</button>
          <button class="secondary" onclick="showEditForm(${entrada.id})">Cancelar</button>
        </div>
      ` : `
        <div class="entry-header">
          <span class="entry-title">${entrada.titulo}</span>
          <div class="entry-actions">
            <button class="btn-edit" onclick="showEditForm(${entrada.id})">Editar</button>
            <button class="btn-delete" onclick="deleteEntry(${entrada.id})">Eliminar</button>
          </div>
        </div>
        <p class="entry-date">${formatDate(entrada.fecha)}</p>
        <p class="entry-content">${entrada.contenido}</p>
        ${entrada.etiquetas.length > 0 ? `
          <div class="entry-tags">
            ${entrada.etiquetas.map(tag => `<span class="tag">#${tag}</span>`).join('')}
          </div>
        ` : ''}
      `}
    </div>
  `).join('');
}

async function createEntry() {
  const titulo = document.getElementById('entry-title').value;
  const contenido = document.getElementById('entry-content').value;
  const etiquetasInput = document.getElementById('entry-tags').value;

  if (!titulo.trim() || !contenido.trim()) {
    document.getElementById('entry-error').textContent = 'El título y contenido son obligatorios';
    return;
  }

  const etiquetas = etiquetasInput.split(',').map(t => t.trim()).filter(t => t);

  try {
    const res = await fetch(`${API_URL}/entradas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, contenido, etiquetas })
    });

    if (res.ok) {
      document.getElementById('entry-title').value = '';
      document.getElementById('entry-content').value = '';
      document.getElementById('entry-tags').value = '';
      document.getElementById('entry-error').textContent = '';
      loadEntries();
    }
  } catch (error) {
    document.getElementById('entry-error').textContent = 'Error al crear entrada';
  }
}

async function deleteEntry(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar esta entrada?')) return;
  
  try {
    await fetch(`${API_URL}/entradas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadEntries();
  } catch (error) {
    document.getElementById('entry-error').textContent = 'Error al eliminar entrada';
  }
}

function showEditForm(id) {
  if (editingEntryId === id) {
    editingEntryId = null;
    loadEntries();
    return;
  }
  editingEntryId = id;
  loadEntries();
}

async function editEntry(id) {
  const titulo = document.getElementById(`edit-titulo-${id}`).value;
  const contenido = document.getElementById(`edit-contenido-${id}`).value;
  const etiquetasInput = document.getElementById(`edit-etiquetas-${id}`).value;

  if (!titulo.trim() || !contenido.trim()) {
    document.getElementById('entry-error').textContent = 'El título y contenido son obligatorios';
    return;
  }

  const etiquetas = etiquetasInput.split(',').map(t => t.trim()).filter(t => t);

  try {
    const res = await fetch(`${API_URL}/entradas/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, contenido, etiquetas })
    });

    if (res.ok) {
      editingEntryId = null;
      loadEntries();
    }
  } catch (error) {
    document.getElementById('entry-error').textContent = 'Error al editar entrada';
  }
}
