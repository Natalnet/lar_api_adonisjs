'use strict';

const User = use('App/Models/User');

class SessionController {
  async store({ request, response, auth }) {
    const { email, password } = request.all();

    try {
      if (await auth.attempt(email, password)) {
        const user = await User.findBy('email', email);
        const token = await auth.generate(user);

        return response.json({ user, token });
      }
    } catch (err) {
      return response.status(err.status).send({
        error: { message: 'Email ou senha incorreta' }
      });
    }
  }
}

module.exports = SessionController;
