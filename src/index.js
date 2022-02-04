const fs = require('fs')
const path = require('path')
const { ApolloServer } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (_, __, context) => context.prisma.link.findMany(),
  },

  Mutation: {
    post: async (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },
  },

  Link: {
    id: (parent) => parent.id,
    url: (parent) => parent.url,
    description: (parent) => parent.description,
  },
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: {
    prisma,
  },
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
