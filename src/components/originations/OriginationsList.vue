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
      class="transactions-table"
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
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.source" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.source } }"
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
        </span>
      </template>

      <template slot="to" slot-scope="row">
        <span
          v-if="row.item.delegateName || row.item.delegate"
          class="d-flex align-items-center"
        >
          <IdentIcon :seed="row.item.delegate" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.delegate } }"
          >
            <template v-if="row.item.delegateName">
              {{ row.item.delegateName }}
            </template>
            <template v-else-if="row.item.delegate">
              {{ row.item.delegate | longhash }}
            </template>
          </b-link>

          <BtnCopy
            v-if="!row.item.delegateName"
            :text-to-copy="row.item.delegate"
          />
        </span>

        <NoDataTableCell v-else />
      </template>
      <template slot="amount" slot-scope="row">
        {{ row.item.balance | tezos }}
      </template>
    </b-table>

    <Pagination
      :total-rows="count"
      :per-page="perPage"
      @change="$_handleCurrentPageChange"
    />
  </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_ORIGINATIONS_COUNT } from '@/store/mutations.types';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import NoDataTableCell from '@/components/partials/NoDataTableCell';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'OriginationsList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
      IdentIcon,
      NoDataTableCell,
    },
    mixins: [handleCurrentPageChange, setPerPage, defineRowClass],
    props: ['account'],
    data() {
      return {
        originations: [],
        count: 0,
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.originationHash') },
          { key: 'from', label: this.$t('common.from') },
          { key: 'to', label: this.$t('common.to') },
          { key: 'amount', label: this.$t('common.amount') },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ];
      },
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
