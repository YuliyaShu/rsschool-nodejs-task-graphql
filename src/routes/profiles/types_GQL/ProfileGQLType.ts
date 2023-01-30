import { FastifyInstance } from "fastify";
import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } from "graphql";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { MemberGQLType } from "../../member-types/types_GQL/MemberGQLType";

export const ProfileGQLType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLID },    
    memberTypeId: {
      type: MemberGQLType,
      async resolve(parent: ProfileEntity, _, fastify: FastifyInstance) {
        return await fastify.db.memberTypes.findOne({ key: 'id', equals: parent.memberTypeId })
      }
    },
  }),
});