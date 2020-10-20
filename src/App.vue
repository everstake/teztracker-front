<template>
  <div id="app" :key="$route.path || getAppNetwork">
    <router-view :key="langChangeKey"></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'app',
    computed: {
      ...mapGetters('app', ['getAppNetwork']),
    },
    data() {
      return {
        langChangeKey: null,
      };
    },
    created() {
      this.checkHealth();

      this.$eventBus.$on('lang-change', (val) => {
        if (this.langChangeKey !== val) {
          this.langChangeKey = val;
        }
      });
    },
    methods: {
      async checkHealth() {
        try {
          const resp = await this.$api.checkHealth();

          if (this.$route.name === 'maintenance' && resp.data.status) {
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
