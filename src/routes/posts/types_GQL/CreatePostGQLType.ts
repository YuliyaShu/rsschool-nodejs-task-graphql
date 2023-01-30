import { GraphQLInputObjectType, GraphQLString, GraphQLID } from "graphql";

export const CreatePostGQLType = new GraphQLInputObjectType({
  name: 'createPost',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
});
