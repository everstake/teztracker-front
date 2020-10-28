<template>
  <div class="main-wrap">
    <TopMenu v-if="!isBasicPage" />

    <main
      :class="{
        'main-content': true,
        'main-content--white': isBasicPage,
      }"
    >
      <router-view />
    </main>

    <Footer v-if="!isBasicPage" show-logo />
  </div>
</template>

<script>
  import TopMenu from '@/components/partials/menus/TopMenu';
  import Footer from '@/components/partials/menus/Footer';

  export default {
    name: 'PageContentContainer',
    components: {
      TopMenu,
      Footer,
    },
    data() {
      return {
        routesWithNoMenus: ['404', '500', 'maintenance'],
      };
    },
    computed: {
      routeName() {
        return String(this.$route.name);
      },
      isBasicPage() {
        return this.routesWithNoMenus.includes(this.routeName);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .main-wrap {
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    background-color: $color-teal--light;
    flex: 1 0 auto;

    &--white {
      background-color: $color-white;
    }
  }
</style>
