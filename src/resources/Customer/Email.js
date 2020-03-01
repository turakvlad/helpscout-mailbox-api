'use strict';

class Email {
  constructor (client) {
    this.client = client;
  }

  create (customerId, data = {}) {
    return this.client.post(`customers/${customerId}/emails`, data);
  }

  delete (customerId, emailId) {
    return this.client.delete(`customers/${customerId}/emails/${emailId}`);
  }

  list (customerId, params = {}) {
    return this.client.get(`customers/${customerId}/emails`, params);
  }

  update (customerId, emailId, data = {}) {
    return this.client.put(`customers/${customerId}/emails/${emailId}`, data);
  }
}

module.exports = Email;
