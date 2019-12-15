'use strict';

const Antl = use('Antl');

class MemberUpdate {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      roles: 'required|array'
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = MemberUpdate;
