<template>
  <div class="list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :loading="loading"
        :limit="limit"
        @onLimitChange="(limit) => $emit('onLimitChange', limit)"
      />
    </div>

    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="3"
        :columns="5"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>

    <NftContractsTable v-else :items="items" :page="page" :limit="limit" />

    <PaginationNav
      :limit="limit"
      :page="page"
      :count="count"
      :loading="loading"
      @onPageChange="(page) => $emit('onPageChange', page)"
    />
  </div>
</template>

<script>
  import NftContractsTable from '@/components/nft_contracts/NftContractsTable';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationNav from '@/components/partials/PaginationNav';

  export default {
    name: 'NftContractsBody',
    components: {
      PaginationNav,
      LimitSelect,
      NftContractsTable,
    },
    props: {
      items: {
        type: Array,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
      limit: {
        type: Number,
        required: true,
      },
      page: {
        type: Number,
        required: true,
      },
      loading: Boolean,
      showLimitFilter: {
        type: Boolean,
        default: true,
      },
    },
  };
</script>
