import { GraphQLObjectType, GraphQLInt, GraphQLID } from "graphql";

export const MemberGQLType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});
