'use strict';

class Attachment {
  constructor (client) {
    this.client = client;
  }

  delete (conversationId, attachmentId) {
    return this.client.delete(`conversations/${conversationId}/attachments/${attachmentId}`);
  }

  getData (conversationId, attachmentId) {
    return this.client.get(`conversations/${conversationId}/attachments/${attachmentId}/data`);
  }

  upload (conversationId, threadId, data = {}) {
    return this.client.post(`conversations/${conversationId}/threads/${threadId}/attachments`, data);
  }
}

module.exports = Attachment;
