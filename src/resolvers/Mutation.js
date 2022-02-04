const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { TOKEN_SECRET } = require('../utils')

async function post(parent, args, context) {
  const { userId } = context

  const newLink = context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  })
  context.pubsub.publish('NEW_LINK', newLink)

  return newLink
}

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 12)
  const user = await context.prisma.user.create({ data: { ...args, password } })
  const token = jwt.sign({ userId: user.id }, TOKEN_SECRET)
  return { token, user }
}

async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({ where: { email: args.email } })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, TOKEN_SECRET)
  return { token, user }
}

module.exports = { post, signup, login }
