import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { SUBSCRIBE_ERROR_MESSAGE, USER_ERROR_MESSAGE } from "../../../utils/constants";

export const subscribeToUser = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, userIdOnWhom: string, userIdWho: string ) => {
  const userWhoSubscribe = await fastify.db.users.findOne({key: 'id', equals: userIdWho});
  if (!userWhoSubscribe) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  const userOnWhomSubscribe = await fastify.db.users.findOne({key: 'id', equals: userIdOnWhom});
  if (!userOnWhomSubscribe) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  if (!(userWhoSubscribe.subscribedToUserIds.includes(userIdOnWhom))) {
    userWhoSubscribe.subscribedToUserIds.push(userIdOnWhom);
    await fastify.db.users.change(userWhoSubscribe.id, { subscribedToUserIds: userWhoSubscribe.subscribedToUserIds})
  } else {
    return fastify.httpErrors.conflict(SUBSCRIBE_ERROR_MESSAGE);
  }
  const updatedUserWhoSubscribe = await fastify.db.users.findOne({key: 'id', equals: userIdWho});
  if (!updatedUserWhoSubscribe) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  return updatedUserWhoSubscribe;
}
