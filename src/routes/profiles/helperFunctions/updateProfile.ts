import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { PROFILE_ERROR_MESSAGE } from "../../../utils/constants";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";

export const updateProfile = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string, args: Partial<Omit<ProfileEntity, 'id' | 'userId'>>) => {
  const profile = await fastify.db.profiles.findOne({key: 'id', equals: id});
  if (!profile) { 
    return fastify.httpErrors.badRequest(PROFILE_ERROR_MESSAGE);
  }
  const updatedProfile = await fastify.db.profiles.change(id, args);
  if (!updatedProfile) { 
    return fastify.httpErrors.notFound(PROFILE_ERROR_MESSAGE);
  }
  return updatedProfile;
}
