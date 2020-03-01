'use strict';

class CustomField {
  constructor (client) {
    this.client = client;
  }

  update (conversationId, data = {}) {
    return this.client.put(`conversations/${conversationId}/fields`, data);
  }
}

module.exports = CustomField;
