const express = require('express')
const router = express.Router();
const {
  authenticateUser,
  authorizePermission
} = require('../middleware/authentication')
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
} = require('../controllers/productController')
const {
  getAllProductReviews
} = require('../controllers/reviewController')
router
  .route('/')
  .post([authenticateUser,authorizePermission('admin')],createProduct)
  .get(getAllProducts);

router
  .route('/uploadImage')
  .post([authenticateUser,authorizePermission('admin')],uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser,authorizePermission('admin')],updateProduct)
  .delete([authenticateUser,authorizePermission('admin')],deleteProduct);

  router
  .route('/:id/reviews')
  .get(getAllProductReviews);
  
module.exports = router
