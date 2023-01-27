import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { MEMBERTYPE_ERROR_MESSAGE, PROFILE_ERROR_MESSAGE, PROFILE_EXIST_ERROR_MESSAGE } from '../../utils/constants';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    const allProfiles = await fastify.db.profiles.findMany();
    return allProfiles;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | Error> {
      const profile = await fastify.db.profiles.findOne({key: "id", equals: request.params.id});
      if (!profile) { 
        return fastify.httpErrors.notFound(PROFILE_ERROR_MESSAGE);
      }
      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | Error> {
      const profileUserId = await fastify.db.profiles.findOne({key: "userId", equals: request.body.userId});
      if (profileUserId) { 
        return fastify.httpErrors.badRequest(PROFILE_EXIST_ERROR_MESSAGE);
      }
      const profileMemberTypeId = await fastify.db.profiles.findOne({key: "memberTypeId", equals: request.body.memberTypeId});
      if (!profileMemberTypeId) { 
        return fastify.httpErrors.badRequest(PROFILE_EXIST_ERROR_MESSAGE);
      }
      const newProfile = await fastify.db.profiles.create(request.body);
      // const user = await fastify.db.users.findOne({key: "id", equals: newProfile.userId});
      // if (!user) { 
      //   return fastify.httpErrors.notFound(USER_ERROR_MESSAGE);
      // }
      // if (user.profileId) {
      //   return fastify.httpErrors.conflict(SUBSCRIBE_ERROR_MESSAGE);
      // }
      // const memberType = await fastify.db.memberTypes.findOne({key: "id", equals: newProfile.memberTypeId});
      // if (!memberType) {
      //   return fastify.httpErrors.notFound(MEMBERTYPE_ERROR_MESSAGE);
      // }
      // if (!memberType.profileIds.includes(newProfile.id)) {
      //   memberType.profileIds.push(newProfile.id);
      //   await fastify.db.memberTypes.change(memberType.id, {profileIds: memberType.profileIds});
      // } else {
      //   return fastify.httpErrors.conflict(MEMBERTYPE_PROFILEIDS_ERROR_MESSAGE)
      // }
      // await fastify.db.users.change(request.body.userId, {profileId: newProfile.id});
      return newProfile;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | Error> {
      const profile = await fastify.db.profiles.findOne({key: "id", equals: request.params.id});
      if (!profile) { 
        return fastify.httpErrors.badRequest(PROFILE_ERROR_MESSAGE);
      }
      const deletedProfile = await fastify.db.profiles.delete(request.params.id);
      if (!deletedProfile) { 
        return fastify.httpErrors.notFound(PROFILE_ERROR_MESSAGE);
      }
      // const memberType = await fastify.db.memberTypes.findOne({key: "id", equals: deletedProfile.memberTypeId});
      // if (!memberType) {
      //   return fastify.httpErrors.notFound(MEMBERTYPE_ERROR_MESSAGE);
      // }
      // if (memberType.profileIds.includes(deletedProfile.id)) {
      //   const newMemberTypeProfileIdsArray = memberType.profileIds.filter((id) => id !== deletedProfile.id);
      //   await fastify.db.memberTypes.change(memberType.id, {profileIds: newMemberTypeProfileIdsArray})
      // } 
      // fastify.db.users.change(deletedProfile.userId, {profileId: null});
      return deletedProfile;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | Error> {
      const profile = await fastify.db.profiles.findOne({key: "id", equals: request.params.id});
      if (!profile) { 
        return fastify.httpErrors.badRequest(PROFILE_ERROR_MESSAGE);
      }
      const previousMemberType = await fastify.db.memberTypes.findOne({key: "id", equals: profile.memberTypeId});
      if (!previousMemberType) {
        return fastify.httpErrors.notFound(MEMBERTYPE_ERROR_MESSAGE);
      }
      const updatedMemberType = await fastify.db.memberTypes.findOne({key: "id", equals: request.body.memberTypeId!});
      if (!updatedMemberType) { 
        return fastify.httpErrors.notFound(MEMBERTYPE_ERROR_MESSAGE);
      }
      const updatedProfile = await fastify.db.profiles.change(request.params.id, request.body);
      if (!updatedProfile) { 
        return fastify.httpErrors.notFound(PROFILE_ERROR_MESSAGE);
      }
      // const currentMemberType = await fastify.db.memberTypes.findOne({key: "id", equals: updatedProfile.memberTypeId});
      // if (!currentMemberType) {
      //   return fastify.httpErrors.notFound(MEMBERTYPE_ERROR_MESSAGE);
      // }
      // if (previousMemberType.profileIds.includes(request.params.id)) {
      //   const newPreviousMemberTypeProfileIdsArray = previousMemberType.profileIds.filter((id) => id !== request.params.id);
      //   await fastify.db.memberTypes.change(previousMemberType.id, {profileIds: newPreviousMemberTypeProfileIdsArray});
      // } 
      // if (!currentMemberType.profileIds.includes(request.params.id)) {
      //   currentMemberType.profileIds.push(request.params.id);
      //   await fastify.db.memberTypes.change(currentMemberType.id, {profileIds: currentMemberType.profileIds});
      // } else {
      //   return fastify.httpErrors.conflict(MEMBERTYPE_PROFILEIDS_ERROR_MESSAGE)
      // }
      return updatedProfile;
    }
  );
};

export default plugin;
