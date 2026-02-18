function validarTarea(req, res, next) {
  const { titulo, descripcion } = req.body;
  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  if (descripcion && typeof descripcion !== 'string') {
    return res.status(400).json({ error: 'La descripción debe ser texto' });
  }
  next();
}

function validarAuth(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }
  next();
}

module.exports = {
  validarTarea,
  validarAuth
};
