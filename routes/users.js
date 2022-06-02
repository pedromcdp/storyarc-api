// Express Router
const router = require('express').Router();
// Controllers
const userController = require('../controllers/usersController');

// GET REQUESTS
// Retorna todos os users
router.get('/', userController.getAllUsers);
// Retorna user especifico
router.get('/:id', userController.getUser);
// Retorna todos os Posts de um user
router.get('/:id/posts', userController.getUserPosts);
// Retorna Posts guardados do user
router.get('/:id/savedPosts', userController.getUserSavedPosts);

// POST REQUESTS
// Adiciona um novo utilizador
router.post('/addUser', userController.createUser);
// Adiciona post aos savedPosts do user
router.post('/:id/addSavedPost', userController.addPostToSavedPosts);

// DELETE REQUESTS
// Apaga um utilizador
router.delete('/:id', userController.deleteUser);

// PUT REQUESTS
// Atualiza um utilizador
router.put('/:id', userController.updateUser)

module.exports = router;
