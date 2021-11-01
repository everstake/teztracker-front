<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />
    <BiggestTransfersTable />
  </div>
</template>

<script>
  import Breadcrumbs from '@/components/partials/Breadcrumbs';
  import BiggestTransfersTable from '@/components/biggest_transfers/BiggestTransfersTable';

  export default {
    name: 'BiggestTransfers',
    components: {
      Breadcrumbs,
      BiggestTransfersTable,
    },
    data() {
      return {
        crumbs: [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'biggest_transfer',
            text: this.$t('pageTypes.biggestTransfers'),
          },
        ],
      };
    },
  };
</script>
