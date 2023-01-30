import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from "fastify";
import { IncomingMessage, ServerResponse } from "http";

export const getAllUsers = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>) => {
  const allUsers = await fastify.db.users.findMany();
  return allUsers;
}
