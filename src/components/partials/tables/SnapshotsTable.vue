<template>
  <b-table
    responsive
    show-empty
    :items="items"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table"
    :empty-text="$t('common.noData')"
  >
    <template #cell(cycle)="row">
      {{ row.item.cycle | formatInteger }}
    </template>
    <template #cell(level)="row">
      <b-link
        :to="{ name: 'block', params: { level: row.item.snapshot_block } }"
      >
        {{ row.item.snapshot_block | formatInteger }}
      </b-link>
    </template>
    <template #cell(rolls)="row">
      {{ row.item.rolls | formatInteger }}
    </template>
  </b-table>
</template>

<script>
  export default {
    name: 'SnapshotsTable',
    props: {
      items: Array,
      page: Number,
      limit: Number,
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
