const fs = require('fs').promises;
const path = require('path');

const TAREAS_FILE = path.join(__dirname, 'tareas.json');
const ENTRADAS_FILE = path.join(__dirname, 'entradas.json');
const USUARIOS_FILE = path.join(__dirname, 'usuarios.json');

async function inicializarArchivos() {
  try {
    await fs.access(TAREAS_FILE);
  } catch {
    await fs.writeFile(TAREAS_FILE, JSON.stringify([]));
  }
  try {
    await fs.access(ENTRADAS_FILE);
  } catch {
    await fs.writeFile(ENTRADAS_FILE, JSON.stringify([]));
  }
  try {
    await fs.access(USUARIOS_FILE);
  } catch {
    await fs.writeFile(USUARIOS_FILE, JSON.stringify([]));
  }
}

async function leerTareas() {
  const data = await fs.readFile(TAREAS_FILE, 'utf-8');
  return JSON.parse(data);
}

async function escribirTareas(tareas) {
  await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));
}

async function leerEntradas() {
  const data = await fs.readFile(ENTRADAS_FILE, 'utf-8');
  return JSON.parse(data);
}

async function escribirEntradas(entradas) {
  await fs.writeFile(ENTRADAS_FILE, JSON.stringify(entradas, null, 2));
}

async function leerUsuarios() {
  const data = await fs.readFile(USUARIOS_FILE, 'utf-8');
  return JSON.parse(data);
}

async function escribirUsuarios(usuarios) {
  await fs.writeFile(USUARIOS_FILE, JSON.stringify(usuarios, null, 2));
}

module.exports = {
  inicializarArchivos,
  leerTareas,
  escribirTareas,
  leerEntradas,
  escribirEntradas,
  leerUsuarios,
  escribirUsuarios
};
