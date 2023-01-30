import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { getAllPosts } from './helperFunctions/getAllPosts';
import { getPostById } from './helperFunctions/getPostById';
import { createPost } from './helperFunctions/createPost';
import { updatePost } from './helperFunctions/updatePost';
import { deletePost } from './helperFunctions/deletePost';

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
    async (request): Promise<PostEntity | Error> => await deletePost(fastify, request.params.id),
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<PostEntity | Error> => await updatePost(fastify, request.params.id, request.body),
  );
};

export default plugin;
