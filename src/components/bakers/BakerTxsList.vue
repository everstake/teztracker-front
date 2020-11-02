<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect :limit="perPage" @onLimitChange="$_setPerPage" />
    </div>

    <b-table
      responsive
      show-empty
      :items="txs"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
    >
      <template slot="txhash" slot-scope="row">
        <span class="d-flex align-items-center">
          <b-link
            :to="{
              name: 'tx',
              params: { txhash: row.item.operationGroupHash },
            }"
          >
            {{ row.item.operationGroupHash | longhash }}
          </b-link>

          <BtnCopy :text-to-copy="row.item.operationGroupHash" />
        </span>
      </template>
      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>
      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>
      <template slot="from" slot-scope="row">
        <span class="position-relative w-100 d-flex align-items-center">
          <IdentIcon :seed="row.item.source" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.source } }"
            :class="row.item.sourceName === account ? 'source' : 'destination'"
          >
            <template v-if="row.item.sourceName">
              {{ row.item.sourceName }}
            </template>
            <template v-else>
              {{ row.item.source | longhash }}
            </template>
          </b-link>

          <BtnCopy
            v-if="!row.item.sourceName"
            :text-to-copy="row.item.source"
          />

          <span v-if="account === row.item.source" class="icon">
            <i class="icon__arrow--green"></i>
          </span>
          <span v-else-if="account === row.item.destination" class="icon">
            <i class="icon__arrow--red"></i>
          </span>
        </span>
      </template>
      <template slot="to" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.destination" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.destination } }"
          >
            <template v-if="row.item.destinationName">
              {{ row.item.destinationName }}
            </template>
            <template v-else>
              {{ row.item.destination | longhash }}
            </template>
          </b-link>

          <BtnCopy
            v-if="!row.item.destinationName"
            :text-to-copy="row.item.destination"
          />
        </span>
      </template>
      <template slot="amount" slot-scope="row">
        {{ row.item.amount | tezos }}
      </template>
      <template slot="fee" slot-scope="row">
        {{ row.item.fee | tezos }}
      </template>
    </b-table>

    <PaginationSelect
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
      :current-page="currentPage"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';

  export default {
    name: 'BakerTxsList',
    components: {
      LimitSelect,
      PaginationSelect,
      BtnCopy,
      IdentIcon,
    },
    props: {
      txs: {
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
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.txHash') },
          {
            key: 'from',
            label: this.$t('common.from'),
          },
          {
            key: 'to',
            label: this.$t('common.to'),
          },
          {
            key: 'amount',
            label: this.$t('common.amount'),
          },
          {
            key: 'fee',
            label: this.$t('common.fee'),
          },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ];
      },
    },
    async created() {
      const itemsNotFetched = !this.loaded;
      if (itemsNotFetched) {
        this.$emit('onReload', { type: 'txs', limit: this.perPage });
      }
    },
    methods: {
      getAccountName(row, rowHash) {
        return `${row.item[`${rowHash}Name`] ||
        row.item[rowHash].slice(0, 15)}...`;
      },
      $_setPerPage(value) {
        this.$emit('onLimitChange', { type: 'txs', limit: value });
      },
      $_handleCurrentPageChange(page) {
        this.$emit('onPageChange', { type: 'txs', limit: this.perPage, page });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .s {
    position: relative;
  }
  
  .source,
  .destination {
    position: relative;
  }
  
  .icon {
    &__arrow--red:before {
      position: absolute;
      content: '';
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #309282;
      border-top: 0.3em solid transparent;
      border-bottom: 0.3em solid transparent;
      border-left: 0.3em solid;
    }
    
    &__arrow--green:before {
      position: absolute;
      content: '';
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #e56968;
      border-top: 0.3em solid transparent;
      border-bottom: 0.3em solid transparent;
      border-left: 0.3em solid;
    }
  }
</style>
