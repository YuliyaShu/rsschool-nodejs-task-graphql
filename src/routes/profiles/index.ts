import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { PROFILE_ERROR_MESSAGE } from '../../utils/constants';
import { getAllProfiles } from './helperFunctions/getAllProfiles';
import { getProfileById } from './helperFunctions/getProfileById';
import { createProfile } from './helperFunctions/createProfile';

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
    async (request): Promise<ProfileEntity | Error> => await createProfile(fastify, request.body),
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
