import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { getAllProfiles } from './helperFunctions/getAllProfiles';
import { getProfileById } from './helperFunctions/getProfileById';
import { createProfile } from './helperFunctions/createProfile';
import { updateProfile } from './helperFunctions/updateProfile';
import { deleteProfile } from './helperFunctions/deleteProfile';

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
    async (request): Promise<ProfileEntity | Error> => await deleteProfile(fastify, request.params.id),
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<ProfileEntity | Error> => await updateProfile(fastify, request.params.id, request.body),
  );
};

export default plugin;
