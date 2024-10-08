const express = require('express');
const router = express.Router();
const {authenticateUser, authorizePermission} = require('../middleware/authentication')
const {
  getAllUsers,
  getSingleUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/userController');
const {
  getAllUserReviews
} = require('../controllers/reviewController')

router
  .route('/')
  .get(authenticateUser,authorizePermission('admin'),getAllUsers);

router
  .route('/showMe')
  .get(authenticateUser, showCurrentUser);
router
  .route('/updateUser')
  .patch(authenticateUser, updateUser);

router
  .route('/updateUserPassword')
  .patch(authenticateUser,updateUserPassword);
// when dealing with parameter you should make it at the end to avoid
router
  .route('/:id')
  .get(authenticateUser, getSingleUsers);

router
  .route('/:id/reviews')
  .get(authenticateUser, getAllUserReviews)

module.exports = router