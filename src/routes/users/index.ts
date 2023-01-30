import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { USER_ERROR_MESSAGE } from '../../utils/constants';
import { getAllUsers } from './helperFunctions/getAllUsers';
import { getUserById } from './helperFunctions/getUserById';
import { createUser } from './helperFunctions/createUser';
import { updateUser } from './helperFunctions/updateUser';
import { subscribeToUser } from './helperFunctions/subscribeToUser';
import { unSubscribeFromUser } from './helperFunctions/unSubscribeFromUser';

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
    async function (request, reply): Promise<UserEntity | Error> {
      const user = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
      if (!user) {
        return fastify.httpErrors.badRequest(USER_ERROR_MESSAGE);
      }
      const posts = await fastify.db.posts.findMany({key: 'userId', equals: request.params.id});
      posts.forEach(async post => {
        if (post) {
          await fastify.db.posts.delete(post.id);
        }
      })
      const profile = await fastify.db.profiles.findOne({key: 'userId', equals: request.params.id});
      if (profile) {
        await fastify.db.profiles.delete(profile.id);
      }
      
      const subscribedUsers = await fastify.db.users.findMany({key: 'subscribedToUserIds', inArray: request.params.id})
      subscribedUsers.map(async(userWhoSubscribe) => {
        const updatedSubscriptions = userWhoSubscribe.subscribedToUserIds.filter((id) => id !== request.params.id);
        await fastify.db.users.change(userWhoSubscribe.id, { subscribedToUserIds: updatedSubscriptions});
      })

      const deletedUser = await fastify.db.users.delete(request.params.id);
      return deletedUser;
    }
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
