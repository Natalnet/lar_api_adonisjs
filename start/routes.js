'use strict';

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.post('users', 'UserController.store').validator('User');
Route.post('sessions', 'SessionController.store').validator('Session');

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'RequestNewPassword'
);
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ForgotPassword'
);

Route.group(() => {
  Route.get('devices', 'DeviceController.index');
  Route.get('devices/:id', 'DeviceController.show');
  Route.post('devices', 'DeviceController.store').middleware(
    'can:device_create'
  );
}).middleware('auth');

Route.group(() => {
  Route.post('members', 'MemberController.store');
  Route.get('members', 'MemberController.show');
  Route.put('members/:id', 'MemberController.update').middleware(
    'isDevice:adminDevice'
  );
  Route.delete('members/:id', 'MemberController.delete').middleware(
    'canDevice:remove_member'
  );

  Route.put('devices', 'DeviceController.update').middleware(
    'canDevice:device_edit'
  );
  Route.delete('devices', 'DeviceController.destroy').middleware(
    'canDevice:device_delete'
  );

  Route.get('permissions', 'PermissionController.index');
}).middleware('auth', 'device');

Route.group(() => {
  Route.resource('users', 'UserController')
    .apiOnly()
    .except(['store']);
}).middleware('auth', 'is:admin');
