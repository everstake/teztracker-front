<template>
  <Tab :title="$t('common.tokens')" :active="active">
    <template v-slot:header>
      <CardHeader>
        <template #left-content class="text">
          <h4 class="tz-title--bold">
            {{ $t('nft.tokenList') }}
          </h4>
        </template>

        <template #right-content class="text">
          <Counter show-line :count="count" :loading="loading" />
        </template>
      </CardHeader>
    </template>

    <template v-slot:body>
      <div class="d-flex justify-content-between mb-2">
        <LimitSelect
          :loading="loading && !items"
          :limit="limit"
          @onLimitChange="handleLimitChange"
        />
      </div>

      <div v-if="loading && !items" class="table-skeleton">
        <b-skeleton-table
          responsive
          :rows="3"
          :columns="5"
          :table-props="{ borderless: true, responsive: true }"
          animation="none"
          class="table-skeleton"
        />
      </div>

      <b-table
        show-empty
        :items="items"
        :fields="fields"
        :current-page="page"
        :per-page="0"
        borderless
        class="transactions-table table-responsive-md"
      >
        <template #cell(number)="{ index }">
          {{ index + 1 + limit * (page - 1) }}
        </template>

        <template #cell(name)="{ item }">
          <b-link
            :to="{
              name: 'nft_token',
              params: {
                address: $route.params.address,
                tokenId: item.token_id,
              },
            }"
            class="text-wrap"
          >
            {{ item.name }}
          </b-link>
        </template>

        <template #cell(amount)="{ item }">
          {{ item.amount }}
        </template>
      </b-table>

      <PaginationNav
        :limit="limit"
        :page="page"
        :count="count"
        :loading="loading && !items"
        @onPageChange="handlePageChange"
      />
    </template>
  </Tab>
</template>

<script>
  import Tab from '@/components/partials/Tab';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationNav from '@/components/partials/PaginationNav';
  import CardHeader from '@/components/partials/CardHeader';
  import Counter from '@/components/partials/Counter';

  export default {
    name: 'NftContractTokensTab',
    components: {
      Tab,
      LimitSelect,
      PaginationNav,
      CardHeader,
      Counter,
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
      };
    },
    computed: {
      address() {
        return this.$route.params.address;
      },
      fields() {
        return [
          { key: 'number', label: this.$t('common.ordinalNumber') },
          { key: 'name', label: this.$t('common.tokenName') },
          { key: 'amount', label: this.$t('common.amount') },
        ];
      },
    },
    mounted() {
      this.fetch();
    },
    methods: {
      async fetch() {
        this.loading = true;

        try {
          const response = await this.$api.getNftTokens(
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
