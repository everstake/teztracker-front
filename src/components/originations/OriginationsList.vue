<template>
  <div class="list originations-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect :loading="loading" :limit="limit" @onLimitChange="(limit) => $emit('onLimitChange', limit)" />
    </div>

    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="10"
        :columns="6"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <OriginationsTable
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
  import PaginationNav from '@/components/partials/PaginationNav';
  import OriginationsTable from '@/components/partials/tables/OriginationsTable';
  import LimitSelect from '@/components/partials/LimitSelect';

  export default {
    name: 'OriginationsList',
    components: {
      LimitSelect,
      OriginationsTable,
      PaginationNav,
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
