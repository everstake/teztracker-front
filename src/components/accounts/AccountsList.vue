<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="accounts"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="accountId" slot-scope="row">
        <span v-if="row.item.is_baker" class="d-flex align-items-center">
          <b-link
            v-if="row.item.is_baker"
            :to="{ name: 'baker', params: { baker: row.item.accountId } }"
          >
            {{ row.item.accountId | longhash }}
          </b-link>

          <BtnCopy :text-to-copy="row.item.accountId" />
        </span>
        <span v-else class="d-flex align-items-center">
          <IdentIcon :seed="row.item.accountId" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.accountId } }"
          >
            {{ row.item.accountId | longhash }}
          </b-link>

          <BtnCopy :text-to-copy="row.item.accountId" />
        </span>
      </template>
      <template slot="balance" slot-scope="row">
        <span>{{ row.item.balance | tezos }}</span>
      </template>
      <template slot="createdAt" slot-scope="row">
        <span>{{ row.item.createdAt | timeformat(dateFormat) }}</span>
      </template>
      <template slot="delegateValue" slot-scope="row">
        <span v-if="row.item.delegateValue" class="d-flex align-items-center">
          <IdentIcon :seed="row.item.delegateValue" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.accountId } }"
          >
            <span>{{ row.item.delegateValue | longhash }}</span>
          </b-link>

          <BtnCopy :text-to-copy="row.item.delegateValue" />
        </span>
        <span v-else>----</span>
      </template>
    </b-table>

    <div class="pagination-block">
      <Pagination
        @change="$_handleCurrentPageChange"
        :total-rows="count.accounts"
        :per-page="perPage"
      />
    </div>
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
  import { SET_ACCOUNTS } from '@/store/mutations.types';

  export default {
    name: 'AccountsList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
      IdentIcon,
    },
    mixins: [setPerPage, fetchListMixin, handleCurrentPageChange],
    data() {
      return {
        fields: [
          { key: 'accountId', label: this.$tc('common.acc', 1) },
          {
            key: 'balance',
            label: this.$t('common.balance'),
            sortable: true,
            sortDirection: 'desc',
          },
          { key: 'delegateValue', label: this.$t('common.delegate') },
          { key: 'createdAt', label: this.$t('accSingle.created') },
        ],
      };
    },
    computed: {
      ...mapState('accounts', {
        accounts: (state) => state.accounts,
        count: (state) => state.counts,
      }),
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
    },
    methods: {
      ...mapMutations('accounts', [SET_ACCOUNTS]),
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
        };
        const data = await this.$api.getAccounts(props);
        this[SET_ACCOUNTS](data);
      },
    },
  };
</script>
