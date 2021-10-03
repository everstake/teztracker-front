<template>
  <Tab :title="$t('common.operations')" :active="active">
    <template v-slot:header>
      <CardHeader>
        <template #left-content class="text">
          <h4 class="tz-title--bold">
            {{ $t('nft.operationsList') }}
          </h4>
        </template>

        <template #right-content class="text">
          <Counter show-line :count="count" :loading="loading" />
        </template>
      </CardHeader>
    </template>

    <template v-slot:body>
      <TxsList
        :loading="loading"
        :limit="limit"
        :items="items"
        :count="count"
        :page="page"
        :fields="fields"
        @onLimitChange="handleLimitChange"
        @onPageChange="handlePageChange"
      />
    </template>
  </Tab>
</template>

<script>
  import Tab from '@/components/partials/Tab';
  import CardHeader from '@/components/partials/CardHeader';
  import Counter from '@/components/partials/Counter';
  import TxsList from '@/components/transactions/TxsList.vue';

  export default {
    name: 'NftContractOperationsTab',
    components: {
      Tab,
      CardHeader,
      Counter,
      TxsList,
    },
    props: {
      active: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        items: null,
        loading: false,
        page: 1,
        limit: 10,
        count: null,
        fields: ['level', 'txhash', 'from', 'fee', 'timestamp'],
      };
    },
    computed: {
      address() {
        return this.$route.params.address;
      },
    },
    mounted() {
      this.fetch();
    },
    methods: {
      async fetch() {
        this.loading = true;

        try {
          const response = await this.$api.getNftContractOperations(
            { address: this.address },
            {
              page: this.page,
              limit: this.limit,
            },
          );

          this.items = response.data;

          if (!this.count) {
            this.count = response.count;
          }
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }

        this.loading = false;
      },

      handlePageChange(page) {
        this.page = page;
        this.fetch();
      },

      handleLimitChange(limit) {
        this.limit = limit;
        this.fetch();
      },
    },
  };
</script>
