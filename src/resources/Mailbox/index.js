'use strict';

const CustomField = require('./CustomField');
const Folder = require('./Folder');

class Mailbox {
  constructor (client) {
    this.client = client;

    this.customFields = new CustomField(client);
    this.folders = new Folder(client);
  }

  get (mailboxId) {
    return this.client.get(`mailboxes/${mailboxId}`);
  }

  list (params = {}) {
    return this.client.get('mailboxes', params);
  }
}

module.exports = Mailbox;
