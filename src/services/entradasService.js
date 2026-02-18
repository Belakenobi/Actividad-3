const { leerEntradas, escribirEntradas } = require('../database');

async function obtenerEntradas(usuarioId) {
  const entradas = await leerEntradas();
  return entradas.filter(e => e.usuarioId === usuarioId).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

async function obtenerEntradaPorId(id, usuarioId) {
  const entradas = await leerEntradas();
  return entradas.find(e => e.id === parseInt(id) && e.usuarioId === usuarioId);
}

async function crearEntrada(usuarioId, titulo, contenido, etiquetas) {
  const entradas = await leerEntradas();
  const nuevaEntrada = {
    id: Date.now(),
    usuarioId,
    titulo: titulo.trim(),
    contenido: contenido.trim(),
    etiquetas: etiquetas ? etiquetas.map(e => e.trim().toLowerCase()).filter(e => e) : [],
    fecha: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  entradas.push(nuevaEntrada);
  await escribirEntradas(entradas);
  return nuevaEntrada;
}

async function actualizarEntrada(id, usuarioId, datos) {
  const entradas = await leerEntradas();
  const indice = entradas.findIndex(e => e.id === parseInt(id) && e.usuarioId === usuarioId);

  if (indice === -1) {
    return { error: 'Entrada no encontrada', status: 404 };
  }

  if (datos.titulo !== undefined) entradas[indice].titulo = datos.titulo.trim();
  if (datos.contenido !== undefined) entradas[indice].contenido = datos.contenido.trim();
  if (datos.etiquetas !== undefined) {
    entradas[indice].etiquetas = datos.etiquetas.map(e => e.trim().toLowerCase()).filter(e => e);
  }

  await escribirEntradas(entradas);
  return entradas[indice];
}

async function eliminarEntrada(id, usuarioId) {
  const entradas = await leerEntradas();
  const indice = entradas.findIndex(e => e.id === parseInt(id) && e.usuarioId === usuarioId);

  if (indice === -1) {
    return { error: 'Entrada no encontrada', status: 404 };
  }

  const entradaEliminada = entradas.splice(indice, 1)[0];
  await escribirEntradas(entradas);
  return { mensaje: 'Entrada eliminada', entrada: entradaEliminada };
}

module.exports = {
  obtenerEntradas,
  obtenerEntradaPorId,
  crearEntrada,
  actualizarEntrada,
  eliminarEntrada
};
