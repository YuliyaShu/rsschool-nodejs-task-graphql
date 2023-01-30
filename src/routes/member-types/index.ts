import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { MEMBERTYPE_ERROR_MESSAGE } from '../../utils/constants';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    const allMemberTypes = await fastify.db.memberTypes.findMany();
    return allMemberTypes;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | Error> {
      const memberType = await fastify.db.memberTypes.findOne({key: 'id', equals: request.params.id});
        if (!memberType) { 
          return fastify.httpErrors.notFound(MEMBERTYPE_ERROR_MESSAGE);
        }
        return memberType;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | Error> {
      const memberType = await fastify.db.memberTypes.findOne({key: 'id', equals: request.params.id});
      if (!memberType) { 
        return fastify.httpErrors.badRequest(MEMBERTYPE_ERROR_MESSAGE);
      }
      const updatedMemberType = await fastify.db.memberTypes.change(request.params.id, request.body);
      if (!updatedMemberType) { 
        return fastify.httpErrors.notFound(MEMBERTYPE_ERROR_MESSAGE);
      }
      return updatedMemberType;
    }
  );
};

export default plugin;
