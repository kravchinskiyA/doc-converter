export function startMaintenance() {
  console.log('Maintenance process initialized');
}

if (process.env['NODE_ENV'] !== 'test') {
  startMaintenance();
}

