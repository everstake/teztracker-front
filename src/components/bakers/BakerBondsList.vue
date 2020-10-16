<template>
  <div class="baking-list">
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect :default-per-page="perPage" @per-page="$_setPerPage" />
    </div>

    <b-table
      responsive
      show-empty
      :items="data"
      :fields="fields"
      :current-page="currentPage"
      borderless
      class="transactions-table"
      :tbody-tr-class="getRowClass"
      :empty-text="$t('common.noData')"
    >
      <template slot="staking_balance" slot-scope="row">
        {{ row.item.staking_balance | tezosToFixed }}
      </template>

      <template slot="actual_blocks_deposit" slot-scope="row">
        <span v-if="row.item.status === 'pending'">
          <span v-if="row.item.expected_blocks_deposit">
            {{ row.item.expected_blocks_deposit | tezosToFixed }}
          </span>
          <span v-else>-</span>
        </span>
        <span v-else-if="row.item.status === 'active'">
          <span v-if="row.item.actual_blocks_deposit">
            {{ row.item.actual_blocks_deposit | tezosToFixed }}
            ({{ row.item.expected_blocks_deposit | tezosToFixed }})
          </span>
          <span v-else
            >- ({{ row.item.expected_blocks_deposit | tezosToFixed }})</span
          >
        </span>
      </template>

      <template slot="actual_endorsement_deposit" slot-scope="row">
        <span v-if="row.item.status === 'pending'">
          <span v-if="row.item.expected_endorsement_deposit">
            {{ row.item.expected_endorsement_deposit | tezosToFixed }}
          </span>
          <span v-else>-</span>
        </span>
        <span v-else-if="row.item.status === 'active'">
          <span v-if="row.item.actual_endorsement_deposit">
            {{ row.item.actual_endorsement_deposit | tezosToFixed }}
            ({{ row.item.expected_endorsement_deposit | tezosToFixed }})
          </span>
          <span v-else
            >- ({{
              row.item.expected_endorsement_deposit | tezosToFixed
            }})</span
          >
        </span>
      </template>

      <template slot="actual_total_deposit" slot-scope="row">
        <span v-if="row.item.actual_total_deposit">
          {{ row.item.actual_total_deposit | tezosToFixed }}
        </span>
        <span v-else>-</span>
      </template>
      <template slot="expected_total_deposit" slot-scope="row">
        <span v-if="row.item.expected_total_deposit">
          {{ row.item.expected_total_deposit | tezosToFixed }}
        </span>
        <span v-else>-</span>
      </template>
      <template slot="available_bond" slot-scope="row">
        <span v-if="row.item.available_bond">
          {{ row.item.available_bond | tezosToFixed }}
        </span>
        <span v-else>-</span>
      </template>
    </b-table>
  </div>
</template>

<script>
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import setPerPage from '@/mixins/setPerPage';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import { mapState } from 'vuex';

  export default {
    name: 'BakerBondsList',
    components: {
      PerPageSelect,
    },
    filters: {
      toFixedNoRounding(amount) {
        return amount.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0];
      },
    },
    mixins: [setPerPage, handleCurrentPageChange],
    props: ['account'],
    data() {
      return {
        currentPage: this.$constants.INITIAL_CURRENT_PAGE,
        perPage: 20,
        fields: [
          { key: 'cycle', label: this.$tc('common.cycle', 1) },
          { key: 'staking_balance', label: this.$t('common.stakingBal') },
          { key: 'actual_blocks_deposit', label: 'Baking deposit' },
          { key: 'actual_endorsement_deposit', label: 'Endorsing deposit' },
          { key: 'expected_total_deposit', label: 'Expected total deposit' },
          { key: 'actual_total_deposit', label: 'Actual total deposit' },
          { key: 'available_bond', label: 'Available bond' },
          { key: 'status', label: this.$t('statusTypes.status') },
        ],
        selectedRow: {
          data: null,
          count: 0,
          fields: [],
          currentPage: 1,
        },
        count: 0,
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
          let result;

          if (typeof value === 'object') {
            const { page } = value;
            result = page;
          } else {
            result = value;
          }

          await this.reload(result);
        },
      },
      async perPage(value) {
        await this.reload({ page: value });
      },
      'selectedRow.currentPage': {
        deep: true,
        async handler(value) {
          await this.getAccountBonds(value);
        },
      },
      'selectedRow.perPage': {
        deep: true,
        async handler() {
          await this.reloadAccountRewardsDelegators();
        },
      },
    },
    async created() {
      this.reload();
    },
    methods: {
      getRowClass(item) {
        if (item === null || !item.status) {
          return 'rewards-list-row';
        }

        let classes = ['rewards-list-row', 'bonds-list-row'];

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
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
          account: this.account,
        };

        this.$_setPerPage(this.perPage);

        const data = await this.$api.getAccountBonds(props);
        this.data = data.data;
        this.count = data.count;
      },
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

  .bonds-list-row {
    cursor: text;
  }
</style>
