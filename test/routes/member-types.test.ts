// import { test } from 'tap';
// import { build } from '../helper';

// test('member-types', async (t) => {
//   const app = await build(t);

//   await t.test(
//     'PATCH /member-types/:id => failure; fake params.id',
//     async (t) => {
//       const res_patchMemberType = await app.inject({
//         url: `/member-types/fakeId`,
//         method: 'PATCH',
//         payload: {},
//       });

//       t.ok(res_patchMemberType.statusCode > 300);
//     }
//   );

//   await t.test('PATCH /member-types/:id => success', async (t) => {
//     let memberType = await app
//       .inject({
//         url: `/member-types/basic`,
//       })
//       .then((r: any) => r.json(0));

//     const changedDiscount = 1;

//     memberType = await app
//       .inject({
//         url: `/member-types/basic`,
//         method: 'PATCH',
//         payload: {
//           discount: changedDiscount,
//         },
//       })
//       .then((r: any) => r.json(0));

//     t.ok(memberType.discount === changedDiscount);
//   });
// });
