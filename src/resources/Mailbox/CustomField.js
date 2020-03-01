'use strict';

class CustomField {
  constructor (client) {
    this.client = client;
  }

  list (mailboxId, params = {}) {
    return this.client.get(`mailboxes/${mailboxId}/fields`, params);
  }
}

module.exports = CustomField;
