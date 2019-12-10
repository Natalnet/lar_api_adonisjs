'use strict';

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const User = use('App/Models/User');
const Role = use('Adonis/Acl/Role');
const Permission = use('Adonis/Acl/Permission');

class DatabaseSeeder {
  async run() {
    const user1 = await User.create({
      username: 'Victor Hermes',
      email: 'victor@gmail.com',
      password: '123456'
    });

    const user2 = await User.create({
      username: 'Orivaldo Santana',
      email: 'orivaldo@gmail.com',
      password: '123456'
    });

    const allPermission = await Permission.create({
      slug: 'all_permissions',
      name: 'Todas as permissoes'
    });

    const addMember = await Permission.create({
      slug: 'add_member',
      name: 'Adicionar membros'
    });

    const removeMember = await Permission.create({
      slug: 'remove_member',
      name: 'Remover membros'
    });

    const createDevice = await Permission.create({
      slug: 'device_create',
      name: 'Criar dispositivos'
    });

    const deleteDevice = await Permission.create({
      slug: 'device_delete',
      name: 'Deletar dispositivos'
    });

    const adminSystem = await Role.create({
      slug: 'adminstrator',
      name: 'Adminstrador Sistema'
    });

    const adminDevice = await Role.create({
      slug: 'adminDevice',
      name: 'Adminstrador Dispositivo'
    });

    const user = await Role.create({
      slug: 'user',
      name: 'Usuario'
    });

    await Role.create({
      slug: 'visitor',
      name: 'Visitante'
    });

    await adminSystem
      .permissions()
      .attach([
        allPermission.id,
        addMember.id,
        removeMember.id,
        createDevice.id,
        deleteDevice.id
      ]);

    await adminDevice
      .permissions()
      .attach([
        addMember.id,
        removeMember.id,
        createDevice.id,
        deleteDevice.id
      ]);

    await user.permissions().attach([createDevice.id, deleteDevice.id]);

    const device1 = await user1.devices().create({
      user_id: user1.id,
      name: 'Dispositivo test',
      description: 'Um dispositivo de teste',
      topicToRead: 'a',
      topicToWrite: 'b',
      enabled: true,
      status: 'Online'
    });

    const device2 = await user2.devices().create({
      user_id: user2.id,
      name: 'Dispositivo teste 2',
      description: 'Um dispositivo de teste 2',
      topicToRead: 'c',
      topicToWrite: 'd',
      enabled: false,
      status: 'Offline'
    });

    const deviceJoin1 = await user1
      .devicesJoins()
      .where('device_id', device1.id)
      .first();

    const deviceJoin2 = await user2
      .devicesJoins()
      .where('device_id', device2.id)
      .first();

    await deviceJoin1.roles().attach([adminDevice.id]);
    await deviceJoin2.roles().attach([adminDevice.id]);
  }
}

module.exports = DatabaseSeeder;
