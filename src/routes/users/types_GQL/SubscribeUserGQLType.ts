import { GraphQLInputObjectType, GraphQLID } from "graphql";

export const SubscribeUserGQLType = new GraphQLInputObjectType({
  name: 'subscribeUser',
  fields: {
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
  },
});
