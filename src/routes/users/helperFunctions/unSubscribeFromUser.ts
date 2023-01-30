import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { NOT_SUBSCRIBE_ERROR_MESSAGE, USER_ERROR_MESSAGE } from "../../../utils/constants";

export const unSubscribeFromUser = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, userIdFromWhom: string, userIdWho: string ) => {
  const userWhoUnSubscribe = await fastify.db.users.findOne({key: 'id', equals: userIdWho});
  if (!userWhoUnSubscribe) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  const userOnWhomUnSubscribe = await fastify.db.users.findOne({key: 'id', equals: userIdFromWhom});
  if (!userOnWhomUnSubscribe) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  if (!userWhoUnSubscribe.subscribedToUserIds.includes(userIdFromWhom)) {
    return fastify.httpErrors.badRequest(NOT_SUBSCRIBE_ERROR_MESSAGE);
  }
  const newSubscribedToUserIdsArray = userWhoUnSubscribe.subscribedToUserIds.filter((id) => id !== userIdFromWhom);
  const updatedUserWhoUnSubscribe = await fastify.db.users.change(userIdWho, {subscribedToUserIds: newSubscribedToUserIdsArray});
  if (!updatedUserWhoUnSubscribe) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  const userFromWhomUnSubscribed = await fastify.db.users.findOne({key: 'id', equals: userIdWho});
  if (!userFromWhomUnSubscribed) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  return updatedUserWhoUnSubscribe;
}
