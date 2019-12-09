'use strict';

const User = use('App/Models/User');
const UserDevice = use('App/Models/UserDevice');

class MemberController {
  // Adicionar membro em um dispositivo
  // /device/:id/addmember
  // body: {user_id: 1}
  async store({ params, request, response }) {
    try {
      const email = request.input('email');
      const user = await User.findByOrFail('email', email);

      await user.devices().attach(params.id);
      return user;
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Algo não deu certo, esse usuário existe?' }
      });
    }
  }

  async show({ params }) {
    const members = await UserDevice.query()
      .where('device_id', params.id)
      .with('user')
      .fetch();

    return members;
  }
}

module.exports = MemberController;
