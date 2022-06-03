// Express Router
const router = require('express').Router();
// Controllers
const postsController = require('../controllers/postsController');

// GET REQUESTS
// Retorna todos os comentários
router.get('/', postsController.getAllComments);
// Retorna comentário especifico
router.get('/:id', postsController.getComment);

// PUT REQUESTS
// Atualiza comentário
router.put('/:id', postsController.updateComment);

// DELETE REQUESTS
// Apaga comentário
router.delete('/:id', postsController.deleteComment);

module.exports = router;
