<template>
  <b-btn @click="pairBeacon(currentNetwork)" class="beacon-btn">
    <font-awesome-icon
      :icon="['fas', 'user']"
      class="beacon-icon"
      :class="{
        'beacon-account-active': isBeaconAccountSet,
      }"
    />
  </b-btn>
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
          return this.$route.name !== 'account_profile'
            ? this.$router.push({ name: 'account_profile' })
            : false;
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
          // eslint-disable-next-line
          console.error(e);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .beacon-account-active {
    color: $color-brand;
  }

  .beacon-btn {
    color: $color-black--opacity-05;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    border-radius: 0;
  }

  .beacon-btn:hover,
  .beacon-btn:active,
  .beacon-btn:focus {
    background: none !important;
    border: none !important;
    border-radius: 0;
    box-shadow: none !important;
  }
</style>
