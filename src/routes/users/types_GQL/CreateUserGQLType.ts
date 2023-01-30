import { GraphQLInputObjectType, GraphQLString } from "graphql";

export const CreateUserGQLType = new GraphQLInputObjectType({
  name: 'createUser',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});
