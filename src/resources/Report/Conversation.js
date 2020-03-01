'use strict';

class Conversation {
  constructor (client) {
    this.client = client;
  }

  getOverallReport (params = {}) {
    return this.client.get('reports/conversations', params);
  }

  getVolumesByChannelReport (params = {}) {
    return this.client.get('reports/conversations/volume-by-channel', params);
  }

  getBusiesTimeOfDayReport (params = {}) {
    return this.client.get('reports/conversations/busy-times', params);
  }

  getDrilldownReport (params = {}) {
    return this.client.get('reports/conversations/drilldown', params);
  }

  getDrilldownByFieldReport (params = {}) {
    return this.client.get('reports/conversations/fields-drilldown', params);
  }

  getNewConversationsReport (params = {}) {
    return this.client.get('reports/conversations/new', params);
  }

  getNewConversationsDrilldownReport (params = {}) {
    return this.client.get('reports/conversations/new-drilldown', params);
  }

  getReceivedMessagesReport (params = {}) {
    return this.client.get('reports/conversations/received-messages', params);
  }
}

module.exports = Conversation;
