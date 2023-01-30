import { GraphQLInputObjectType, GraphQLID, GraphQLString } from "graphql";

export const UpdatePostGQLType = new GraphQLInputObjectType({
  name: 'updatePost',
  fields: {
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    title: { type: GraphQLString },
  },
});
