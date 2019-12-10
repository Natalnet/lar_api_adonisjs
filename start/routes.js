'use strict';

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
  Route.get('member/:id', 'MemberController.show');
  Route.post('device/:id/addmember', 'MemberController.store');
  Route.resource('device', 'DeviceController').apiOnly();
}).middleware('auth');
