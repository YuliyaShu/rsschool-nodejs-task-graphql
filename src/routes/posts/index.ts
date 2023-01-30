import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { POST_ERROR_MESSAGE, USER_ERROR_MESSAGE } from '../../utils/constants';
import { getAllPosts } from './helperFunctions/getAllPosts';
import { getPostById } from './helperFunctions/getPostById';
import { createPost } from './helperFunctions/createPost';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get(
    '/',
    async (): Promise<PostEntity[]> => await getAllPosts(fastify),
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<PostEntity | Error> => await getPostById(fastify, request.params.id),
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async (request): Promise<PostEntity | Error> => await createPost(fastify, request.body),
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
