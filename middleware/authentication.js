const {isTokenValid} = require('../utils')
const CustomErrors = require('../errors')

const authenticateUser = async (req,res,next)=>{
  const token = req.signedCookies?.token || ''
  if(!token) throw new CustomErrors.UnauthenticatedError('Authenticated invalid');
  try {
    const decoded = isTokenValid({token})
    req.user = {name:decoded.name,id:decoded.id,role:decoded.role}
    next();
  } catch (error) {
    throw new CustomErrors.UnauthenticatedError('Authenticated invalid')
  }
}

const authorizePermission =(...role)=> async(req,res,next)=>{
  if(! (role.includes(req.user.role))) throw new CustomErrors.UnauthorizedError('access forbidden');
  next();
}

module.exports = {authenticateUser, authorizePermission}