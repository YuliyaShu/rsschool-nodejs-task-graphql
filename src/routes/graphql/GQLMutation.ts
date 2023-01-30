import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from "fastify";
import { GraphQLObjectType } from "graphql";
import { IncomingMessage, ServerResponse } from "http";
import { updateMemberType } from "../member-types/helperFunctions/updateMemberType";
import { MemberGQLType } from "../member-types/types_GQL/MemberGQLType";
import { UpdateMemberGQLType } from "../member-types/types_GQL/UpdateMemberGQLType";
import { createPost } from "../posts/helperFunctions/createPost";
import { updatePost } from "../posts/helperFunctions/updatePost";
import { CreatePostGQLType } from "../posts/types_GQL/CreatePostGQLType";
import { PostGQLType } from "../posts/types_GQL/PostGQLType";
import { UpdatePostGQLType } from "../posts/types_GQL/UpdatePostGQLType";
import { createProfile } from "../profiles/helperFunctions/createProfile";
import { updateProfile } from "../profiles/helperFunctions/updateProfile";
import { CreateProfileGQLType } from "../profiles/types_GQL/CreateProfileGQLType";
import { ProfileGQLType } from "../profiles/types_GQL/ProfileGQLType";
import { UpdateProfileGQLType } from "../profiles/types_GQL/UpdateProfileGQLType";
import { createUser } from "../users/helperFunctions/createUser";
import { subscribeToUser } from "../users/helperFunctions/subscribeToUser";
import { unSubscribeFromUser } from "../users/helperFunctions/unSubscribeFromUser";
import { updateUser } from "../users/helperFunctions/updateUser";
import { CreateUserGQLType } from "../users/types_GQL/CreateUserGQLType";
import { SubscribeUserGQLType } from "../users/types_GQL/SubscribeUserGQLType";
import { UnsubscribeUserGQLType } from "../users/types_GQL/UnsubscribeUserGQLType";
import { UpdateUserGQLType } from "../users/types_GQL/UpdateUserGQLType";
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

    updateUser: {
      type: UserGQLType,
      args: { input: {type: UpdateUserGQLType}},
      resolve: async (_, args) => await updateUser(fastify,args.input.id, args.input),
    },
    updateProfile: {
      type: ProfileGQLType,
      args: { input: {type: UpdateProfileGQLType}},
      resolve: async (_, args) => await updateProfile(fastify, args.input.id, args.input),
    },
    updatePost: {
      type: PostGQLType,
      args: { input: {type: UpdatePostGQLType}},
      resolve: async (_, args) => await updatePost(fastify, args.input.id, args.input),
    },
    updateMemberType: {
      type: MemberGQLType,
      args: { input: {type: UpdateMemberGQLType}},
      resolve: async (_, args) => await updateMemberType(fastify, args.input.id, args.input),
    },

    subscribeToUser: {
      type: UserGQLType,
      args: { input: {type: SubscribeUserGQLType}},
      resolve: async (_, args) => await subscribeToUser(fastify, args.input.id, args.input.userId),
    },

    unSubscribeFromUser: {
      type: UserGQLType,
      args: { input: {type: UnsubscribeUserGQLType}},
      resolve: async (_, args) => await unSubscribeFromUser(fastify, args.input.id, args.input.userId),
    },
  }
})
