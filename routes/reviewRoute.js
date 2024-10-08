const express = require('express')
const router = express.Router();
const {authenticateUser} = require('../middleware/authentication')
const {
  createReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview
} = require('../controllers/reviewController')

router
  .route('/')
  .get(getAllReviews)
  .post(authenticateUser,createReview);
router
  .route('/:id')
  .get(getSingleReview)
  .delete(authenticateUser, deleteReview)
  .patch(authenticateUser, updateReview)



module.exports = router
