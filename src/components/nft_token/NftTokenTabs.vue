<template>
  <b-card no-body>
    <b-tabs lazy>
      <NftTokenHoldersTab active />
    </b-tabs>
  </b-card>
</template>

<script>
  import NftTokenHoldersTab from '@/components/nft_token/NftTokenHoldersTab';

  export default {
    name: 'NftTokensTabs',
    components: {
      NftTokenHoldersTab,
    },
  };
</script>
