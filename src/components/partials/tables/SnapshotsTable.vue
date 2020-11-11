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
    <template slot="cycle" slot-scope="row">
      {{ row.item.cycle | formatInteger }}
    </template>
    <template slot="cycleStart" slot-scope="row">
      {{ row.item.cycleStart | timeformat(dateFormat) }}
    </template>
    <template slot="cycleEnd" slot-scope="row">
      {{ row.item.cycleEnd | timeformat(dateFormat) }}
    </template>
    <template slot="level" slot-scope="row">
      <b-link
        :to="{ name: 'block', params: { level: row.item.snapshot_block } }"
      >
        {{ row.item.snapshot_block | formatInteger }}
      </b-link>
    </template>
    <template slot="rolls" slot-scope="row">
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
          { key: 'cycleStart', label: this.$t('common.cycleStart') },
          { key: 'cycleEnd', label: this.$t('common.cycleEnd') },
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'rolls', label: this.$t('common.rolls') },
        ];
      },
    },
  };
</script>
