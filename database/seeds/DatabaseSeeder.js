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

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use('Adonis/Acl/Role');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
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

    const addMember = await Permission.create({
      slug: 'add_member',
      name: 'Adicionar membros'
    });

    const editMember = await Permission.create({
      slug: 'edit_member',
      name: 'Editar membros'
    });

    const removeMember = await Permission.create({
      slug: 'remove_member',
      name: 'Remover membros'
    });

    const readDevice = await Permission.create({
      slug: 'device_read',
      name: 'Ler dispositivos'
    });

    const createDevice = await Permission.create({
      slug: 'device_create',
      name: 'Criar dispositivos'
    });

    const deleteDevice = await Permission.create({
      slug: 'device_delete',
      name: 'Deletar dispositivos'
    });

    const editDevice = await Permission.create({
      slug: 'device_edit',
      name: 'Editar dispositivo'
    });

    const admin = await Role.create({
      slug: 'admin',
      name: 'Adminstrador Sistema'
    });

    const adminDevice = await Role.create({
      slug: 'admin_device',
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

    await admin
      .permissions()
      .attach([
        editMember.id,
        addMember.id,
        removeMember.id,
        createDevice.id,
        deleteDevice.id,
        editDevice.id
      ]);

    await adminDevice
      .permissions()
      .attach([
        editMember.id,
        addMember.id,
        removeMember.id,
        createDevice.id,
        deleteDevice.id,
        editDevice.id
      ]);

    await user.permissions().attach([readDevice.id]);

    await user1.roles().attach([admin.id]);
    await user2.roles().attach([user.id]);

    const device1 = await user1.devices().create({
      name: 'Dispositivo teste',
      description: 'Um dispositivo de teste',
      topicToRead: 'a',
      topicToWrite: 'b',
      enabled: true,
      status: 'Online'
    });

    const device2 = await user2.devices().create({
      name: 'Dispositivo teste 2',
      description: 'Um dispositivo de teste 2',
      topicToRead: 'c',
      topicToWrite: 'd',
      enabled: false,
      status: 'Offline'
    });

    await user1.devices().attach(device2.id);

    const deviceJoin1 = await user1
      .deviceJoins()
      .where('device_id', device1.id)
      .first();

    const deviceJoin2 = await user2
      .deviceJoins()
      .where('device_id', device2.id)
      .first();

    const deviceJoin3 = await user1
      .deviceJoins()
      .where('device_id', device2.id)
      .first();

    await deviceJoin1.roles().attach([adminDevice.id]);
    await deviceJoin2.roles().attach([adminDevice.id]);
    await deviceJoin3.roles().attach([user.id]);
  }
}

module.exports = DatabaseSeeder;
