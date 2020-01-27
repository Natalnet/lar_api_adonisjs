'use strict'

const isAfter = require('date-fns/isAfter')
const subDays = require('date-fns/subDays')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          username: user.username,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message => {
          message
            .to(user.email)
            .from('noreply@lariot.com.br', 'LAR - IOT')
            .subject('Recuperação de senha')
        }
      )
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: 'Algo não deu certo, esse e-mail existe?'
        }
      })
    }
  }

  async update({ request, response, auth }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = isAfter(
        subDays(new Date(), 2),
        user.token_created_at
      )

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'O token de recuperação está expirado' } })
      }
      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()

      const tokenLogin = await auth.attempt(user.email, password)

      return tokenLogin
    } catch (err) {
      return response.status(err.status).send({
        error: { message: 'Algo não deu certo ao resetar sua senha' }
      })
    }
  }
}

module.exports = ForgotPasswordController
