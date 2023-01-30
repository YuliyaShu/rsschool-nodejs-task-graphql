import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from "fastify";
import { GraphQLID, GraphQLList, GraphQLObjectType } from "graphql";
import { IncomingMessage, ServerResponse } from "http";
import { getAllMemberTypes } from "../member-types/helperFunctions/getAllMemberTypes";
import { getMemberTypeById } from "../member-types/helperFunctions/getMemberTypeById";
import { MemberGQLType } from "../member-types/types_GQL/MemberGQLType";
import { getAllPosts } from "../posts/helperFunctions/getAllPosts";
import { getPostById } from "../posts/helperFunctions/getPostById";
import { PostGQLType } from "../posts/types_GQL/PostGQLType";
import { getAllProfiles } from "../profiles/helperFunctions/getAllProfiles";
import { getProfileById } from "../profiles/helperFunctions/getProfileById";
import { ProfileGQLType } from "../profiles/types_GQL/ProfileGQLType";
import { getAllUsers } from "../users/helperFunctions/getAllUsers";
import { getUserById } from "../users/helperFunctions/getUserById";
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
      resolve: async (_, args) => await getUserById(fastify, args.id),
    },
    profile: {
      type: ProfileGQLType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, args) => await getProfileById(fastify, args.id),
    },
    post: {
      type: PostGQLType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, args) => await getPostById(fastify, args.id),
    },
    memberType: {
      type: MemberGQLType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, args) => await getMemberTypeById(fastify, args.id),
    }
  }
})
