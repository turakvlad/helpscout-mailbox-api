'use strict';

class SocialProfile {
  constructor (client) {
    this.client = client;
  }

  create (customerId, data = {}) {
    return this.client.post(`customers/${customerId}/social-profiles`, data);
  }

  delete (customerId, socialProfileId) {
    return this.client.delete(`customers/${customerId}/social-profiles/${socialProfileId}`);
  }

  list (customerId, params = {}) {
    return this.client.get(`customers/${customerId}/social-profiles`, params);
  }

  update (customerId, socialProfileId, data = {}) {
    return this.client.put(`customers/${customerId}/social-profiles/${socialProfileId}`, data);
  }
}

module.exports = SocialProfile;
