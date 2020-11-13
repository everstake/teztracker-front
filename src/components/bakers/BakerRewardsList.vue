<template>
  <div class="baking-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="perPage"
        :loading="loading"
        @onLimitChange="
          (limit) => $emit('onLimitChange', { type: 'rewards', limit })
        "
      />
    </div>

    <b-table
      responsive
      show-empty
      :items="data"
      :fields="fields"
      :current-page="currentPage"
      borderless
      selectable
      :select-mode="'single'"
      :tbody-tr-class="getRowClass"
      class="transactions-table"
      :empty-text="$t('common.noData')"
      @row-selected="handleRowClick"
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
            :id="`rewards-${row.index}-${row.item.cycle}`"
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
      <template #cell(stakingBalance)="row">
        {{ row.item.stakingBalance | denominate }}
      </template>
      <template #cell(baking)="row">
        {{ row.item.baking | denominate }}
      </template>
      <template #cell(endorsements)="row">
        {{ row.item.endorsements | denominate }}
      </template>
      <template #cell(losses)="row">
        {{ row.item.losses | denominate }}
      </template>
      <template #cell(fees)="row">
        {{ row.item.fees | denominate }}
      </template>
    </b-table>

    <PaginationSelect
      :total-rows="count"
      :current-page="currentPage"
      :loading="loading"
      :per-page="perPage"
      @onPageChange="(page) => $emit('onPageChange', { type: 'rewards', page })"
    />

    <div>
      <b-modal id="modal-rewards" size="lg" centered hide-header hide-footer>
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
          <template #cell(cycle)="row">
            {{ row.item.cycle }}
          </template>

          <template #cell(delegator)="row">
            <router-link
              :to="{ name: 'account', params: { account: row.item.delegator } }"
            >
              {{ row.item.delegator }}
            </router-link>
          </template>
          <template #cell(balance)="row">
            {{ row.item.balance | denominate }}
          </template>
          <template s#cell(share)="row">
            {{ (row.item.share * 100) | toFixedNoRounding }}%
          </template>
        </b-table>

        <Pagination
          v-model="selectedRow.currentPage"
          :total-rows="selectedRow.count"
          :per-page="selectedRow.perPage"
          :loading="selectedRow.loading"
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
    name: 'BakerRewardsList',
    components: {
      LimitSelect,
      Pagination,
      PaginationSelect,
    },
    filters: {
      toFixedNoRounding(amount) {
        return amount.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0];
      },
    },

    props: {
      data: {
        type: Array,
        default() {
          return [];
        },
      },
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
          { key: 'stakingBalance', label: this.$t('common.delegatedBal') },
          { key: 'baking', label: this.$t('common.baking') },
          { key: 'delegators', label: this.$tc('common.delegator', 2) },
          { key: 'endorsements', label: this.$tc('opTypes.endorsement', 2) },
          { key: 'losses', label: this.$t('common.losses') },
          { key: 'fees', label: this.$t('common.fee') },
          { key: 'status', label: this.$t('statusTypes.status') },
        ];
      },
    },
    watch: {
      'selectedRow.currentPage': {
        deep: true,
        async handler(value) {
          await this.reloadAccountRewardsDelegators(value);
        },
      },
      'selectedRow.perPage': {
        deep: true,
        async handler() {
          await this.reloadAccountRewardsDelegators();
        },
      },
    },
    methods: {
      getRowClass(item) {
        if (item === null || !item.status) {
          return 'rewards-list-row';
        }

        let classes = ['rewards-list-row'];

        if (typeof item === 'object') {
          const { status } = item;

          if (status === 'active') {
            classes.push('active');
          }

          if (status === 'pending') {
            classes.push('pending');
          }

          if (status === 'frozen') {
            classes.push('frozen');
          }
        }

        return classes.join(' ');
      },
      async handleRowClick(row) {
        if (this.loading || row.length === 0) return;

        let modalData;
        let modalFields;
        this.cycleId = row[0].cycle;

        modalData = await this.$api.getAccountRewardsDelegators({
          account: this.account,
          cycleId: row[0].cycle,
        });

        modalFields = [
          { key: 'cycle', label: this.$tc('common.cycle', 1) },
          { key: 'delegator', label: this.$tc('common.delegator', 1) },
          { key: 'balance', label: this.$t('common.balance') },
          { key: 'share', label: this.$t('common.share') },
        ];

        this.selectedRow.fields = modalFields;
        this.selectedRow.data = modalData.data;
        this.selectedRow.count = modalData.count;
        this.$bvModal.show('modal-rewards');
      },
      async reloadAccountRewardsDelegators(page = 1) {
        this.selectedRow.loading = true;
        const props = {
          page,
          account: this.account,
          cycleId: this.cycleId,
        };

        const data = await this.$api.getAccountRewardsDelegators(props);

        this.selectedRow.data = data.data;
        this.selectedRow.count = data.count;
        this.selectedRow.loading = false;
      },
      handleModalPagination(page) {
        this.selectedRow.currentPage = page;
      },
      toggleCycleToast(row) {
        this.hideCycleToast();
        this.showCycleToast(row);
      },
      showCycleToast(row) {
        const index = row.index;
        const cycle = row.item.cycle;
        const id = `rewards-${index}-${cycle}`;
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
    async created() {
      const itemsNotFetched = !this.loaded;
      if (itemsNotFetched) {
        this.$emit('onReload', { type: 'rewards', limit: this.perPage });
      }
    },
  };
</script>

<style lang="scss">
  .is-total {
    background-color: green;
  }
  .baking-list-row {
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  .baker-baking-table a {
    color: $color-brand;
  }

  .page-item.active .page-link,
  .page-item.disabled .page-link,
  .page-link {
    background-color: transparent;
    color: #309282;
    border: none;
    outline: none;
  }

  .page-item:focus,
  .page-link:focus {
    box-shadow: none;
    outline: none;
  }

  .rewards-list-row {
    cursor: pointer;

    &:focus,
    &:active,
    &:hover {
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

    &.active {
      font-weight: 600;
      background-color: rgba(48, 146, 130, 0.7);
    }

    &.frozen {
      background-color: rgba(158, 160, 165, 0.4);
    }

    &.pending {
      background-color: rgba(48, 146, 130, 0.4);
    }
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
