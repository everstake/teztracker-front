<template>
  <div class="baking-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect :per-page="perPage" @per-page="$_setPerPage" />
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
  import LimitSelect from '@/components/partials/LimitSelect';
  import { mapState } from 'vuex';

  export default {
    name: 'BakerBondsList',
    components: {
      LimitSelect,
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
    },
    data() {
      return {
        selectedRow: {
          data: null,
          count: 0,
          fields: [],
          currentPage: 1,
        },
        loading: false,
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'cycle', label: this.$tc('common.cycle', 1) },
          { key: 'staking_balance', label: this.$t('common.stakingBal') },
          {
            key: 'actual_blocks_deposit',
            label: this.$t('bakerSingle.bakingDeposit'),
          },
          {
            key: 'actual_endorsement_deposit',
            label: this.$t('bakerSingle.endorsingDeposit'),
          },
          {
            key: 'expected_total_deposit',
            label: this.$t('bakerSingle.expectedTotalDeposit'),
          },
          {
            key: 'actual_total_deposit',
            label: this.$t('bakerSingle.actualTotalDeposit'),
          },
          {
            key: 'available_bond',
            label: this.$t('bakerSingle.availableBond'),
          },
          { key: 'status', label: this.$t('statusTypes.status') },
        ];
      },
    },
    watch: {
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
      $_setPerPage(value) {
        this.$emit('onLimitChange', { type: 'bonds', limit: value });
      },
      $_handleCurrentPageChange(page) {
        this.$emit('onPageChange', { type: 'bonds', limit: this.perPage, page });
      },
    },
    async created() {
      const itemsEmpty = this.data.length === 0;
      if (itemsEmpty) {
        this.$emit('onReload', { type: 'bonds', limit: this.perPage });
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

  .bonds-list-row {
    cursor: text;
  }
</style>
