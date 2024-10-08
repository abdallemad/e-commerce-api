const Review = require('../models/Review');
const {StatusCodes} = require('http-status-codes');
const CustomErrors = require('../errors')
const {checkPermission} = require('../utils');
const Product = require('../models/Product');

const createReview = async(req,res)=>{
  const {product:productId} = req.body

  const isValidId = await Product.findById(productId);
  if(!isValidId) throw new CustomErrors.BadRequestError(`no product matches this id: ${productId}`)
  
  const alreadyExists = await Review.findOne({user:req.user.id,product:productId})
  if(alreadyExists) throw new CustomErrors.BadRequestError('there is already review on this product');

  req.body.user = req.user.id;
  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json({review});
}
const getAllReviews = async(req,res)=>{
  const reviews = await Review.find({})
    .populate({
      path:'product',
      select:'name price company' 
    })
  res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}
const getSingleReview = async(req,res)=>{
  const {id:reviewId} = req.params;
  const review = await Review.findOne({_id:reviewId})
  if(!review) throw new CustomErrors.NotFoundError(`no review with id: ${reviewId}`)
  res.status(StatusCodes.OK).json({review})
}
const updateReview = async (req,res)=>{
  const {id:reviewId} = req.params
  const {rating,title,comment} = req.body;
  if(!rating || !title || !comment) throw new CustomErrors.BadRequestError('please provide all values title, rating and comment')
  const review = await Review.findById(reviewId) 
  if(!review) throw new CustomErrors.NotFoundError(`no review match this id: ${reviewId}`)

  review.rating = rating;
  review.title = title;
  review.comment = comment
  await review.save()
  res.status(StatusCodes.OK).json({review})
}
const deleteReview = async(req,res)=>{
  const {id:reviewId} = req.params
  const review = await Review.findById(reviewId);
  checkPermission(req.user,review.user)
  if(!review) throw new CustomErrors.NotFoundError(`there is no review match this id: ${reviewId}`)
  
  await review.remove()
  res.status(StatusCodes.OK).json({msg:'review deleted'});
}
const getAllProductReviews = async(req,res)=>{
  const {id} = req.params;
  const reviews = await Review.find({product:id})
  res.status(StatusCodes.OK).json({reviews,count:reviews.length});
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getAllProductReviews
}
