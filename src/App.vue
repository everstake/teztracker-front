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
      this.$eventBus.$on('lang-change', (val) => {
        if (this.langChangeKey !== val) {
          this.langChangeKey = val;
        }
      });
    },
  };
</script>

<style lang="scss">
  @import 'assets/scss/index';

  #app {
    overflow-x: hidden;
  }
</style>
