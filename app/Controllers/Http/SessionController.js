'use strict';

class SessionController {
  async store({ request, response, auth }) {
    const { email, password } = request.all();

    try {
      const token = await auth.attempt(email, password);
      return token;
    } catch (err) {
      return response.status(err.status).send({
        error: { message: 'Email ou senha incorreta' }
      });
    }
  }
}

module.exports = SessionController;
