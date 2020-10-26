<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-card no-body>
          <CardHeader>
            <template #left-content class="text">
              <h4 class="tz-title--bold">
                {{ $t('glossary.title') }}
              </h4>
            </template>
          </CardHeader>

          <div class="card-divider"></div>

          <b-card-body>
            <dl>
              <template v-for="(item, index) in $t('glossary.items')">
                <dt :key="`term ${index}`" class="text-accent">
                  {{ item.term }}
                </dt>
                <dd :key="`definition ${index}`" class="mb-3">
                  {{ item.definition }}
                </dd>
              </template>
            </dl>
          </b-card-body>
        </b-card>
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '@/components/partials/Breadcrumbs.vue';
  import CardHeader from '../components/partials/CardHeader';

  export default {
    name: 'Glossary',
    components: {
      Breadcrumbs,
      CardHeader,
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'glossary', text: this.$t('glossary.title') },
        ];
      },
    },
  };
</script>

<style lang="scss" scoped>
  dd {
    margin-left: 20px;
  }
</style>
