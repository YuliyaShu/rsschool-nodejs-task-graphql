import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { POST_ERROR_MESSAGE, USER_ERROR_MESSAGE } from "../../../utils/constants";

export const deletePost = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string) => {
  const post = await fastify.db.posts.findOne({key: 'id', equals: id});
  if (!post) { 
    return fastify.httpErrors.badRequest(POST_ERROR_MESSAGE);
  }
  const deletedPost = await fastify.db.posts.delete(id);
  if (!deletedPost) { 
    return fastify.httpErrors.badRequest(POST_ERROR_MESSAGE);
  }
  const user = await fastify.db.users.findOne({key: 'id', equals: deletedPost.userId});
  if (!user) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  return deletedPost;
}
