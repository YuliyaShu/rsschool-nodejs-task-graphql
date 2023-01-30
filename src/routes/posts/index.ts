import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { POST_ERROR_MESSAGE, USER_ERROR_MESSAGE } from '../../utils/constants';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const allPosts = await fastify.db.posts.findMany();
    return allPosts;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | Error> {
        const post = await fastify.db.posts.findOne({key: 'id', equals: request.params.id});
        if (!post) { 
          return fastify.httpErrors.notFound(POST_ERROR_MESSAGE);
        }
        return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity | Error> {
      const newPost = await fastify.db.posts.create(request.body);
      const user = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
      if (!user) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      return newPost;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | Error> {
      const post = await fastify.db.posts.findOne({key: 'id', equals: request.params.id});
      if (!post) { 
        return fastify.httpErrors.badRequest(POST_ERROR_MESSAGE);
      }
      const deletedPost = await fastify.db.posts.delete(request.params.id);
      if (!deletedPost) { 
        return fastify.httpErrors.badRequest(POST_ERROR_MESSAGE);
      }
      const user = await fastify.db.users.findOne({key: 'id', equals: deletedPost.userId});
      if (!user) { 
        return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      }
      return deletedPost;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | Error> {
      const post = await fastify.db.posts.findOne({key: 'id', equals: request.params.id});
      if (!post) { 
        return fastify.httpErrors.badRequest(POST_ERROR_MESSAGE);
      }
      const updatedPost = await fastify.db.posts.change(request.params.id, request.body);
      if (!updatedPost) { 
        return fastify.httpErrors.notFound(POST_ERROR_MESSAGE);
      }
      return updatedPost;
    }
  );
};

export default plugin;
