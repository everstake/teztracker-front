<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <div class="network-graph">
      <NetworkGraph />
    </div>
  </div>
</template>

<script>
  import Breadcrumbs from '@/components/partials/Breadcrumbs';
  import NetworkGraph from '@/components/charts/networkGraph/NetworkGraph';

  export default {
    name: 'Accounts',
    components: {
      Breadcrumbs,
      NetworkGraph,
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'accounts_network',
            text: this.$t('common.accountsNetwork'),
          },
        ];
      },
    },
  };
</script>

<style lange="scss" scoped>
  .network-graph {
    padding: 30px;
  }
</style>
