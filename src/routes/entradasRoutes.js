const express = require('express');
const router = express.Router();
const { getEntradas, postEntrada, putEntrada, deleteEntrada } = require('../controllers/entradasController');
const autenticacionMiddleware = require('../middleware/autenticacion');

router.get('/', autenticacionMiddleware, getEntradas);
router.post('/', autenticacionMiddleware, postEntrada);
router.put('/:id', autenticacionMiddleware, putEntrada);
router.delete('/:id', autenticacionMiddleware, deleteEntrada);

module.exports = router;
