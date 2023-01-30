import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { USER_ERROR_MESSAGE } from "../../../utils/constants";
import { PostEntity } from "../../../utils/DB/entities/DBPosts";

export const createPost = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, args: Omit<PostEntity, 'id'>) => {
  const newPost = await fastify.db.posts.create(args);
  const user = await fastify.db.users.findOne({key: 'id', equals: args.userId});
  if (!user) { 
    return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
  }
  return newPost;
}
