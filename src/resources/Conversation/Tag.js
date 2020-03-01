'use strict';

class Tag {
  constructor (client) {
    this.client = client;
  }

  update (conversationId, data = {}) {
    return this.client.put(`conversations/${conversationId}/tags`, data);
  }
}

module.exports = Tag;
