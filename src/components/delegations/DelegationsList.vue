<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      responsive
      show-empty
      :items="delegations"
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

      <template slot="delegationAmount" slot-scope="row">
        {{ row.item.delegationAmount | tezos }}
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

      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>

      <template slot="fee" slot-scope="row">
        {{ row.item.fee | tezos }}
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      v-model="currentPage"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_DELEGATIONS_COUNT } from '@/store/mutations.types';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import NoDataTableCell from '@/components/partials/NoDataTableCell';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'DelegationsList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
      IdentIcon,
      NoDataTableCell,
    },
    props: ['account'],
    mixins: [handleCurrentPageChange, setPerPage, defineRowClass],
    data() {
      return {
        delegations: [],
        count: 0,
        fields: [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.delegationHash') },
          { key: 'delegationAmount', label: this.$t('common.amountDelegated') },
          { key: 'from', label: this.$t('common.from') },
          { key: 'to', label: this.$t('common.to') },
          { key: 'fee', label: this.$t('common.fee') },
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
      ...mapMutations('operations', [SET_DELEGATIONS_COUNT]),
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
        const data = await this.$api.getDelegations(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.delegations = data.data;
        this.count = data.count;
        this[SET_DELEGATIONS_COUNT](this.count);
      },
    },
  };
</script>
