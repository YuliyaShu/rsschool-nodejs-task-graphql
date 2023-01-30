import { GraphQLInputObjectType, GraphQLID } from "graphql";

export const UnsubscribeUserGQLType = new GraphQLInputObjectType({
  name: 'unSubscribeUser',
  fields: {
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
  },
});
