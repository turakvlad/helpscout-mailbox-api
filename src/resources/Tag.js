'use strict';

class Tag {
  constructor (client) {
    this.client = client;
  }

  list (params = {}) {
    return this.client.get('tags', params);
  }
}

module.exports = Tag;
