'use strict';

class Webhook {
  constructor (client) {
    this.client = client;
  }

  create (data = {}) {
    return this.client.post('webhooks', data);
  }

  delete (webhookId) {
    return this.client.delete(`webhooks/${webhookId}`);
  }

  get (webhookId) {
    return this.client.get(`webhooks/${webhookId}`);
  }

  list (params = {}) {
    return this.client.get('webhooks', params);
  }

  update (webhookId, data = {}) {
    return this.client.put(`webhooks/${webhookId}`, data);
  }
}

module.exports = Webhook;
