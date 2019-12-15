'use strict';

const Antl = use('Antl');

class Member {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      email: 'required|email'
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Member;
