const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validarAuth } = require('../middleware/validacion');

router.post('/register', validarAuth, register);
router.post('/login', validarAuth, login);

module.exports = router;
