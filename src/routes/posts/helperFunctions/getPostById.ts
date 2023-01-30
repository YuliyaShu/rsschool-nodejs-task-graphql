import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance, RawServerDefault, FastifyBaseLogger } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { POST_ERROR_MESSAGE } from "../../../utils/constants";

export const getPostById = async (fastify: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, JsonSchemaToTsProvider>, id: string) => {
  const post = await fastify.db.posts.findOne({key: 'id', equals: id});
  if (!post) { 
    return fastify.httpErrors.notFound(POST_ERROR_MESSAGE);
  }
  return post;
}
