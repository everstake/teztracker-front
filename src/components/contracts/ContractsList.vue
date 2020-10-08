<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="contracts"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="accountId" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.accountId" />

          <router-link
            :to="{ name: 'account', params: { account: row.item.accountId } }"
          >
            <span>{{ row.item.accountId | longhash }}</span>
          </router-link>

          <BtnCopy :text-to-copy="row.item.accountId" />
        </span>
      </template>
      <template slot="manager" slot-scope="row">
        <b-link
          v-if="row.item.manager"
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.manager | longhash }}</span>
        </b-link>
        <span v-else>----</span>
      </template>
      <template slot="delegateValue" slot-scope="row">
        <span v-if="row.item.delegateValue" class="d-flex align-items-center">
          <IdentIcon :seed="row.item.delegateValue" />

          <b-link
            :to="{
              name: 'account',
              params: { account: row.item.delegateValue },
            }"
          >
            <template v-if="row.item.delegateName">
              {{ row.item.delegateName }}
            </template>
            <template v-else>
              {{ row.item.delegateValue | longhash }}
            </template>
          </b-link>

          <BtnCopy
            v-if="!row.item.delegateName"
            :text-to-copy="row.item.delegateValue"
          />
        </span>
        <span v-else>----</span>
      </template>
      <template slot="balance" slot-scope="row">
        <span>{{ row.item.balance | tezos }}</span>
      </template>
      <template slot="createdAt" slot-scope="row">
        <span>{{ row.item.createdAt | timeformat(dateFormat) }}</span>
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="count.contracts"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import setPerPage from '@/mixins/setPerPage';
  import fetchListMixin from '@/mixins/fetchListMixin';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import { SET_CONTRACTS } from '@/store/mutations.types';

  export default {
    name: 'ContractsList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
      IdentIcon,
    },
    mixins: [setPerPage, fetchListMixin, handleCurrentPageChange],
    props: ['account'],
    data() {
      return {
        fields: [
          { key: 'accountId', label: this.$tc('common.contract', 1) },
          { key: 'manager', label: this.$t('common.manager') },
          { key: 'delegateValue', label: this.$t('common.delegate') },
          {
            key: 'balance',
            label: this.$t('common.balance'),
            sortable: true,
            sortDirection: 'desc',
          },
          { key: 'createdAt', label: this.$t('accSingle.created') },
        ],
      };
    },
    computed: {
      ...mapState('accounts', {
        contracts: (state) => state.contracts,
        count: (state) => state.counts,
      }),
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
    },
    methods: {
      ...mapMutations('accounts', [SET_CONTRACTS]),
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
        };
        const data = await this.$api.getContracts(props);
        this[SET_CONTRACTS](data);
      },
    },
  };
</script>
