export function startWorker() {
  console.log('Worker coordinator initialized');
}

if (process.env['NODE_ENV'] !== 'test') {
  startWorker();
}

