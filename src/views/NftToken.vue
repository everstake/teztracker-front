<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <NftTokenCard />
      </b-container>
    </section>

    <section>
      <b-container fluid>
        <NftTokenTabs />
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import NftTokenCard from '@/components/nft_token/NftTokenCard';
  import NftTokenTabs from '@/components/nft_token/NftTokenTabs';

  export default {
    name: 'NftToken',
    components: {
      Breadcrumbs,
      NftTokenTabs,
      NftTokenCard,
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'nft_contracts',
            text: this.$t('pageTypes.nftContracts'),
          },
          {
            toRouteName: `nft_contract`,
            text: this.$t('pageTypes.nftContract'),
            params: {
              address: this.$route.params.address,
            },
          },
          {
            toRouteName: `nft_token`,
            text: this.$t('pageTypes.nftToken'),
            params: {
              address: this.$route.params.address,
              tokenId: this.$route.params.tokenId,
            },
          },
        ];
      },
    },
  };
</script>
