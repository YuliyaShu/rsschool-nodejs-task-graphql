import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import { MemberGQLType } from "../../member-types/types_GQL/MemberGQLType";
import { PostGQLType } from "../../posts/types_GQL/PostGQLType";
import { ProfileGQLType } from "../../profiles/types_GQL/ProfileGQLType";

export const UserGQLType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: ProfileGQLType,
      resolve: async (user: UserEntity, _, fastify: FastifyInstance) => await fastify.db.profiles.findOne({ key: 'userId', equals: user.id })
    },
    posts: {
      type: new GraphQLList(PostGQLType),
      resolve: async (user: UserEntity, _, fastify: FastifyInstance) => await fastify.db.posts.findMany({ key: 'userId', equals: user.id })
    },
    memberType: {
      type: MemberGQLType,
      resolve: async (user: UserEntity, _, fastify: FastifyInstance) => {
        const userProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: user.id });
        if (!userProfile) return null;
        return fastify.db.memberTypes.findOne({ key: 'id', equals: userProfile.memberTypeId });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserGQLType),
      resolve: async (user: UserEntity, _, fastify: FastifyInstance) => user.subscribedToUserIds,
    },
    subscribedToUser: {
      type: new GraphQLList(UserGQLType),
      resolve: async (user: UserEntity, _, fastify: FastifyInstance) => await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: user.id }),
    },
  }),
})
