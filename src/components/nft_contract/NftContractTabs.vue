<template>
  <b-card no-body>
    <b-tabs lazy>
      <NftContractTokensTab active />

      <NftContractOperationsTab />

      <NftContractStatsTab />
    </b-tabs>
  </b-card>
</template>

<script>
  import NftContractTokensTab from '@/components/nft_contract/NftContractTokensTab';
  import NftContractOperationsTab from '@/components/nft_contract/NftContractOperationsTab';
  import NftContractStatsTab from '@/components/nft_contract/NftContractStatsTab';

  export default {
    name: 'NftContractTabs',
    components: {
      NftContractTokensTab,
      NftContractOperationsTab,
      NftContractStatsTab,
    },
  };
</script>
