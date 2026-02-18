const { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea } = require('../services/tareasService');

async function getTareas(req, res, next) {
  try {
    const tareas = await obtenerTareas();
    res.json(tareas);
  } catch (error) {
    next(error);
  }
}

async function postTarea(req, res, next) {
  try {
    const { titulo, descripcion } = req.body;
    const nuevaTarea = await crearTarea(titulo, descripcion);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    next(error);
  }
}

async function putTarea(req, res, next) {
  try {
    const { id } = req.params;
    const { titulo, descripcion, completada } = req.body;
    const resultado = await actualizarTarea(id, { titulo, descripcion, completada });

    if (resultado.error) {
      return res.status(resultado.status).json({ error: resultado.error });
    }

    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

async function deleteTarea(req, res, next) {
  try {
    const { id } = req.params;
    const resultado = await eliminarTarea(id);

    if (resultado.error) {
      return res.status(resultado.status).json({ error: resultado.error });
    }

    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTareas,
  postTarea,
  putTarea,
  deleteTarea
};
