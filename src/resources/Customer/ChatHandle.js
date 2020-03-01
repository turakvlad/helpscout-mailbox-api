'use strict';

class ChatHandle {
  constructor (client) {
    this.client = client;
  }

  create (customerId, data = {}) {
    return this.client.post(`customers/${customerId}/chats`, data);
  }

  delete (customerId, chatId) {
    return this.client.delete(`customers/${customerId}/chats/${chatId}`);
  }

  list (customerId, params = {}) {
    return this.client.get(`customers/${customerId}/chats`, params);
  }

  update (customerId, chatId, data = {}) {
    return this.client.put(`customers/${customerId}/chats/${chatId}`, data);
  }
}

module.exports = ChatHandle;
