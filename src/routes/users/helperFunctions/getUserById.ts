import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { USER_ERROR_MESSAGE } from "../../../utils/constants";

export const getUserById = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string) => {
  const user = await fastify.db.users.findOne({key: 'id', equals: id});
  if (!user) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  return user;
}
