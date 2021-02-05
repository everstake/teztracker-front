<template>
  <div class="list baking-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="limit"
        :loading="loading"
        @onLimitChange="handleLimitChange"
      />
    </div>

    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="2"
        :columns="6"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      responsive
      show-empty
      :items="items"
      :fields="fields"
      :current-page="page"
      borderless
      class="transactions-table"
      :tbody-tr-class="getRowClass"
      :empty-text="$t('common.noData')"
    >
      <template #cell(staking_balance)="row">
        {{ row.item.staking_balance | denominate }}
      </template>
      <template #cell(actual_blocks_deposit)="row">
        <span v-if="row.item.status === 'pending'">
          <span v-if="row.item.expected_blocks_deposit">
            {{ row.item.expected_blocks_deposit | denominate }}
          </span>
          <span v-else>-</span>
        </span>
        <span v-else-if="row.item.status === 'active'">
          <span v-if="row.item.actual_blocks_deposit">
            {{ row.item.actual_blocks_deposit | denominate }}
            ({{ row.item.expected_blocks_deposit | denominate }})
          </span>
          <span v-else>
            - ({{ row.item.expected_blocks_deposit | denominate }})
          </span>
        </span>
      </template>
      <template #cell(actual_endorsement_deposit)="row">
        <span v-if="row.item.status === 'pending'">
          <span v-if="row.item.expected_endorsement_deposit">
            {{ row.item.expected_endorsement_deposit | denominate }}
          </span>
          <span v-else>-</span>
        </span>
        <span v-else-if="row.item.status === 'active'">
          <span v-if="row.item.actual_endorsement_deposit">
            {{ row.item.actual_endorsement_deposit | denominate }}
            ({{ row.item.expected_endorsement_deposit | denominate }})
          </span>
          <span v-else>
            - ({{ row.item.expected_endorsement_deposit | denominate }})
          </span>
        </span>
      </template>
      <template #cell(actual_total_deposit)="row">
        <span v-if="row.item.actual_total_deposit">
          {{ row.item.actual_total_deposit | denominate }}
        </span>
        <span v-else>-</span>
      </template>
      <template #cell(expected_total_deposit)="row">
        <span v-if="row.item.expected_total_deposit">
          {{ row.item.expected_total_deposit | denominate }}
        </span>
        <span v-else>-</span>
      </template>
      <template #cell(available_bond)="row">
        <span v-if="row.item.available_bond">
          {{ row.item.available_bond | denominate }}
        </span>
        <span v-else>-</span>
      </template>
    </b-table>
  </div>
</template>

<script>
  import LimitSelect from '@/components/partials/LimitSelect';
  import { mapState } from 'vuex';
  import tabulationList from "@/mixins/tabulationList";

  export default {
    name: 'BondsTabList',
    components: {
      LimitSelect,
    },
    mixins: [tabulationList],
    filters: {
      toFixedNoRounding(amount) {
        return amount.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0];
      },
    },
    props: {
      hash: String,
    },
    data() {
      return {
        selectedRow: {
          data: null,
          count: 0,
          fields: [],
          currentPage: 1,
        },
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
      async reload(limit, page) {
        this.loading = true;
        const props = {
          page,
          limit,
          account: this.hash,
        };

        const data = await this.$api.getAccountBonds(props);
        this.bonds = data.data;
        this.count = data.count;
        this.loading = false;
        this.loaded = true;
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
