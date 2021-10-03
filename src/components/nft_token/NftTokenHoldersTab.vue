<template>
  <Tab :title="$t('common.holders')" :active="active">
    <template v-slot:header>
      <CardHeader>
        <template #left-content class="text">
          <h4 class="tz-title--bold">
            {{ $t('nft.holdersList') }}
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

        <template #cell(account)="{ item }">
          <span class="position-relative w-100 d-flex align-items-center">
            <IdentIcon :seed="item.account_id" />

            <b-link
              :to="{ name: 'account', params: { account: item.account_id } }"
            >
              {{ item.account_id }}
            </b-link>

            <BtnCopy :text-to-copy="item.account_id" />
          </span>
        </template>

        <template #cell(balance)="{ item }">
          {{ item.balance }}
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
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';

  export default {
    name: 'NftTokenHoldersTab',
    components: {
      Tab,
      LimitSelect,
      PaginationNav,
      CardHeader,
      Counter,
      IdentIcon,
      BtnCopy,
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
      tokenId() {
        return this.$route.params.tokenId;
      },
      fields() {
        return [
          { key: 'account', label: this.$t('common.account') },
          { key: 'balance', label: this.$t('common.balance') },
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
          const response = await this.$api.getNftTokenHolders(
            {
              address: this.address,
              tokenId: this.tokenId,
            },
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
