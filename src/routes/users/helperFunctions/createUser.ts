import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";

export const createUser = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, args: Omit<UserEntity, 'id' | 'subscribedToUserIds'> ) => {
  const newUser = await fastify.db.users.create(args);
  return newUser;
}
