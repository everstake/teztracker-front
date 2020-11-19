<template>
  <div class="list bakers-list">
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
        :rows="10"
        :columns="7"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <BakersTable
      v-else
      :props-fields="propsFields"
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
  import BakersTable from '@/components/partials/tables/BakersTable';
  import PaginationNav from '@/components/partials/PaginationNav';
  import LimitSelect from '@/components/partials/LimitSelect';

  export default {
    name: 'BakersList',
    components: {
      PaginationNav,
      BakersTable,
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
