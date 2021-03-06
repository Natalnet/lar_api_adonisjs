'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'RequestNewPassword'
)
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ForgotPassword'
)

Route.group(() => {
  Route.get('account', 'AccountController.index')
  Route.get('devices', 'DeviceController.index')
  Route.get('devices/:id', 'DeviceController.show')
  Route.post('devices', 'DeviceController.store')
    .validator('Device')
    .middleware('can:device_create')
}).middleware('auth')

Route.group(() => {
  Route.get('members', 'MemberController.index')
  Route.post('members', 'MemberController.store').validator('Member')
  Route.put('members/:id', 'MemberController.update')
    .validator('MemberUpdate')
    .middleware('isDevice:admin_device || is:admin')
  Route.delete('members/:id', 'MemberController.delete').middleware(
    'canDevice:remove_member'
  )
}).middleware('auth', 'device')

Route.group(() => {
  Route.put('devices', 'DeviceController.update').middleware(
    'canDevice:device_edit || is:admin'
  )
  Route.delete('devices', 'DeviceController.destroy').middleware(
    'canDevice:device_delete || is:admin'
  )

  Route.get('permissions', 'PermissionController.index')
}).middleware('auth', 'device')

Route.group(() => {
  Route.resource('users', 'UserController')
    .apiOnly()
    .except(['store'])
}).middleware('auth', 'is:admin')
