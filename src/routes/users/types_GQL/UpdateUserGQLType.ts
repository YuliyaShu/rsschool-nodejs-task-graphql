import { GraphQLID, GraphQLInputObjectType, GraphQLString } from "graphql";

export const UpdateUserGQLType = new GraphQLInputObjectType({
  name: 'updateUser',
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});
