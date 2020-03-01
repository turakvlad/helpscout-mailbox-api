'use strict';

const Attachment = require('./Attachment');
const CustomField = require('./CustomField');
const Tag = require('./Tag');
const Thread = require('./Thread');

class Conversation {
  constructor (client) {
    this.client = client;

    this.attachments = new Attachment(client);
    this.customFields = new CustomField(client);
    this.tags = new Tag(client);
    this.threads = new Thread(client);
  }

  create (data = {}) {
    return this.client.post('conversations', data);
  }

  delete (conversationId) {
    return this.client.delete(`conversations/${conversationId}`);
  }

  get (conversationId, params = {}) {
    return this.client.get(`conversations/${conversationId}`, params);
  }

  list (params = {}) {
    return this.client.get('conversations', params);
  }

  update (conversationId, data = {}) {
    return this.client.patch(`conversations/${conversationId}`, data);
  }
}

module.exports = Conversation;
