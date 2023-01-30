import { FastifyInstance } from "fastify";
import { GraphQLObjectType } from "graphql";

export const GQLMutation = async (fastify: FastifyInstance) => new GraphQLObjectType({
  name: 'Mutation',
  fields: {

  }
})
