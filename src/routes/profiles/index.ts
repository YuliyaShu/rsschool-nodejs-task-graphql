import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { MEMBERTYPE_ERROR_MESSAGE, PROFILE_ERROR_MESSAGE, PROFILE_EXIST_ERROR_MESSAGE } from '../../utils/constants';
import { getAllProfiles } from './helperFunctions/getAllProfiles';
import { getProfileById } from './helperFunctions/getProfileById';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get(
    '/',
    async (): Promise<ProfileEntity[]> => await getAllProfiles(fastify),
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<ProfileEntity | Error> => await getProfileById(fastify, request.params.id),
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | Error> {
      const profileUserId = await fastify.db.profiles.findOne({key: 'userId', equals: request.body.userId});
      if (profileUserId) { 
        return fastify.httpErrors.badRequest(PROFILE_EXIST_ERROR_MESSAGE);
      }
      const profileMemberTypeId = await fastify.db.memberTypes.findOne({key: 'id', equals: request.body.memberTypeId});
      if (!profileMemberTypeId) { 
        return fastify.httpErrors.badRequest(MEMBERTYPE_ERROR_MESSAGE);
      }
      const newProfile = await fastify.db.profiles.create(request.body);
      return newProfile;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | Error> {
      const profile = await fastify.db.profiles.findOne({key: 'id', equals: request.params.id});
      if (!profile) { 
        return fastify.httpErrors.badRequest(PROFILE_ERROR_MESSAGE);
      }
      const deletedProfile = await fastify.db.profiles.delete(request.params.id);
      if (!deletedProfile) { 
        return fastify.httpErrors.notFound(PROFILE_ERROR_MESSAGE);
      }
      return deletedProfile;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | Error> {
      const profile = await fastify.db.profiles.findOne({key: 'id', equals: request.params.id});
      if (!profile) { 
        return fastify.httpErrors.badRequest(PROFILE_ERROR_MESSAGE);
      }
      const updatedProfile = await fastify.db.profiles.change(request.params.id, request.body);
      if (!updatedProfile) { 
        return fastify.httpErrors.notFound(PROFILE_ERROR_MESSAGE);
      }
      return updatedProfile;
    }
  );
};

export default plugin;
