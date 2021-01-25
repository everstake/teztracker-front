<template>
  <div id="app" :key="getAppNetwork">
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';

  export default {
    name: 'App',
    computed: {
      ...mapState('app', ['isWsConnectionOpen']),
      ...mapGetters('app', ['getAppNetwork']),
      ...mapGetters('user', ['isBeaconAccountSet']),
    },
    watch: {
      getAppNetwork: {
        immediate: true,
        async handler() {
          if (this.isWsConnectionOpen) {
            this.$ws.close();
          }
          this.$ws.connect();

          // If a dApp network changes a user needs to reset a connection
          // to be able to get permissions for the needed network.
          if (this.isBeaconAccountSet) {
            await this.$beacon.resetConnection();
          }
        },
      },
    },
    created() {
      this.checkHealth();
    },
    methods: {
      async checkHealth() {
        try {
          // const resp = await this.$api.checkHealth();
          // if (resp && resp.status === 500) {
          //   this.$router.replace({ name: 'maintenance' });
          // }

          // if (this.$route.name === 'maintenance' && resp.status === 200) {
          //   this.$router.replace({ name: 'network' });
          // }
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
          // this.$router.replace({ name: 'maintenance' });
        }
      },
    },
  };
</script>

<style lang="scss">
  @import 'assets/scss/index';

  #app {
    overflow-x: hidden;
  }
</style>
