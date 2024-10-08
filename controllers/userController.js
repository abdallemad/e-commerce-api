const { StatusCodes } = require("http-status-codes")
const CustomErrors = require('../errors')
const User = require("../models/User")
const {createTokenUser, attachCookieToResponse, checkPermission} = require('../utils')

const getAllUsers= async(req,res)=>{
  const users = await User.find({role:'user'}).select('-password')
  res.status(StatusCodes.OK).json({users})
}
const getSingleUsers= async(req,res)=>{
  const {id} = req.params
  const user = await User.findOne({_id:id}).select('-password');
  if(!user) throw new CustomErrors.NotFoundError(`no user match this id: ${id}`)
  
  checkPermission(req.user,user._id);
  res.status(StatusCodes.OK).json({user})
}
const showCurrentUser= async(req,res)=>{
  res.status(StatusCodes.OK).json({user:req.user});
}
const updateUser= async(req,res)=>{
  const {id} = req.user
  const {name,email} = req.body;
  if(!name || !email) throw new CustomErrors.BadRequestError('please provide all values');
  const user = await User.findOne({_id:id});
  user.name = name
  user.email = email
  const newUser = await user.save()
  const tokenUser = createTokenUser(newUser);
  attachCookieToResponse({res:res,data:tokenUser});
  res.status(StatusCodes.OK).json({user:tokenUser})
}
const updateUserPassword= async(req,res)=>{
  // check for values
  const {oldPassword,newPassword} = req.body
  if(!oldPassword || !newPassword) throw new CustomErrors.BadRequestError('please provide both values');
  const user = await User.findOne({_id:req.user.id});
  // check for old password
  const isMatch =await user.comparePassword(oldPassword);
  if(!isMatch) throw new CustomErrors.UnauthenticatedError('invalid credentials');
  // update password
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({msg:'updated'});
}
module.exports = {
  getAllUsers,
  getSingleUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}