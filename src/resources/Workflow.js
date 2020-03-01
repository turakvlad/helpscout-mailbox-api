'use strict';

class Workflow {
  constructor (client) {
    this.client = client;
  }

  list (params = {}) {
    return this.client.get('workflows', params);
  }

  runManual (workflowId, data = {}) {
    return this.client.post(`workflows/${workflowId}/run`, data);
  }

  update (workflowId, data = {}) {
    return this.client.patch(`workflows/${workflowId}`, data);
  }
}

module.exports = Workflow;
