<template>
  <div class="list snapshots-list">
    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="6"
        :columns="3"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <SnapshotsTable
      v-else
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
  import SnapshotsTable from '@/components/partials/tables/SnapshotsTable';

  export default {
    name: 'SnapshotsList',
    components: {
      SnapshotsTable,
      PaginationNav,
    },
    props: {
      items: Array,
      count: Number,
      limit: Number,
      page: Number,
      loading: Boolean,
    },
    computed: {
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'cycle', label: this.$tc('common.cycle', 2) },
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'rolls', label: this.$t('common.rolls') },
        ];
      },
    },
  };
</script>
