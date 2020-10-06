<template>
  <main>
    <section class="maintenance">
      <div class="maintenance__content">
        <b-container>
          <div class="maintenance__img-holder">
            <Gears />
          </div>
          <h1 class="mb-4">{{ $t('maintenance.title') }}</h1>
          <p class="mb-0 fs-16">
            {{ $t('maintenance.p1') }}
          </p>
          <p class="fs-16">
            {{ $t('maintenance.p2') }}
          </p>
        </b-container>
      </div>
    </section>
  </main>
</template>

<script>
  import Gears from '@/components/partials/Gears';

  export default {
    name: 'Maintenance',
    components: {
      Gears,
    },
  };
</script>

<style lang="scss" scoped>
  .maintenance {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    &__content {
      text-align: center;
    }

    &__img-holder {
      text-align: center;
    }
  }
</style>
