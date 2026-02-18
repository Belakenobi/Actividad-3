const express = require('express');
const router = express.Router();
const { getTareas, postTarea, putTarea, deleteTarea } = require('../controllers/tareasController');
const autenticacionMiddleware = require('../middleware/autenticacion');
const { validarTarea } = require('../middleware/validacion');

router.get('/', autenticacionMiddleware, getTareas);
router.post('/', autenticacionMiddleware, validarTarea, postTarea);
router.put('/:id', autenticacionMiddleware, putTarea);
router.delete('/:id', autenticacionMiddleware, deleteTarea);

module.exports = router;
