import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { PROFILE_ERROR_MESSAGE } from "../../../utils/constants";

export const deleteProfile = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string) => {
  const profile = await fastify.db.profiles.findOne({key: 'id', equals: id});
  if (!profile) { 
    return fastify.httpErrors.badRequest(PROFILE_ERROR_MESSAGE);
  }
  const deletedProfile = await fastify.db.profiles.delete(id);
  if (!deletedProfile) { 
    return fastify.httpErrors.notFound(PROFILE_ERROR_MESSAGE);
  }
  return deletedProfile;
}
