<template>
  <div class="baking-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="perPage"
        :loading="loading"
        @onLimitChange="(limit) => $emit('onLimitChange', { type: 'baking', limit })"
      />
    </div>

    <b-table
      responsive
      show-empty
      :items="data"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      selectable
      :select-mode="'single'"
      :tbody-tr-class="getRowClass"
      class="transactions-table"
      :empty-text="$t('common.noData')"
      @row-selected="handleRowClick"
    >
      <template slot="avgPriority" slot-scope="row">
        {{ row.item.avgPriority }}
      </template>
      <template slot="rewards" slot-scope="row">
        {{ row.item.rewards | tezosToFixed }}
      </template>
    </b-table>

    <PaginationSelect
      :total-rows="count"
      :per-page="perPage"
      :current-page="currentPage"
      :loading="loading"
      @onPageChange="(page) => $emit('onPageChange', { type: 'baking', page })"
    />

    <div>
      <b-modal id="modal-baking" size="lg" centered hide-header hide-footer>
        <b-table
          responsive
          show-empty
          :items="selectedRow.data"
          :fields="selectedRow.fields"
          :current-page="selectedRow.currentPage"
          :per-page="0"
          borderless
          class="transactions-table baker-baking-table"
          :empty-text="$t('common.noData')"
        >
          <template slot="level" slot-scope="row">
            <b-link :to="{ name: 'block', params: { level: row.item.level } }">
              {{ row.item.level | formatInteger }}
            </b-link>
          </template>
          <template slot="reward" slot-scope="row">
            {{ row.item.reward | tezosToFixed }}
          </template>
          <template slot="deposit" slot-scope="row">
            {{ row.item.deposit | tezosToFixed }}
          </template>
          <template slot="timestamp" slot-scope="row">
            {{ row.item.timestamp | timeformat(dateFormat) }}
          </template>
          <template slot="estimated_time" slot-scope="row">
            {{ formatDate(row.item.estimated_time) }}
          </template>
        </b-table>

        <Pagination
          v-model="selectedRow.currentPage"
          :total-rows="selectedRow.count"
          :per-page="selectedRow.perPage"
          :class="{
            'page__el--loading': selectedRow.loading,
          }"
          @change="handleModalPagination"
        />
      </b-modal>
    </div>
  </div>
</template>

