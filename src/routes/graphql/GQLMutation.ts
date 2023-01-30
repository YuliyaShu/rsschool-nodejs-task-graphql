import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from "fastify";
import { GraphQLObjectType } from "graphql";
import { IncomingMessage, ServerResponse } from "http";
import { UserGQLType } from "../users/types_GQL/UserGQLType";

export const GQLMutation = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>) => new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserGQLType,
    } 
  }
})
