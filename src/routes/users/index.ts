import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { getAllUsers } from './helperFunctions/getAllUsers';
import { getUserById } from './helperFunctions/getUserById';
import { createUser } from './helperFunctions/createUser';
import { updateUser } from './helperFunctions/updateUser';
import { subscribeToUser } from './helperFunctions/subscribeToUser';
import { unSubscribeFromUser } from './helperFunctions/unSubscribeFromUser';
import { deleteUser } from './helperFunctions/deleteUser';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get(
    '/',
    async (): Promise<UserEntity[]> => await getAllUsers(fastify),
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity | Error> => await getUserById(fastify, request.params.id),
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async (request): Promise<UserEntity> => await createUser(fastify, request.body),
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity | Error> => await deleteUser(fastify, request.params.id),
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity | Error> => await subscribeToUser(fastify, request.params.id, request.body.userId),
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity | Error> => await unSubscribeFromUser(fastify, request.params.id, request.body.userId),
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity | Error> => await updateUser(fastify, request.params.id, request.body),
  );
};

export default plugin;
