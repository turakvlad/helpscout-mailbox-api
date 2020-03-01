'use strict';

class User {
  constructor (client) {
    this.client = client;
  }

  get (userId) {
    return this.client.get(`users/${userId}`);
  }

  list (params = {}) {
    return this.client.get('users', params);
  }

  me () {
    return this.client.get('users/me');
  }
}

module.exports = User;
