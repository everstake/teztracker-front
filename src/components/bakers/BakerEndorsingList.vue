<template>
  <div class="endorsing-list">
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
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
      <template slot="rewards" slot-scope="row">
        {{ row.item.rewards | tezosToFixed }}
      </template>
    </b-table>

    <Pagination
      v-model="currentPage"
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
    />

    <div>
      <b-modal id="modal-endorsing" size="xl" centered hide-header hide-footer>
        <b-table
          responsive
          show-empty
          :items="selectedRow.data"
          :fields="selectedRow.fields"
          :current-page="selectedRow.currentPage"
          :per-page="0"
          borderless
          class="transactions-table baker-endorsing-table"
          :empty-text="$t('common.noData')"
        >
          <template slot="level" slot-scope="row">
            <b-link :to="{ name: 'block', params: { level: row.item.level } }">
              {{ row.item.level | formatInteger }}
            </b-link>
          </template>
          <template slot="blockLevel" slot-scope="row">
            <b-link
              :to="{ name: 'block', params: { level: row.item.blockLevel } }"
            >
              {{ row.item.blockLevel | formatInteger }}
            </b-link>
          </template>
          <template slot="reward" slot-scope="row">
            {{ row.item.reward | tezosToFixed }}
          </template>
          <template slot="avgPriority" slot-scope="row">
            {{ row.item.avgPriority }}
          </template>
          <template slot="rewards" slot-scope="row">
            {{ row.item.reward | tezosToFixed }}
          </template>
          <template slot="deposit" slot-scope="row">
            {{ row.item.deposit | tezosToFixed }}
          </template>
          <template slot="timestamp" slot-scope="row">
            {{ row.item.timestamp | timeformat(dateFormat) }}
          </template>
        </b-table>

        <Pagination
          v-model="selectedRow.currentPage"
          @change="handleModalPagination"
          :total-rows="selectedRow.count"
          :per-page="selectedRow.perPage"
        />
      </b-modal>
    </div>
  </div>
</template>

<script>
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import setPerPage from '@/mixins/setPerPage';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import { mapState } from 'vuex';

  export default {
    name: 'BakerEndorsingList',
    components: {
      PerPageSelect,
      Pagination,
    },
    mixins: [setPerPage, handleCurrentPageChange],
    props: ['account'],
    data() {
      return {
        currentPage: this.$constants.INITIAL_CURRENT_PAGE,
        fields: [
          { key: 'cycle', label: this.$tc('common.cycle', 1) },
          { key: 'slots', label: this.$t('endorsementsList.slots') },
          { key: 'missed', label: this.$t('bakerSingle.missed') },
          { key: 'rewards', label: this.$tc('common.reward', 2) },
          { key: 'status', label: this.$tc('statusTypes.status') },
        ],
        selectedRow: {
          type: null,
          cycleId: null,
          data: null,
          count: 0,
          fields: [],
          currentPage: 1,
        },
        count: 0,
        total: null,
        future: [],
        data: [],
        loading: false,
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
    },
    watch: {
      currentPage: {
        async handler(value) {
          await this.reload(value);
        },
      },
      async perPage() {
        await this.reload();
      },
      'selectedRow.currentPage': {
        deep: true,
        async handler(value) {
          await this.reloadAccountEndorsingItem(value);
        },
      },
      'selectedRow.perPage': {
        deep: true,
        async handler() {
          await this.reloadAccountEndorsingItem();
        },
      },
    },
    methods: {
      getRowClass(item) {
        if (item === null || !item.status) {
          return 'endorsing-list-row';
        }

        const classes = ['endorsing-list-row'];

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
        this.loading = true;

        const isRowFuture = row[0].class === 'future';
        const isRowTotal = row[0].cycle === 'Total';

        if (isRowTotal) return;

        let modalData;
        let modalFields;
        this.cycleId = row[0].cycle;

        if (isRowFuture) {
          this.selectedRow.type = 'future';
          modalData = await this.$api.getAccountEndorsingRightsFuture({
            account: this.account,
            cycleId: row[0].cycle,
          });

          modalFields = [
            { key: 'blockLevel', label: this.$t('common.blockId') },
            { key: 'slots', label: this.$t('endorsementsList.slots') },
            { key: 'rewards', label: this.$tc('common.reward', 2) },
            { key: 'deposit', label: this.$t('common.deposit') },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        } else {
          this.selectedRow.type = 'endorsing';
          modalData = await this.$api.getAccountEndorsingItem({
            account: this.account,
            cycleId: row[0].cycle,
          });

          modalFields = [
            { key: 'level', label: this.$t('common.blockId') },
            { key: 'slots', label: this.$t('endorsementsList.slots') },
            { key: 'rewards', label: this.$tc('common.reward', 2) },
            { key: 'deposit', label: this.$t('common.deposit') },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        }

        this.selectedRow.fields = modalFields;
        this.selectedRow.data = modalData.data;
        this.selectedRow.count = modalData.count;
        this.$bvModal.show('modal-endorsing');
        this.loading = false;
      },
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
          account: this.account,
        };

        if (page === 1) {
          const total = await this.$api.getAccountEndorsingTotal({
            account: this.account,
          });
          const future = await this.$api.getAccountEndorsingFuture({
            account: this.account,
          });
          const data = await this.$api.getAccountEndorsing(props);

          this.total = { ...total.data, status: 'Total' };
          this.future = future.data.map((item) => ({
            ...item,
            class: 'future',
          }));
          this.data = [
            ...this.future,
            { ...total.data, cycle: 'Total', class: 'total', status: 'Total' },
            ...data.data,
          ];

          this.count = data.count;
        } else {
          const data = await this.$api.getAccountEndorsing(props);
          this.data = data.data;
        }
      },
      async reloadAccountEndorsingItem(page = 1) {
        const props = {
          page,
          account: this.account,
          cycleId: this.cycleId,
        };

        const { type } = this.selectedRow;
        let data;

        if (type === 'endorsing') {
          data = await this.$api.getAccountEndorsingItem(props);
        } else {
          data = await this.$api.getAccountEndorsingRightsFuture(props);
        }

        this.selectedRow.data = data.data;
        this.selectedRow.count = data.count;
      },
      handleModalPagination(page) {
        this.selectedRow.currentPage = page;
      },
    },
    async created() {
      this.reload();
    },
  };
</script>

<style lang="scss">
  .endorsing-list-row {
    cursor: pointer;

    & a {
      color: $color-brand;
    }

    &:focus {
      outline: none;
    }

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

  .baker-endorsing-table a {
    color: $color-brand;
  }

  .endorsing-list .page-link {
    background-color: transparent;
    color: #309282;
    border: none;
  }
</style>
