<template>
  <b-container class="err-page">
    <div class="err-page__content">
      <div>
        <img src="@/assets/img/404.svg" width="100%" alt="404 robot image" />
      </div>

      <div class="mb-4">
        <h1 class="err-page__title">{{ $t('errPages.page') }} 404</h1>

        <h2 class="err-page__subtitle">
          {{ $t('errPages.pageNotFound') }}
        </h2>
      </div>

      <b-btn
        :to="{ name: 'network' }"
        class="err-page__btn"
        variant="success"
        size="lg"
      >
        {{ $t('common.home') }}
      </b-btn>
    </div>
  </b-container>
</template>

<script>
  export default {
    name: 'NotFound',
  };
</script>

<style lang="scss" scoped>
  @import '~@/assets/scss/custom/err-page';
</style>
