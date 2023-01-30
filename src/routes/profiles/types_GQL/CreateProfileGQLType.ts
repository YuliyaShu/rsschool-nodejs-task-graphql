import { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLID } from "graphql";

export const CreateProfileGQLType = new GraphQLInputObjectType({
  name: 'createProfile',
  fields: {
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
});
