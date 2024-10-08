const Product = require('../models/Product');
const {StatusCodes} = require('http-status-codes');
const CustomErrors = require('../errors')
const cloudinary = require('cloudinary')
const path = require('path')


const getAllProducts = async(req,res)=>{
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({products});
}
const getSingleProduct = async(req,res)=>{
  const {id} = req.params
  const product = await Product.findOne({_id:id}).populate('reviews')
  if(!product) throw new CustomErrors.BadRequestError(`there is no product match this ID: ${id}`)
  res.status(StatusCodes.OK).json({product});
}
const deleteProduct = async(req,res)=>{
  const {id:productId} = req.params;
  const product = await Product.findOne({_id:productId});
  if(!product)throw new CustomErrors.BadRequestError(`No product match this id: ${productId}`);
  await product.remove();
  res.status(StatusCodes.OK).json({msg:'deleted'});
}
const updateProduct = async(req,res)=>{
  const {id:productId} = req.params
  const updatedProduct = await Product.findOneAndUpdate({_id:productId},req.body,{runValidators:true, new:true})
  res.status(StatusCodes.OK).json({product:updatedProduct})
}
const createProduct = async(req,res)=>{
  req.body.user = req?.user?.id
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({product})
}

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomErrors.BadRequestError('No File Uploaded');
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
    );
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};



module.exports = {
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  createProduct,
  updateProduct,
  uploadImage
}