'use strict';

class Company {
  constructor (client) {
    this.client = client;
  }

  getOverallReport (params = {}) {
    return this.client.get('reports/company', params);
  }

  getCustomersHelpedReport (params = {}) {
    return this.client.get('reports/company/customers-helped', params);
  }

  getDrilldownReport (params = {}) {
    return this.client.get('reports/company/drilldown', params);
  }
}

module.exports = Company;
