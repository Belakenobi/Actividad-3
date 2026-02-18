function errorMiddleware(err, req, res, next) {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = errorMiddleware;
