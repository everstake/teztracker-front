<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" :hide="!showPerPageFilter" />
    </div>

    <b-table
      responsive
      show-empty
      :items="transactions"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
      :tbody-tr-class="$_defineRowClass"
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

    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_TX_COUNT } from '@/store/mutations.types';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'TxsList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
      IdentIcon,
    },
    mixins: [handleCurrentPageChange, setPerPage, defineRowClass],
    props: {
      block: {
        type: Object,
      },
      account: {
        type: String,
      },
      isTableComplete: {
        type: Boolean,
        default: true,
      },
      showPerPageFilter: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        transactions: [],
        count: 0,
        fields: [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.txHash') },
          {
            key: 'from',
            label: this.$t('common.from'),
            class: !this.isTableComplete ? 'd-none' : '',
          },
          {
            key: 'to',
            label: this.$t('common.to'),
            class: !this.isTableComplete ? 'd-none' : '',
          },
          {
            key: 'amount',
            label: this.$t('common.amount'),
            class: !this.isTableComplete ? 'd-none' : '',
          },
          {
            key: 'fee',
            label: this.$t('common.fee'),
            class: !this.isTableComplete ? 'd-none' : '',
          },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ],
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
      block: {
        async handler() {
          await this.reload();
        },
      },
      account: {
        async handler() {
          await this.reload();
        },
      },
      async perPage() {
        await this.reload();
      },
    },
    async created() {
      // TODO: refactor API
      if (!this.block) {
        await this.reload();
      }
    },
    methods: {
      ...mapMutations('operations', [SET_TX_COUNT]),
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
        };
        if (this.block) {
          props.block_id = this.block.hash;
        }
        if (this.account) {
          props.account_id = this.account;
        }
        const data = await this.$api.getTransactions(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.transactions = data.data;
        this.$emit('onTransactions', this.account);
        this.count = data.count;
        this[SET_TX_COUNT](this.count);
      },
      getAccountName(row, rowHash) {
        return `${row.item[`${rowHash}Name`] ||
          row.item[rowHash].slice(0, 15)}...`;
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
