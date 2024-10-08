const User = require('../models/User');
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {attachCookieToResponse,createTokenUser} = require('../utils')
const register = async (req,res)=>{
  const {email,name,password} = req.body;
  // checking for if the email is already existing
  const existingUser = await User.findOne({email})
  if(existingUser) throw new CustomError.BadRequestError('user already exists')
  // check if its the first user 
  const isFirstUser = await User.countDocuments({}) === 0;
  const role = isFirstUser? 'admin':'user';
  // create the user and send it
  const user = await User.create({email,name,password,role});
  // create token.
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({data:tokenUser,res:res})

  res.status(StatusCodes.CREATED).json({user:tokenUser})
}
const login = async(req,res)=>{
  const {email, password} = req.body
  if(!email || !password) throw new CustomError.BadRequestError('please provide email and password');
  const user = await User.findOne({email});
  if(!user) throw new CustomError.UnauthenticatedError('Invalid email.');
  const isCorrect =await user.comparePassword(password)
  if(!isCorrect) throw new CustomError.UnauthenticatedError('the password is not correct');
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({res:res,data:tokenUser})
  res.status(StatusCodes.CREATED).json({msg:'user logged in.'});
}

const logout = async (req,res)=>{
  res.cookie('token','sill string',{
    httpOnly:true,
    expires:new Date(Date.now() + 5 * 1000),
  })
  res.status(StatusCodes.OK).json({msg:'work'});
}

module.exports = {
  register,
  login,
  logout,
}