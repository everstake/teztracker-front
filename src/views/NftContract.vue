<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <NftContractCard />
      </b-container>
    </section>

    <section>
      <b-container fluid>
        <NftContractTabs />
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import NftContractCard from '@/components/nft_contract/NftContractCard';
  import NftContractTabs from '@/components/nft_contract/NftContractTabs';

  export default {
    name: 'NftContract',
    components: {
      Breadcrumbs,
      NftContractTabs,
      NftContractCard,
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
            params: {
              address: this.$route.params.address,
            },
            text: this.$t('pageTypes.nftContract'),
          },
        ];
      },
    },
  };
</script>
