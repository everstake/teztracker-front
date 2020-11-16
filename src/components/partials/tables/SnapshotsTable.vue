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

      <font-awesome-icon
        icon="question-circle"
        class="icon icon-circle"
        @click.stop="toggleCycleToast(row)"
        @focusout="hideCycleToast()"
      />
      <div class="cycle-toast">
        <b-toast
          :id="`snapshots-${row.index}-${row.item.cycle}`"
          :title="`Cycle ${row.item.cycle}`"
          no-auto-hide
          static
          solid
        >
          <p class="cycle-toast__paragraph">
            {{ $t('common.startDate') }}:
            {{ row.item.cycleStart | timeformat(dateFormat) }}
          </p>
          <p class="cycle-toast__paragraph">
            {{ $t('common.endDate') }}:
            {{ row.item.cycleEnd | timeformat(dateFormat) }}
          </p>
        </b-toast>
      </div>
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
  import { mapState } from 'vuex';

  export default {
    name: 'SnapshotsTable',
    props: {
      items: Array,
      page: Number,
      limit: Number,
    },
    data() {
      return {
        toast: undefined,
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'cycle', label: this.$tc('common.cycle', 2) },
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'rolls', label: this.$t('common.rolls') },
        ];
      },
    },
    methods: {
      toggleCycleToast(row) {
        this.hideCycleToast();
        this.showCycleToast(row);
      },
      showCycleToast(row) {
        const index = row.index;
        const cycle = row.item.cycle;
        const id = `snapshots-${index}-${cycle}`;
        this.toast = id;
        this.$bvToast.show(id);
      },
      hideCycleToast() {
        if (this.toast) {
          this.$bvToast.hide(this.toast);
          this.toast = undefined;
        }
      },
    },
    updated() {
      this.hideCycleToast();
    },
  };
</script>

<style lang="scss" scoped>
  .icon-circle {
    cursor: pointer;
    font-size: 14px;
    color: #309282;
  }

  .cycle-toast {
    position: absolute;
    width: auto;
    font-weight: 400;
  }

  .cycle-toast__paragraph {
    margin-bottom: 5px;
  }

  .cycle-toast__paragraph:last-child {
    margin-bottom: 0;
  }
</style>
