const jwt = require('jsonwebtoken')

const TOKEN_SECRET = 'access_token_super_secret ^)'

function getTokenPayload(token) {
  return jwt.verify(token, TOKEN_SECRET)
}

function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      if (!token) {
        throw new Error('No token found')
      }
      const { userId } = getTokenPayload(token)
      return userId
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken)
    return userId
  }

  throw new Error('Not authenticated')
}

module.exports = {
  TOKEN_SECRET,
  getUserId,
}
