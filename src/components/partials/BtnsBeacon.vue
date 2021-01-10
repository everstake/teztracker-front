<template>
  <div>
    <b-btn
      variant="primary"
      :disabled="isBeaconAccountSet"
      @click="pairBeacon(currentNetwork)"
    >
      Login
    </b-btn>
    <b-btn
      :disabled="!isBeaconAccountSet"
      @click="$beacon.sendTx(0.1, 'tz1QGH5dEBBuGvBi5WCgn2LDRvdo1LD3ZNTy')"
    >
      Tx
    </b-btn>
    <b-btn
      :disabled="!isBeaconAccountSet"
      @click="$beacon.sendDelegation('tz1iQa8HPw2tKaCm5aSWqVn9L8b769iR6DEw')"
    >
      Del
    </b-btn>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex';
  import { SET_BEACON_ACCOUNT } from '@/store/mutations.types';

  export default {
    name: 'BtnsBeacon',
    computed: {
      ...mapState('user', ['beaconAccount']),
      ...mapGetters('app', {
        currentNetwork: 'getAppNetwork',
      }),
      ...mapGetters('user', ['isBeaconAccountSet']),
    },
    created() {
      (async () => {
        // Check if there is an active Beacon account set
        this[SET_BEACON_ACCOUNT](await this.$beacon.getActiveAccount());
        // If there is no active Beacon account, the pairing window is called
        // We don't need that on the app init
        if (this.isBeaconAccountSet) {
          // Without this function all the Beacon methods don't work when called
          // the first time
          await this.$beacon.initClient();
        }
      })();
    },
    methods: {
      ...mapMutations('user', [SET_BEACON_ACCOUNT]),
      async pairBeacon(network) {
        try {
          await this.$beacon.requestPermissions(network);
          this[SET_BEACON_ACCOUNT](await this.$beacon.getActiveAccount());
        } catch (e) {
          console.error(e);
        }
      },
    },
  };
</script>
