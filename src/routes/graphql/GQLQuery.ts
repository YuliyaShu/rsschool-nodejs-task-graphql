import { FastifyInstance } from "fastify";
import { GraphQLObjectType } from "graphql";

export const GQLQuery = async (fastify: FastifyInstance) => new GraphQLObjectType({
  name: 'Query',
  fields: {

  }
})
