<template>
  <div id="app" :key="getAppNetwork">
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'app',
    computed: {
      ...mapGetters('app', ['getAppNetwork']),
    },
    created() {
      this.checkHealth();
    },
    methods: {
      async checkHealth() {
        try {
          const resp = await this.$api.checkHealth();
          if (resp.status === 500) {
            this.$router.replace({ name: 'maintenance' });
          }

          if (this.$route.name === 'maintenance' && resp.status === 200) {
            this.$router.replace({ name: 'network' });
          }
        } catch (e) {
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
