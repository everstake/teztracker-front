<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />
    <BiggestMoversTable type="sender" />
    <BiggestMoversTable type="receiver" />
  </div>
</template>

<script>
  import Breadcrumbs from '@/components/partials/Breadcrumbs';
  import BiggestMoversTable from '@/components/biggest_movers/BiggestMoversTable';

  export default {
    name: 'BiggestMovers',
    components: {
      Breadcrumbs,
      BiggestMoversTable,
    },
    data() {
      return {
        crumbs: [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'biggest_movers',
            text: this.$t('common.biggestMovers'),
          },
        ],
      };
    },
  };
</script>
