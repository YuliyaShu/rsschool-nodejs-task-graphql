import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from "fastify";
import { GraphQLObjectType } from "graphql";
import { IncomingMessage, ServerResponse } from "http";
import { createPost } from "../posts/helperFunctions/createPost";
import { CreatePostGQLType } from "../posts/types_GQL/CreatePostGQLType";
import { PostGQLType } from "../posts/types_GQL/PostGQLType";
import { createProfile } from "../profiles/helperFunctions/createProfile";
import { CreateProfileGQLType } from "../profiles/types_GQL/CreateProfileGQLType";
import { ProfileGQLType } from "../profiles/types_GQL/ProfileGQLType";
import { createUser } from "../users/helperFunctions/createUser";
import { CreateUserGQLType } from "../users/types_GQL/CreateUserGQLType";
import { UserGQLType } from "../users/types_GQL/UserGQLType";

export const GQLMutation = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>) => new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserGQLType,
      args: { input: {type: CreateUserGQLType}},
      resolve: async (_, args) => await createUser(fastify, args.input),
    },
    createProfile: {
      type: ProfileGQLType,
      args: { input: {type: CreateProfileGQLType}},
      resolve: async (_, args) => await createProfile(fastify, args.input),
    },
    createPost: {
      type: PostGQLType,
      args: { input: {type: CreatePostGQLType}},
      resolve: async (_, args) => await createPost(fastify, args.input),
    },
  }
})
