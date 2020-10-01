<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" :default-per-page="perPage" />
    </div>

    <b-table
      responsive
      show-empty
      :items="topAccounts"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="accountId" slot-scope="row">
        <b-link
          v-if="row.item.is_baker"
          :to="{ name: 'baker', params: { baker: row.item.accountId } }"
        >
          <span>{{ row.item.accountName || row.item.accountId }}</span>
        </b-link>
        <b-link
          v-else-if="row.item.accountId.slice(0, 2) === 'KT'"
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.accountName || row.item.accountId }}</span>
        </b-link>
        <b-link
          v-else
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.accountName || row.item.accountId }}</span>
        </b-link>
      </template>
      <template slot="balance" slot-scope="row">
        <span>{{ row.item.balance | tezosToFixed }}</span>
      </template>
      <template slot="is_baker" slot-scope="row">
        <span>{{
          row.item.is_baker
            ? 'baker'
            : row.item.accountId.slice(0, 2) === 'KT'
            ? 'contract'
            : 'account'
        }}</span>
      </template>
      <template slot="createdAt" slot-scope="row">
        <span>{{ row.item.createdAt | timeformat(dateFormat) }}</span>
      </template>
      <template slot="delegateValue" slot-scope="row">
        <b-link
          v-if="row.item.delegateValue"
          :to="{ name: 'baker', params: { baker: row.item.accountId } }"
        >
          <span>{{
            row.item.delegateName || row.item.delegateValue | longhash(15)
          }}</span>
        </b-link>
        <span v-else>----</span>
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
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';
  import { mapState } from 'vuex';

  export default {
    name: 'TopAccountsList',
    components: {
      PerPageSelect,
      Pagination,
    },
    mixins: [handleCurrentPageChange, setPerPage],
    data() {
      return {
        topAccounts: [],
        count: 0,
        perPage: 200,
        fields: [
          { key: 'accountId', label: this.$tc('common.acc', 1) },
          {
            key: 'balance',
            label: this.$t('common.balance'),
            sortable: true,
            sortDirection: 'desc',
          },
          { key: 'is_baker', label: this.$t('common.type') },
          { key: 'delegateValue', label: this.$t('common.delegate') },
          { key: 'createdAt', label: this.$t('accSingle.created') },
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
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
        };

        const data = await this.$api.getTopAccounts(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.topAccounts = data.data;
        this.count = data.count;
        this.$emit('onDataReceived', data.count);
      },
    },
  };
</script>
