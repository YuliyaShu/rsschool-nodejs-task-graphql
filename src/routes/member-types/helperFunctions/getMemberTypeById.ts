import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { MEMBERTYPE_ERROR_MESSAGE } from "../../../utils/constants";

export const getMemberTypeById = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string) => {
  const memberType = await fastify.db.memberTypes.findOne({key: 'id', equals: id});
  if (!memberType) { 
    return fastify.httpErrors.notFound(MEMBERTYPE_ERROR_MESSAGE);
  }
  return memberType;
}
