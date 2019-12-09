'use strict';

const Route = use('Route');

Route.post('users', 'UserController.store').validator('User');
Route.post('sessions', 'SessionController.store');

Route.post('passwords', 'ForgotPasswordController.store');

Route.group(() => {
  Route.get('member/:id', 'MemberController.show');
  Route.post('device/:id/addmember', 'MemberController.store');
  Route.resource('device', 'DeviceController').apiOnly();
}).middleware('auth');
