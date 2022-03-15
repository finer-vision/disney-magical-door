export default {
  server: {
    port: 3000,
  },
  // Timeout in milliseconds
  winnerVideoHoldTimeout: 10 * 1000,
  winningVideos: 3,
  // Number of milliseconds from start of day (midnight) to start of night
  nightStartTime: 1000 * 60 * 60 * 16,
};
