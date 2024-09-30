const { StatusCodes } = require("http-status-codes")
const CustomErrors = require('../errors')
const User = require("../models/User")


const getAllUsers= async(req,res)=>{
  const users = await User.find({role:'user'}).select('-password')
  res.status(StatusCodes.OK).json({users})
}
const getSingleUsers= async(req,res)=>{
  const {id} = req.params
  const user = await User.findOne({_id:id}).select('-password');
  if(!user) throw new CustomErrors.NotFoundError(`no user match this id: ${id}`)
  res.status(StatusCodes.OK).json({user})
}
const showCurrentUser= async(req,res)=>{
  res.send('show me')
}
const updateUser= async(req,res)=>{

}
const updateUserPassword= async(req,res)=>{

}
module.exports = {
  getAllUsers,
  getSingleUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}