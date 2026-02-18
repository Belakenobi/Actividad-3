const { registrarUsuario, iniciarSesion } = require('../services/authService');

async function register(req, res, next) {
  try {
    const { username, password } = req.body;
    const resultado = await registrarUsuario(username, password);

    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }

    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const resultado = await iniciarSesion(username, password);

    if (resultado.error) {
      return res.status(resultado.status).json({ error: resultado.error });
    }

    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
};
