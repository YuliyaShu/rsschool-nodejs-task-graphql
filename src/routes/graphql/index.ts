import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema, validateSchema } from 'graphql';
import { GQLMutation } from './GQLMutation';
import { GQLQuery } from './GQLQuery';
import { graphqlBodySchema } from './schema';

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
    async function (request, reply) {
      console.log(`111 ${request.body.query}`)
      console.log(`222 ${request.body.variables}`)
      const { query, variables } = request.body;
      const schema = new GraphQLSchema({
        query: await GQLQuery(fastify),
        mutation: await GQLMutation(fastify),
      })
      const schemaValidationErrors = validateSchema(schema);
      if (schemaValidationErrors.length > 0) {
        return { errors: schemaValidationErrors };
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
