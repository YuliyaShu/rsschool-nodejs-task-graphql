// import { test } from 'tap';
// import { build } from '../helper';
// import { createUser, createPost } from '../utils/requests';

// test('posts', async (t) => {
//   const app = await build(t);

//   await t.test('POST /posts => failure; fake body.userId', async (t) => {
//     const { res: res_createPost } = await createPost(app, 'fakeId');

//     t.ok(res_createPost.statusCode > 300);
//   });

//   await t.test('POST /posts => success', async (t) => {
//     let { body: user } = await createUser(app);
//     const { body: post1 } = await createPost(app, user.id);
//     const { body: post2 } = await createPost(app, user.id);

//     t.ok(
//       post1.userId === user.id && post2.userId === user.id,
//       'userId should be correct'
//     );

//     user = await app
//       .inject({
//         url: `/users/${user.id}`,
//       })
//       .then((r: any) => r.json(0));
//     t.ok(user.postIds.length === 2, 'postIds should be updated');
//   });

//   await t.test('PATCH /posts/:id => failure; fake params.id', async (t) => {
//     const res_patchPost = await app.inject({
//       url: `/posts/fakeId`,
//       method: 'PATCH',
//       payload: {},
//     });

//     t.ok(res_patchPost.statusCode > 300);
//   });

//   await t.test('PATCH /posts/:id => success', async (t) => {
//     const { body: user } = await createUser(app);
//     let { body: post } = await createPost(app, user.id);

//     const changedTitle = 'HelloWorld';

//     post = await app
//       .inject({
//         url: `/posts/${post.id}`,
//         method: 'PATCH',
//         payload: {
//           title: changedTitle,
//         },
//       })
//       .then((r: any) => r.json(0));

//     t.ok(post.title === changedTitle);
//   });

//   await t.test('DELETE /posts/:id => failure; fake params.id', async (t) => {
//     const res_deletePost = await app.inject({
//       url: `/posts/fakeId`,
//       method: 'DELETE',
//     });

//     t.ok(res_deletePost.statusCode > 300);
//   });

//   await t.test('DELETE /posts/:id => success', async (t) => {
//     let { body: user } = await createUser(app);
//     const { body: post1 } = await createPost(app, user.id);
//     const { body: post2 } = await createPost(app, user.id);

//     await app.inject({
//       url: `/posts/${post1.id}`,
//       method: 'DELETE',
//     });

//     user = await app
//       .inject({
//         url: `/users/${user.id}`,
//       })
//       .then((r: any) => r.json());
//     t.ok(user.postIds.includes(post2.id) && !user.postIds.includes(post1.id));
//   });
// });
