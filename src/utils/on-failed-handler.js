'use strict';

module.exports = client =>
  async function onFailed (error, job) {
    if (error.response) {
      const { status } = error.response;

      if ([401, 429].includes(status) || status >= 500) {
        if (status === 401) {
          await client.refreshAccessToken();

          // Retry at once.
          return 0;
        }

        // Retry up to 5 times (in 100 ms, 200 ms, 400 ms, 800 and 1600 ms).
        if (job.retryCount < 5) return (job.retryCount + 1) * 100;
      }
    }
  };
