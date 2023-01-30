import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema, parse, validate, validateSchema } from 'graphql';
import depthLimit = require('graphql-depth-limit');
import { GQLMutation } from './GQLMutation';
import { GQLQuery } from './GQLQuery';
import { graphqlBodySchema } from './schema';

const DEPTH_LIMIT = 6;

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request) {
      const { query, variables } = request.body;
      const schema = new GraphQLSchema({
        query: await GQLQuery(fastify),
        mutation: await GQLMutation(fastify),
      })
      const schemaValidationErrors = validateSchema(schema);
      if (schemaValidationErrors.length > 0) {
        return { errors: schemaValidationErrors };
      }
      const validationErrors = validate(schema, parse(query!), [depthLimit(DEPTH_LIMIT)]);
      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }
      
      return graphql({
        schema,
        source: query!,
        variableValues: variables,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
