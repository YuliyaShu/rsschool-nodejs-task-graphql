import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { USER_ERROR_MESSAGE } from "../../../utils/constants";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";

export const updateUser = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string, args: Partial<Omit<UserEntity, 'id'>>) => {
  const user = await fastify.db.users.findOne({key: 'id', equals: id});
  if (!user) {
    return fastify.httpErrors.badRequest(USER_ERROR_MESSAGE);
  }
  const updatedUser = await fastify.db.users.change(id, args);
  if (!updatedUser) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  return updatedUser;
}
