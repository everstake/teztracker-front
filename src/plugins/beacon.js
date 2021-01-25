import Vue from 'vue';
import {
  DAppClient,
  NetworkType,
  TezosOperationType,
} from '@airgap/beacon-sdk';

const formNetwork = (network) => {
  const availableNetworks = ['mainnet', 'carthagenet'];
  if (!availableNetworks.includes(network)) throw new Error('Unknown network');

  return {
    type: NetworkType[network.toUpperCase()],
  };
};

const convertXTZToMutez = (amount) => {
  return `${Number(amount) * Vue.prototype.$constants.XTZ}`;
};

Vue.use({
  install(Vue) {
    Vue.prototype.$beacon = {
      client: new DAppClient({
        name: 'TezTracker',
      }),
      async initClient() {
        try {
          await this.client.init();
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      },
      // The method can work with and without the Beacon extension.
      // If the dApp is not paired with a wallet the pairing window appears (the SDK init() method).
      // BUT! If a user works with the extension and doesn't set it up (pair with their wallet),
      // this method tries to pair the extension with the wallet first and ends its execution there.
      // Therefore the user has to call this method again to actually receive their permissions.
      async requestPermissions(network = 'mainnet') {
        try {
          return await this.client.requestPermissions({
            network: formNetwork(network),
          });
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      },
      // Remove the account from the local storage
      async resetConnection() {
        try {
          return await this.client.setActiveAccount(undefined);
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      },
      // Get the account from the local storage
      async getActiveAccount() {
        try {
          return await this.client.getActiveAccount();
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      },
      // Amount is accepted in mutez. The min value is '1'.
      async sendTx(amount, destination) {
        try {
          return await this.client.requestOperation({
            operationDetails: [
              {
                kind: TezosOperationType.TRANSACTION,
                amount: convertXTZToMutez(amount),
                destination: destination,
              },
            ],
          });
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      },
      async sendDelegation(delegate = '') {
        const payload = {
          kind: TezosOperationType.DELEGATION,
        };

        if (delegate) payload.delegate = delegate;

        try {
          return await this.client.requestOperation({
            operationDetails: [payload],
          });
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      },
    };
  },
});
