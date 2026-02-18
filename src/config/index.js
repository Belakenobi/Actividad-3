module.exports = {
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY || 'mi_secreto_super_seguro',
  TOKEN_EXPIRES_IN: '1h',
  BCRYPT_ROUNDS: 10
};
