<template>
  <b-table
    show-empty
    :items="items"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table table-responsive-md"
  >
    <template #cell(account_id)="row">
      <router-link :to="{ name: 'asset', params: { id: row.item.account_id } }">
        <span v-if="row.item.name">
          {{ row.item.name }}
        </span>
        <span v-else>{{ row.item.account_id | longhash }}</span>
      </router-link>
    </template>
    <template #cell(manager)="row">
      <span v-if="row.item.manager" class="d-flex align-items-center">
        <IdentIcon :seed="row.item.manager" />

        <b-link
          :to="{ name: 'account', params: { account: row.item.manager } }"
        >
          <span>{{ row.item.manager | longhash }}</span>
        </b-link>

        <BtnCopy :text-to-copy="row.item.manager" />
      </span>
      <NoDataTableCell v-else />
    </template>
    <template #cell(name)="row">
      <span v-if="row.item.name">{{ row.item.name }}</span>
      <NoDataTableCell v-else />
    </template>
    <template #cell(balance)="row">
      <span>{{
        row.item.balance
          | tezos(getAssetCurrency(row.item.name), row.item.precision)
      }}</span>
    </template>
    <template #cell(ticker)="row">
      <span v-if="row.item.ticker">{{ row.item.ticker }}</span>
      <NoDataTableCell v-else />
    </template>
    <template #cell(total_supply)="row">
      <span>{{ row.item.total_supply | tezos }}</span>
    </template>
    <template #cell(created_at)="row">
      <span>{{ row.item.created_at | timeformat(dateFormat) }}</span>
    </template>
  </b-table>
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import NoDataTableCell from '@/components/partials/NoDataTableCell';

  export default {
    name: 'AssetsTable',
    props: {
      items: Array,
      page: Number,
      limit: Number,
      propsFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    components: {
      BtnCopy,
      IdentIcon,
      NoDataTableCell,
    },
    computed: {
      ...mapState({
        dateFormat: (state) => state.app.dateFormat,
      }),
      fields() {
        const propsFields = this.propsFields.length > 0;
        if (!this.$i18n.locale) return [];
        if (propsFields) {
          return this.propsFields;
        } else {
          return [
            { key: 'id', label: this.$t('common.ordinalNumber') },
            { key: 'account_id', label: this.$t('common.contractName') },
            { key: 'manager', label: this.$t('common.manager') },
            {
              key: 'balance',
              label: this.$t('common.balance'),
              sortable: true,
              sortDirection: 'desc',
              thClass: 'assets-table__heading',
            },
            { key: 'ticker', label: 'Ticker' },
            {
              key: 'total_supply',
              label: 'Total supply',
            },
            { key: 'created_at', label: this.$t('accSingle.created') },
          ];
        }
      },
    },
    methods: {
      getAssetCurrency(asset) {
        if (!asset) return 'XTZ';

        const assets = [
          { name: 'tzBTC', currency: 'tzBTC' },
          { name: 'Staker DAO', currency: 'STKR' },
          { name: 'USDtz', currency: 'USDtz' },
        ];

        const findedAsset = assets.find(({ name, currency }) => {
          if (asset === name) return currency;
        });

        return findedAsset.currency;
      },
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep .assets-table__heading > div {
    position: relative;
  }
</style>
