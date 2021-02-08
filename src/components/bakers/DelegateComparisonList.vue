<template>
  <div class="list bakers-list-public">
    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="10"
        :columns="10"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <DelegateComparisonTable
      v-else
      :props-fields="propsFields"
      :loading="loading"
      :items="items"
      :limit="limit"
    />
  </div>
</template>

<script>
  import DelegateComparisonTable from '@/components/partials/tables/DelegateComparisonTable';

  export default {
    name: 'DelegateComparisonList',
    components: {
      DelegateComparisonTable,
    },
    props: {
      items: Array,
      limit: Number,
      loading: Boolean,
      propsFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
  };
</script>
