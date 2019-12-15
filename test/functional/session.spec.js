const { test, trait } = use('Test/Suite')('Session');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient');

test('it should return JWT token when session created', async ({
  assert,
  client
}) => {
  await User.create({
    username: 'Victor Hermes',
    email: 'victor@gmail.com',
    password: '123456'
  });

  const response = await client
    .post('/sessions')
    .send({
      email: 'victor@gmail.com',
      password: '123456'
    })
    .end();

  response.assertStatus(200);
  assert.exists(response.body.token);
});
