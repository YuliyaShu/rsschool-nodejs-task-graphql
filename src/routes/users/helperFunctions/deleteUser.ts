import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { USER_ERROR_MESSAGE } from "../../../utils/constants";

export const deleteUser = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string) => {
  const user = await fastify.db.users.findOne({key: 'id', equals: id});
  if (!user) {
    return fastify.httpErrors.badRequest(USER_ERROR_MESSAGE);
  }
  const posts = await fastify.db.posts.findMany({key: 'userId', equals: id});
  posts.forEach(async post => {
    if (post) {
      await fastify.db.posts.delete(post.id);
    }
  })
  const profile = await fastify.db.profiles.findOne({key: 'userId', equals: id});
  if (profile) {
    await fastify.db.profiles.delete(profile.id);
  }
  
  const subscribedUsers = await fastify.db.users.findMany({key: 'subscribedToUserIds', inArray: id});
  subscribedUsers.map(async(userWhoSubscribe) => {
    const updatedSubscriptions = userWhoSubscribe.subscribedToUserIds.filter((id) => id !== id);
    await fastify.db.users.change(userWhoSubscribe.id, { subscribedToUserIds: updatedSubscriptions});
  })
  const deletedUser = await fastify.db.users.delete(id);
  return deletedUser;
}
