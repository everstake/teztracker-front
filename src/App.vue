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
    },
    watch: {
      getAppNetwork: {
        immediate: true,
        handler() {
          if (this.isWsConnectionOpen) {
            this.$ws.close();
          }
          this.$ws.connect();
        },
      },
    },
    created() {
      this.checkHealth();
    },
    methods: {
      async checkHealth() {
        try {
          const resp = await this.$api.checkHealth();
          if (resp && resp.status === 500) {
            this.$router.replace({ name: 'maintenance' });
          }

          if (this.$route.name === 'maintenance' && resp.status === 200) {
            this.$router.replace({ name: 'network' });
          }
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
          this.$router.replace({ name: 'maintenance' });
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
