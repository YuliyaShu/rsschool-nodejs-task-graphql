import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { getAllMemberTypes } from './helperFunctions/getAllMemberTypes';
import { getMemberTypeById } from './helperFunctions/getMemberTypeById';
import { updateMemberType } from './helperFunctions/updateMemberType';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get(
    '/',
    async (): Promise<MemberTypeEntity[]> => await getAllMemberTypes(fastify),
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<MemberTypeEntity | Error> => await getMemberTypeById(fastify, request.params.id),
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<MemberTypeEntity | Error> => await updateMemberType(fastify, request.params.id, request.body),
  );
};

export default plugin;
