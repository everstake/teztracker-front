<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      responsive
      show-empty
      :items="originations"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
      :tbody-tr-class="$_defineRowClass"
    >
      <template slot="txhash" slot-scope="row">
        <b-link
          :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }"
        >
          {{ row.item.operationGroupHash | longhash }}
        </b-link>
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
        <b-link :to="{ name: 'account', params: { account: row.item.source } }">
          <template v-if="row.item.sourceName">
            {{ row.item.sourceName }}
          </template>
          <template v-else>
            {{ row.item.source | longhash }}
          </template>
        </b-link>
      </template>

      <template v-if="row.item.delegate" slot="to" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.delegate } }"
        >
          <template v-if="row.item.delegateName">
            {{ row.item.delegateName }}
          </template>
          <template v-else>
            {{ row.item.delegate | longhash }}
          </template>
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        {{ row.item.balance | tezos }}
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
  import { SET_ORIGINATIONS_COUNT } from '@/store/mutations.types';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'OriginationsList',
    components: {
      PerPageSelect,
      Pagination,
    },
    mixins: [handleCurrentPageChange, setPerPage, defineRowClass],
    props: ['account'],
    data() {
      return {
        originations: [],
        count: 0,
        fields: [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.originationHash') },
          { key: 'from', label: this.$t('common.from') },
          { key: 'to', label: this.$t('common.to') },
          { key: 'amount', label: this.$t('common.amount') },
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
      async perPage() {
        await this.reload();
      },
    },
    async created() {
      await this.reload();
    },
    methods: {
      ...mapMutations('operations', [SET_ORIGINATIONS_COUNT]),
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
        const data = await this.$api.getOriginations(props);
        this.originations = data.data;
        this.count = data.count;
        this[SET_ORIGINATIONS_COUNT](this.count);
      },
    },
  };
</script>
