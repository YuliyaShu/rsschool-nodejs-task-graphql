import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from "fastify";
import { GraphQLID, GraphQLList, GraphQLObjectType } from "graphql";
import { IncomingMessage, ServerResponse } from "http";
import { getAllMemberTypes } from "../member-types/helperFunctions/getAllMemberTypes";
import { MemberGQLType } from "../member-types/types_GQL/MemberGQLType";
import { getAllPosts } from "../posts/helperFunctions/getAllPosts";
import { PostGQLType } from "../posts/types_GQL/PostGQLType";
import { getAllProfiles } from "../profiles/helperFunctions/getAllProfiles";
import { ProfileGQLType } from "../profiles/types_GQL/ProfileGQLType";
import { getAllUsers } from "../users/helperFunctions/getAllUsers";
import { UserGQLType } from "../users/types_GQL/UserGQLType";

export const GQLQuery = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>) => new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserGQLType),
      resolve: async () => await getAllUsers(fastify),
    },
    profiles: {
      type: new GraphQLList(ProfileGQLType),
      resolve: async () => await getAllProfiles(fastify),
    },
    posts: {
      type: new GraphQLList(PostGQLType),
      resolve: async () => await getAllPosts(fastify),
    },
    memberTypes: {
      type: new GraphQLList(MemberGQLType),
      resolve: async () => await getAllMemberTypes(fastify),
    },
    user: {
      type: UserGQLType,
      args: { id: { type: GraphQLID } },
    },
    profile: {
      type: PostGQLType,
      args: { id: { type: GraphQLID } },
    },
    post: {
      type: PostGQLType,
      args: { id: { type: GraphQLID } },
    },
    memberType: {
      type: MemberGQLType,
      args: { id: { type: GraphQLID } },
    }
  }
})
