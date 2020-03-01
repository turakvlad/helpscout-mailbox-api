'use strict';

class User {
  constructor (client) {
    this.client = client;
  }

  getOverallReport (params = {}) {
    return this.client.get('reports/user', params);
  }

  getConversationHistoryReport (params = {}) {
    return this.client.get('reports/user/conversation-history', params);
  }

  getCustomersHelpedReport (params = {}) {
    return this.client.get('reports/user/customers-helped', params);
  }

  getDrilldownReport (params = {}) {
    return this.client.get('reports/user/drilldown', params);
  }

  getHappinessReport (params = {}) {
    return this.client.get('reports/user/happiness', params);
  }

  getHappinessDrilldownReport (params = {}) {
    return this.client.get('reports/user/ratings', params);
  }

  getRepliesReport (params = {}) {
    return this.client.get('reports/user/replies', params);
  }

  getResolutionsReport (params = {}) {
    return this.client.get('reports/user/resolutions', params);
  }
}

module.exports = User;
