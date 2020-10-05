<template>
  <div class="main-wrap">
    <TopMenu />
    <div class="main-content">
      <section class="breadcrumbs m-0">
        <b-container fluid>
          <b-row>
            <b-col lg="12">
              <slot name="breadcrumbs" />
            </b-col>
          </b-row>
        </b-container>
      </section>

      <slot name="content" />
    </div>
    <Footer showLogo />
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
    props: {
      pageName: {
        type: String,
        default: '',
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
</style>
