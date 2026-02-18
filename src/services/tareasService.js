const { leerTareas, escribirTareas } = require('../database');

async function obtenerTareas() {
  return await leerTareas();
}

async function crearTarea(titulo, descripcion) {
  const tareas = await leerTareas();
  const nuevaTarea = {
    id: Date.now(),
    titulo: titulo.trim(),
    descripcion: descripcion ? descripcion.trim() : '',
    completada: false,
    createdAt: new Date().toISOString()
  };
  tareas.push(nuevaTarea);
  await escribirTareas(tareas);
  return nuevaTarea;
}

async function actualizarTarea(id, datos) {
  const tareas = await leerTareas();
  const indice = tareas.findIndex(t => t.id === parseInt(id));

  if (indice === -1) {
    return { error: 'Tarea no encontrada', status: 404 };
  }

  if (datos.titulo !== undefined) tareas[indice].titulo = datos.titulo.trim();
  if (datos.descripcion !== undefined) tareas[indice].descripcion = datos.descripcion.trim();
  if (datos.completada !== undefined) tareas[indice].completada = datos.completada;

  await escribirTareas(tareas);
  return tareas[indice];
}

async function eliminarTarea(id) {
  const tareas = await leerTareas();
  const indice = tareas.findIndex(t => t.id === parseInt(id));

  if (indice === -1) {
    return { error: 'Tarea no encontrada', status: 404 };
  }

  const tareaEliminada = tareas.splice(indice, 1)[0];
  await escribirTareas(tareas);
  return { mensaje: 'Tarea eliminada', tarea: tareaEliminada };
}

module.exports = {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
};
