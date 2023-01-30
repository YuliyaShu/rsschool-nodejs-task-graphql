import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { POST_ERROR_MESSAGE } from "../../../utils/constants";
import { PostEntity } from "../../../utils/DB/entities/DBPosts";

export const updatePost = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string, args: Partial<Omit<PostEntity, 'id' | 'userId'>>) => {
  const post = await fastify.db.posts.findOne({key: 'id', equals: id});
      if (!post) { 
        return fastify.httpErrors.badRequest(POST_ERROR_MESSAGE);
      }
      const updatedPost = await fastify.db.posts.change(id, args);
      if (!updatedPost) { 
        return fastify.httpErrors.notFound(POST_ERROR_MESSAGE);
      }
      return updatedPost;
}
