import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeToBodySchema,
  unsubscribeFromBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { USER_ERROR_MESSAGE, SUBSCRIBE_ERROR_MESSAGE, NOT_SUBSCRIBE_ERROR_MESSAGE } from '../../utils/constants';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | Error> {
      const id = request.params.id;
      const user = await fastify.db.users.findOne(id);
      if (!user) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const newUser = await fastify.db.users.create(request.body);
      return newUser;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | Error> {
      const deletedUser = await fastify.db.users.delete(request.params.id);
      if (!deletedUser) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      await fastify.db.profiles.delete(deletedUser.profileId!);
      deletedUser.postIds.map(async(postId) => {
        await fastify.db.posts.delete(postId);
      })
      deletedUser.subscribedToUserIds.map(async(userIdOnWhom) => {
        const userOnWhom = await fastify.db.users.findOne(userIdOnWhom);
        if (!userOnWhom) { 
          return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
        }
        const newSubscriptions = userOnWhom.userSubscribedToIds.filter((id) => id !== deletedUser.id);
        await fastify.db.users.change(userIdOnWhom, { userSubscribedToIds: newSubscriptions});
      })
      deletedUser.userSubscribedToIds.map(async(userIdFromWhom) => {
        const userFromWhom = await fastify.db.users.findOne(userIdFromWhom);
        if (!userFromWhom) { 
          return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
        }
        const newSubscriptions = userFromWhom.subscribedToUserIds.filter((id) => id !== deletedUser.id);
        await fastify.db.users.change(userIdFromWhom, { subscribedToUserIds: newSubscriptions});
      })
      return deletedUser;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeToBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | Error> {
      const userWhoSubscribe = await fastify.db.users.findOne(request.params.id);
      console.log('🚀 ~ who', request.params.id);
      console.log('🚀 ~ on who', request.body.userId);
      if (!userWhoSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      if (!userWhoSubscribe.userSubscribedToIds.includes(request.body.userId)) {
        userWhoSubscribe.userSubscribedToIds.push(request.body.userId);
        await fastify.db.users.change(userWhoSubscribe.id, { userSubscribedToIds: userWhoSubscribe.userSubscribedToIds})
      } else {
        return fastify.httpErrors.conflict(SUBSCRIBE_ERROR_MESSAGE);
      }
      
      const updatedUserWhoSubscribe = await fastify.db.users.findOne(request.params.id);
      if (!updatedUserWhoSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }

      const userOnWhomSubscribed = await fastify.db.users.findOne(request.body.userId);
      
      if (!userOnWhomSubscribed) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      userOnWhomSubscribed.subscribedToUserIds.push(request.params.id);
      await fastify.db.users.change(request.body.userId, {subscribedToUserIds: userOnWhomSubscribed.subscribedToUserIds})

      return updatedUserWhoSubscribe;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: unsubscribeFromBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | Error> {
      const userWhoUnSubscribe = await fastify.db.users.findOne(request.params.id);
      if (!userWhoUnSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      if (!userWhoUnSubscribe.userSubscribedToIds.includes(request.body.userId)) {
        return fastify.httpErrors.conflict(NOT_SUBSCRIBE_ERROR_MESSAGE);
      }
      const newSubscribedToUserIdsArray = userWhoUnSubscribe.userSubscribedToIds.filter((id) => id !== request.body.userId);
      const updatedUserWhoUnSubscribe = await fastify.db.users.change(request.params.id, {userSubscribedToIds: newSubscribedToUserIdsArray});
      if (!updatedUserWhoUnSubscribe) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }

      const userFromWhomUnSubscribed = await fastify.db.users.findOne(request.body.userId);
      if (!userFromWhomUnSubscribed) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      const newUserSubscribedToIdsArray = userFromWhomUnSubscribed.subscribedToUserIds.filter((id) => id !== request.params.id);
      await fastify.db.users.change(request.body.userId, {subscribedToUserIds: newUserSubscribedToIdsArray})
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
      const updatedUser = await fastify.db.users.change(request.params.id, request.body);
      if (!updatedUser) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      return updatedUser;
    }
  );
};

export default plugin;
