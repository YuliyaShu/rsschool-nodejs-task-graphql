import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { MEMBERTYPE_ERROR_MESSAGE } from "../../../utils/constants";
import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";

export const updateMemberType = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string, args: Partial<Omit<MemberTypeEntity, 'id'>>) => {
  const memberType = await fastify.db.memberTypes.findOne({key: 'id', equals: id});
  if (!memberType) { 
    return fastify.httpErrors.badRequest(MEMBERTYPE_ERROR_MESSAGE);
  }
  const updatedMemberType = await fastify.db.memberTypes.change(id, args);
  if (!updatedMemberType) { 
    return fastify.httpErrors.notFound(MEMBERTYPE_ERROR_MESSAGE);
  }
  return updatedMemberType;
}
