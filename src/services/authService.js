const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { leerUsuarios, escribirUsuarios } = require('../database');
const { SECRET_KEY, TOKEN_EXPIRES_IN, BCRYPT_ROUNDS } = require('../config');

async function registrarUsuario(username, password) {
  const usuarios = await leerUsuarios();
  
  if (usuarios.find(u => u.username === username)) {
    return { error: 'El usuario ya existe' };
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
  usuarios.push({ id: Date.now(), username, password: hashedPassword });
  await escribirUsuarios(usuarios);
  
  return { mensaje: 'Usuario registrado exitosamente' };
}

async function iniciarSesion(username, password) {
  const usuarios = await leerUsuarios();
  const usuario = usuarios.find(u => u.username === username);

  if (!usuario) {
    return { error: 'Credenciales inválidas', status: 401 };
  }

  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) {
    return { error: 'Credenciales inválidas', status: 401 };
  }

  const token = jwt.sign(
    { id: usuario.id, username: usuario.username },
    SECRET_KEY,
    { expiresIn: TOKEN_EXPIRES_IN }
  );

  return { token };
}

module.exports = {
  registrarUsuario,
  iniciarSesion
};
