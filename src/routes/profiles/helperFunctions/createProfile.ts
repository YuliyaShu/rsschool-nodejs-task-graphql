import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { PROFILE_EXIST_ERROR_MESSAGE, MEMBERTYPE_ERROR_MESSAGE } from "../../../utils/constants";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";

export const createProfile = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, args: Omit<ProfileEntity, 'id'>) => {
  const profileUserId = await fastify.db.profiles.findOne({key: 'userId', equals: args.userId});
  if (profileUserId) { 
    return fastify.httpErrors.badRequest(PROFILE_EXIST_ERROR_MESSAGE);
  }
  const profileMemberTypeId = await fastify.db.memberTypes.findOne({key: 'id', equals: args.memberTypeId});
  if (!profileMemberTypeId) { 
    return fastify.httpErrors.badRequest(MEMBERTYPE_ERROR_MESSAGE);
  }
  const newProfile = await fastify.db.profiles.create(args);
  return newProfile;
}
