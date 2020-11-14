<template>
  <div class="list accounts-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect :loading="loading" :limit="limit" @onLimitChange="(limit) => $emit('onLimitChange', limit)" />
    </div>
  
    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="10"
        :columns="4"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <AccountsTable
      v-else
      :propsFields="propsFields"
      :loading="loading"
      :items="items"
      :page="page"
      :limit="limit"
    />

    <div class="pagination-block">
      <PaginationNav
        :limit="limit"
        :page="page"
        :count="count"
        :loading="loading"
        @onPageChange="(page) => $emit('onPageChange', page)"
      />
    </div>
  </div>
</template>
<script>
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationNav from '@/components/partials/PaginationNav';
  import AccountsTable from '@/components/partials/tables/AccountsTable';

  export default {
    name: 'AccountsList',
    components: {
      AccountsTable,
      PaginationNav,
      LimitSelect,
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
