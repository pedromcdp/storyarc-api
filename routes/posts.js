// Express Router
const router = require('express').Router();
// Controllers
const postsController = require('../controllers/postsController');

// GET REQUESTS
// Retorna todos os posts
router.get('/', postsController.getAllPosts);
// Retorna post ordenados por data de criação mais recente
router.get('/latest', postsController.getLatestPosts);
// Retorna post com mais comentários
router.get('/trending', postsController.getTrendingPosts);
// Retorna um post especifico
router.get('/:id', postsController.getPost);
// Retorna comentarios de um post
router.get('/:id/comments', postsController.getPostComments);

// POST REQUESTS
// Cria um novo post
router.post('/addPost', postsController.createPost);
// Adiciona comentário a um post
router.post('/:id/addComment', postsController.addComment);

// DELETE REQUESTS
// Apaga um post especifico
router.delete('/:id', postsController.deletePost);

//PUT REQUESTS
// Atualiza um post especifico
router.put('/:id', postsController.updatePost);

module.exports = router;
