<template>
  <div class="list assets-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect :loading="loading" :limit="limit" @onLimitChange="(limit) => $emit('onLimitChange', limit)" />
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
    <AssetsTable
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
  import AssetsTable from '@/components/partials/tables/AssetsTable';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationNav from '@/components/partials/PaginationNav';

  export default {
    name: 'AssetsList',
    components: {
      PaginationNav,
      LimitSelect,
      AssetsTable,
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
