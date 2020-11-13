<template>
  <div class="endorsing-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="perPage"
        :loading="loading"
        @onLimitChange="
          (limit) => $emit('onLimitChange', { type: 'endorsing', limit })
        "
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
      <template slot="cycle" slot-scope="row">
        <div v-if="isRowTotal(row)">
          Total
        </div>
        <div v-else>
          {{ row.item.cycle | formatInteger }}

          <font-awesome-icon
            icon="question-circle"
            class="icon icon-circle"
            @click.stop="toggleCycleToast(row)"
            @focusout="hideCycleToast()"
          />
          <div class="cycle-toast">
            <b-toast
              :id="`endorsing-${row.index}-${row.item.cycle}`"
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
        </div>
      </template>
      <template slot="rewards" slot-scope="row">
        {{ row.item.rewards | denominate }}
      </template>
    </b-table>

    <PaginationSelect
      :total-rows="count"
      :per-page="perPage"
      :current-page="currentPage"
      :loading="loading"
      @onPageChange="
        (page) => $emit('onPageChange', { type: 'endorsing', page })
      "
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
            {{ row.item.reward | denominate }}
          </template>
          <template slot="avgPriority" slot-scope="row">
            {{ row.item.avgPriority }}
          </template>
          <template slot="rewards" slot-scope="row">
            {{ row.item.reward | denominate }}
          </template>
          <template slot="deposit" slot-scope="row">
            {{ row.item.deposit | denominate }}
          </template>
          <template slot="timestamp" slot-scope="row">
            {{ row.item.timestamp | timeformat(dateFormat) }}
          </template>
        </b-table>

        <Pagination
          v-model="selectedRow.currentPage"
          :total-rows="selectedRow.count"
          :per-page="selectedRow.perPage"
          :loading="selectedRow.loading"
          @change="handleModalPagination"
        />
      </b-modal>
    </div>
  </div>
</template>

<script>
  import LimitSelect from '@/components/partials/LimitSelect';
  import Pagination from '../partials/Pagination';
  import PaginationSelect from '../partials/PaginationSelect';
  import { mapState } from 'vuex';

  export default {
    name: 'BakerEndorsingList',
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
          cycleId: null,
          data: null,
          count: 0,
          fields: [],
          currentPage: 1,
          loading: false,
        },
        toast: undefined,
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
          { key: 'slots', label: this.$t('endorsementsList.slots') },
          { key: 'missed', label: this.$t('bakerSingle.missed') },
          { key: 'rewards', label: this.$tc('common.reward', 2) },
          { key: 'status', label: this.$tc('statusTypes.status') },
        ];
      },
    },
    watch: {
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
    updated() {
      this.hideCycleToast();
    },
    async created() {
      const itemsNotFetched = !this.loaded;
      if (itemsNotFetched) {
        this.$emit('onReload', { type: 'endorsing', limit: this.perPage });
      }
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
      },
      async reloadAccountEndorsingItem(page = 1) {
        this.selectedRow.loading = true;
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
        this.selectedRow.loading = false;
      },
      handleModalPagination(page) {
        this.selectedRow.currentPage = page;
      },
      isRowTotal(row) {
        return row.item.cycle === 'Total';
      },
      toggleCycleToast(row) {
        this.hideCycleToast();
        this.showCycleToast(row);
      },
      showCycleToast(row) {
        const index = row.index;
        const cycle = row.item.cycle;
        const id = `endorsing-${index}-${cycle}`;
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
