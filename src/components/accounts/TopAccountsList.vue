<template>
  <div class="list top-accounts-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect :loading="loading" :limit="limit" @onLimitChange="(limit) => $emit('onLimitChange', limit)" />
    </div>
  
    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="10"
        :columns="5"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <TopAccountsTable
      v-else
      :propsFields="propsFields"
      :loading="loading"
      :items="items"
      :page="page"
      :limit="limit"
    />

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
  import TopAccountsTable from '@/components/partials/tables/TopAccountsTable';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationNav from '@/components/partials/PaginationNav';

  export default {
    name: 'TopAccountsList',
    components: {
      PaginationNav,
      LimitSelect,
      TopAccountsTable,
    },
    props: {
      items: Array,
      count: Number,
      limit: Number,
      page: Number,
      loading: Boolean,
      showLimitFilter: {
        type: Boolean,
        default: true,
      },
      propsFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
  };
</script>
