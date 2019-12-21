const { test, trait } = use('Test/Suite')('Forgot Password')

const Mail = use('Mail')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

trait('Test/ApiClient')
trait('DatabaseTransactions')

test('it should send an email with reset password instruction', async ({
  assert,
  client
}) => {
  Mail.fake()

  const forgotPayload = {
    email: 'victor@gmail.com'
  }

  await Factory.model('App/Models/User').create(forgotPayload)

  const response = await client
    .post('/passwords')
    .send(forgotPayload)
    .end()

  response.assertStatus(204)

  const recentEmail = Mail.pullRecent()

  assert.equal(recentEmail.message.to[0].address, forgotPayload.email)

  Mail.restore()
})
