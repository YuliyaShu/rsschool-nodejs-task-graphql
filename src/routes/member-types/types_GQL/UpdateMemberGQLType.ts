import { GraphQLInputObjectType, GraphQLID, GraphQLInt } from "graphql";

export const UpdateMemberGQLType = new GraphQLInputObjectType({
  name: 'updateMember',
  fields: {
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});
