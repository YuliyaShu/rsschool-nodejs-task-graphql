import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { USER_ERROR_MESSAGE, SUBSCRIBE_ERROR_MESSAGE, NOT_SUBSCRIBE_ERROR_MESSAGE } from '../../utils/constants';
import { getAllUsers } from './helperFunctions/getAllUsers';
import { getUserById } from './helperFunctions/getUserById';
import { createUser } from './helperFunctions/createUser';

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
    async function (request, reply): Promise<UserEntity | Error> {
      const userWhoSubscribe = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
      if (!userWhoSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      const userOnWhomSubscribe = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
      if (!userOnWhomSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      if (!(userWhoSubscribe.subscribedToUserIds.includes(request.params.id))) {
        userWhoSubscribe.subscribedToUserIds.push(request.params.id);
        await fastify.db.users.change(userWhoSubscribe.id, { subscribedToUserIds: userWhoSubscribe.subscribedToUserIds})
      } else {
        return fastify.httpErrors.conflict(SUBSCRIBE_ERROR_MESSAGE);
      }
      const updatedUserWhoSubscribe = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
      if (!updatedUserWhoSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      return updatedUserWhoSubscribe;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | Error> {
      const userWhoUnSubscribe = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
      if (!userWhoUnSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      const userOnWhomUnSubscribe = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
      if (!userOnWhomUnSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      if (!userWhoUnSubscribe.subscribedToUserIds.includes(request.params.id)) {
        return fastify.httpErrors.badRequest(NOT_SUBSCRIBE_ERROR_MESSAGE);
      }
      const newSubscribedToUserIdsArray = userWhoUnSubscribe.subscribedToUserIds.filter((id) => id !== request.params.id);
      const updatedUserWhoUnSubscribe = await fastify.db.users.change(request.body.userId, {subscribedToUserIds: newSubscribedToUserIdsArray});
      if (!updatedUserWhoUnSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      const userFromWhomUnSubscribed = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
      if (!userFromWhomUnSubscribed) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      return updatedUserWhoUnSubscribe;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | Error> {
      const user = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
      if (!user) {
        return fastify.httpErrors.badRequest(USER_ERROR_MESSAGE);
      }
      const updatedUser = await fastify.db.users.change(request.params.id, request.body);
      if (!updatedUser) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      return updatedUser;
    }
  );
};

export default plugin;