<script>
  import LimitSelect from '@/components/partials/LimitSelect';
  import Pagination from '../Pagination';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import { mapState } from 'vuex';
  import moment from 'moment';

  export default {
    name: 'BakingTabList',
    components: {
      LimitSelect,
      Pagination,
      PaginationSelect,
    },
    props: {
      data: {
        type: Array,
        default() {
          return [];
        },
      },
      future: Array,
      total: Object,
      count: {
        type: Number,
        default: 0,
      },
      account: String,
      currentPage: Number,
      perPage: Number,
      loaded: Boolean,
      loading: Boolean,
    },
    data() {
      return {
        selectedRow: {
          type: null,
          data: null,
          count: 0,
          fields: [],
          currentPage: 1,
          loading: false,
        },
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        if (!this.$i18n.locale) {
          return [];
        }

        return [
          { key: 'cycle', label: this.$tc('common.cycle', 1) },
          { key: 'blocks', label: this.$tc('common.block', 2) },
          { key: 'avgPriority', label: this.$t('bakerSingle.avgPriority') },
          { key: 'missed', label: this.$t('bakerSingle.missed') },
          { key: 'stolen', label: this.$t('bakerSingle.stolen') },
          { key: 'rewards', label: this.$tc('common.reward', 2) },
          { key: 'status', label: this.$tc('statusTypes.status') },
        ];
      },
    },
    watch: {
      'selectedRow.currentPage': {
        deep: true,
        async handler(value) {
          await this.reloadAccountBakingItem(value);
        },
      },
      'selectedRow.perPage': {
        deep: true,
        async handler() {
          await this.reloadAccountBakingItem();
        },
      },
    },
    async created() {
      const itemsNotFetched = !this.loaded;
      if (itemsNotFetched) {
        this.$emit('onReload', { type: 'baking', limit: this.perPage });
      }
    },
    methods: {
      formatDate(date) {
        return moment(date).format(this.dateFormat);
      },
      getRowClass(item) {
        if (item === null || !item.status) {
          return 'baking-list-row';
        }

        const classes = ['baking-list-row'];

        if (typeof item === 'object') {
          if (item.class && item.class === 'total') {
            classes.push('is-total');
          }

          if (item.class && item.class === 'future') {
            classes.push('is-future');
          }

          if (item.status === 'active') {
            classes.push('is-active');
          }

          if (item.status === 'frozen') {
            classes.push('is-frozen');
          }
        }

        return classes.join(' ');
      },
      async handleRowClick(row) {
        if (this.loading || row.length === 0) return;

        const isRowFuture = row[0].class === 'future';
        const isRowTotal = row[0].cycle === 'Total';

        if (isRowTotal) return;

        let modalData;
        let modalFields;
        this.cycleId = row[0].cycle;

        if (isRowFuture) {
          this.selectedRow.type = 'future';
          modalData = await this.$api.getAccountBakingRightsFuture({
            account: this.account,
            cycleId: row[0].cycle,
          });

          modalFields = [
            { key: 'level', label: this.$t('common.blockId') },
            { key: 'priority', label: this.$t('common.priority') },
            { key: 'reward', label: this.$tc('common.reward', 2) },
            { key: 'deposit', label: this.$t('common.deposit') },
            { key: 'estimated_time', label: 'Estimated time' },
          ];
        } else {
          this.selectedRow.type = 'baking';
          modalData = await this.$api.getAccountBakingItem({
            account: this.account,
            cycleId: row[0].cycle,
          });

          modalFields = [
            { key: 'level', label: this.$t('common.blockId') },
            { key: 'priority', label: this.$t('common.priority') },
            { key: 'reward', label: this.$tc('common.reward', 2) },
            { key: 'deposit', label: this.$t('common.deposit') },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        }

        this.selectedRow.fields = modalFields;
        this.selectedRow.data = modalData.data;
        this.selectedRow.count = modalData.count;
        this.$bvModal.show('modal-baking');
      },
      async reloadAccountBakingItem(page = 1) {
        const props = {
          page,
          account: this.account,
          cycleId: this.cycleId,
        };

        const { type } = this.selectedRow;
        let data;

        if (type === 'baking') {
          data = await this.$api.getAccountBakingItem(props);
        } else {
          data = await this.$api.getAccountBakingRightsFuture(props);
        }

        this.selectedRow.data = data.data;
        this.selectedRow.count = data.count;
      },
      handleModalPagination(page) {
        this.selectedRow.loading = true;
        this.selectedRow.currentPage = page;
        this.selectedRow.loading = false;
      },
    },
  };
</script>

<style lang="scss">
  .is {
    &-total {
      background-color: rgba(48, 146, 130, 0.7);
      pointer-events: none;

      & td {
        font-weight: 600;
      }
    }
    &-future {
      background-color: rgba(48, 146, 130, 0.4);
    }

    &--disabled {
      pointer-events: none;
    }

    &-frozen {
      background-color: rgba(158, 160, 165, 0.4);
    }
  }
  .baking-list-row {
    cursor: pointer;

    &:focus,
    &:active,
    &:hover {
      outline: none;
    }
  }

  .baking-list-row {
    &.b-table-row-selected {
      background: none;

      & td,
      & th,
      & tr {
        background-color: rgba(48, 146, 130, 0.7);
      }
    }

    &.is-total.b-table-row-selected {
      background-color: #fff;

      & td,
      & th,
      & tr {
        background-color: rgba(48, 146, 130, 0.7);
      }

      &.is-future.b-table-row-selected {
        & td,
        & th,
        & tr {
          background-color: rgba(48, 146, 130, 0.3);
        }
      }
    }

    &.is-active {
      font-weight: 600;
      background-color: rgba(48, 146, 130, 0.5);
    }
  }

  .baker-baking-table a {
    color: $color-brand;
  }

  .page-link,
  .page-item.active .page-link,
  .page-item.disabled .page-link,
  .page-link {
    background-color: transparent;
    color: #309282;
    border: none;
    outline: none;
  }

  .page-link {
    color: #9ea0a5;
  }

  .page-item:focus,
  .page-link:focus {
    box-shadow: none;
    outline: none;
  }

  .page-link:hover {
    color: #309282;
  }
</style>
