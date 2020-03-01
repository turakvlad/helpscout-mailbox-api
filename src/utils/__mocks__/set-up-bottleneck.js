'use strict';

const mockFn = jest.fn().mockImplementation(() => {
  return {
    schedule: jest.fn().mockImplementation((options, callback) => {
      return callback().then(response => response);
    }),
    updateSettings: jest.fn()
  };
});

module.exports = mockFn;
