const { obtenerEntradas, crearEntrada, actualizarEntrada, eliminarEntrada } = require('../services/entradasService');

async function getEntradas(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const entradas = await obtenerEntradas(usuarioId);
    res.json(entradas);
  } catch (error) {
    next(error);
  }
}

async function postEntrada(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const { titulo, contenido, etiquetas } = req.body;
    const nuevaEntrada = await crearEntrada(usuarioId, titulo, contenido, etiquetas);
    res.status(201).json(nuevaEntrada);
  } catch (error) {
    next(error);
  }
}

async function putEntrada(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;
    const { titulo, contenido, etiquetas } = req.body;
    const resultado = await actualizarEntrada(id, usuarioId, { titulo, contenido, etiquetas });

    if (resultado.error) {
      return res.status(resultado.status).json({ error: resultado.error });
    }

    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

async function deleteEntrada(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;
    const resultado = await eliminarEntrada(id, usuarioId);

    if (resultado.error) {
      return res.status(resultado.status).json({ error: resultado.error });
    }

    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEntradas,
  postEntrada,
  putEntrada,
  deleteEntrada
};
