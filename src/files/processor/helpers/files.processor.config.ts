export const getProcessorSettings = () => ({
  concurrency: 20,
  useWorkerThreads: true,
  lockDuration: 5 * 60000,
  keepAlive: true,
  stalledInterval: 30000,
  maxStalledCount: 1,
});
