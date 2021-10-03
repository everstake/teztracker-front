<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <CardHeader>
                <template #left-content class="text">
                  <h4 class="tz-title--bold">
                    {{ $t('listTypes.nftContractsList') }}
                  </h4>
                </template>

                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <NftContractsBody
                  :loading="loading"
                  :limit="limit"
                  :items="items"
                  :count="count"
                  :page="page"
                  @onLimitChange="handleLimitChange"
                  @onPageChange="handlePageChange"
                />
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import NftContractsBody from '@/components/nft_contracts/NftContractsBody';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'NftContracts',
    components: {
      Breadcrumbs,
      NftContractsBody,
      Counter,
      CardHeader,
    },
    mixins: [reloadNavigationList],
    data() {
      return {
        crumbs: [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'nft_contracts',
            text: this.$t('pageTypes.nftContracts'),
          },
        ],
      };
    },
    methods: {
      async reload() {
        const { page, limit } = this;
        const response = await this.$api.getNftContracts({ page, limit });

        this.items = response.data;
        this.count = response.count;
      },
    },
  };
</script>
