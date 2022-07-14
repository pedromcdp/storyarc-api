// Express Router
const router = require('express').Router();
// Controllers
const userController = require('../controllers/usersController');
// Middlewares
const authCheck = require('../middlewares/authCheck');

// GET REQUESTS
// Retorna todos os users
router.get('/getUsers', authCheck, userController.getAllUsers);
// Retorna user especifico
router.get('/:id', authCheck, userController.getUser);
// Retorna todos os Posts de um user
router.get('/:id/posts', authCheck, userController.getUserPosts);
// Retorna Posts guardados do user
router.get('/:id/savedPosts', authCheck, userController.getUserSavedPosts);
// Retorna Posts que o user gostou
router.get('/:id/likedPosts', authCheck, userController.getUserLikedPosts);
// Retorna Notificações do user
router.get(
  '/notifications/list',
  authCheck,
  userController.getUserNotifications,
);
// Retorna Numero de Notificações do user
router.get(
  '/notifications/count',
  authCheck,
  userController.getUserNotificationsLength,
);

// POST REQUESTS
// Adiciona um novo utilizador
router.post('/addUser', userController.createUser);
// Adiciona post aos savedPosts do user
router.post('/:id/addSavedPost', authCheck, userController.addPostToSavedPosts);
// Remove post dos savedPosts do user
router.post(
  '/:id/removeSavedPost',
  authCheck,
  userController.removePostFromSavedPosts,
);
// Gostar de uma publicação
router.post('/:id/like', authCheck, userController.likePost);
// Tira like de uma publicação
router.post('/:id/dislike', authCheck, userController.dislikePost);
// Envia notificação ao user com id especificado
router.post(
  '/:id/sendNotification',
  authCheck,
  userController.createNotification,
);

// DELETE REQUESTS
// Apaga um utilizador
router.delete('/:id', authCheck, userController.deleteUser);
// Apaga todas as notificações do user
router.delete(
  '/notifications/clear',
  authCheck,
  userController.deleteNotifications,
);
// apaga notificação se o user der dislike numa publicação
router.delete(
  '/notifications/remove/:id',
  authCheck,
  userController.deleteNotificationOnDislike,
);

// PUT REQUESTS
// Atualiza um utilizador
router.put('/:id', authCheck, userController.updateUser);
// Cria ou atualiza um utilizador
router.put('/', userController.createOrUpdateUser);

module.exports = router;
