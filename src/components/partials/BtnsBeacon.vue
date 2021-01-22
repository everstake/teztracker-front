<template>
  <font-awesome-icon
    @click="pairBeacon(currentNetwork)"
    :icon="['fas', 'user']"
    class="beacon-icon"
  />
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
        if (this.isBeaconAccountSet) {
          return this.$router.push({ name: 'personal_account' });
        }

        try {
          await this.$beacon.requestPermissions(network);
          this[SET_BEACON_ACCOUNT](
            await this.$beacon.getActiveAccount().then((data) => {
              return data;
            }),
          );
          this.$router.push({ name: 'personal_account' });
        } catch (e) {
          console.error(e);
        }
      },
    },
  };
</script>
