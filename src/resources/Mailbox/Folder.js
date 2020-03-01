'use strict';

class Folder {
  constructor (client) {
    this.client = client;
  }

  list (mailboxId, params = {}) {
    return this.client.get(`mailboxes/${mailboxId}/folders`, params);
  }
}

module.exports = Folder;
