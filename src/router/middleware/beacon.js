import Vue from 'vue';

export default async function beaconGuard({ next, nextMiddleware }) {
  const activeAccount = await Vue.prototype.$beacon.getActiveAccount();
  const accountNotObject = typeof activeAccount !== 'object';
  const accountObjectEmpty =
    typeof activeAccount === 'object' && !Object.keys(activeAccount).length;

  if (accountNotObject || accountObjectEmpty) {
    return next({ name: 'network' });
  }

  return nextMiddleware();
}
