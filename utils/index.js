const {createJWT,isTokenValid, attachCookieToResponse} = require('./JWT');
const createTokenUser = require('./CreateTokenUser')
const checkPermission = require('./checkPermission')
module.exports ={
  createJWT,
  isTokenValid,
  attachCookieToResponse,
  createTokenUser,
  checkPermission
}