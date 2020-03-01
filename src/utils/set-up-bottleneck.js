'use strict';

const Bottleneck = require('bottleneck');
const onFailedHandler = require('./on-failed-handler');

module.exports = client => {
  const bottleneck = new Bottleneck({
    maxConcurrent: 2,
    minTime: 125,
    reservoir: 400,
    reservoirRefreshAmount: 400,
    reservoirRefreshInterval: 60 * 1000
  });

  bottleneck.on('failed', onFailedHandler(client));

  return bottleneck;
};
