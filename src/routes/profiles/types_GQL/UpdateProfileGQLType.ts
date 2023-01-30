import { GraphQLInputObjectType, GraphQLID, GraphQLString, GraphQLInt } from "graphql";

export const UpdateProfileGQLType = new GraphQLInputObjectType({
  name: 'updateProfile',
  fields: {
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  },
});