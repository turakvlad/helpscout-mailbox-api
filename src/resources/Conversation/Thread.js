'use strict';

class Thread {
  constructor (client) {
    this.client = client;
  }

  createChat (conversationId, data = {}) {
    return this.client.post(`conversations/${conversationId}/chats`, data);
  }

  createCustomer (conversationId, data = {}) {
    return this.client.post(`conversations/${conversationId}/customer`, data);
  }

  createNote (conversationId, data = {}) {
    return this.client.post(`conversations/${conversationId}/notes`, data);
  }

  createPhone (conversationId, data = {}) {
    return this.client.post(`conversations/${conversationId}/phones`, data);
  }

  createReply (conversationId, data = {}) {
    return this.client.post(`conversations/${conversationId}/reply`, data);
  }

  get (conversationId, threadId) {
    return this.client.get(`conversations/${conversationId}/threads/${threadId}/original-source`);
  }

  list (conversationId, params = {}) {
    return this.client.get(`conversations/${conversationId}/threads`, params);
  }

  update (conversationId, threadId, data = {}) {
    return this.client.patch(`conversations/${conversationId}/threads/${threadId}`, data);
  }
}

module.exports = Thread;
