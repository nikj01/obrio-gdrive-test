export const getProcessorSettings = () => ({
  concurrency: 20,
  useWorkerThreads: true,
  lockDuration: 60000,
  stalledInterval: 30000,
});
