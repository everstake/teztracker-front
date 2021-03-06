<template>
  <div class="list operations-list">
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>
  
    <div v-if="loading && operations.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="10"
        :columns="10"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      responsive
      show-empty
      :items="operations"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
    >
      <template #cell(blockLevel)="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>
      <template #cell(blockHash)="row">
        <span class="d-flex align-items-center">
          <b-link :to="{ name: 'tx', params: { txhash: row.item.blockHash } }">
            {{ row.item.blockHash | longhash }}
          </b-link>

          <BtnCopy :text-to-copy="row.item.blockHash" />
        </span>
      </template>
      <template #cell(timestamp)="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
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
  import BtnCopy from '@/components/partials/BtnCopy';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';
  import { mapState } from 'vuex';

  export default {
    name: 'OperationsList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
    },
    mixins: [handleCurrentPageChange, setPerPage],
    props: ['account'],
    data() {
      return {
        operations: [],
        count: 0,
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        return [
          { key: 'blockLevel', label: this.$t('common.blockId') },
          { key: 'blockHash', label: this.$t('hashTypes.hash') },
          { key: 'kind', label: this.$t('common.opType') },
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
      async reload(page = 1) {
        const operationKinds = [
          'endorsement',
          'activate_account',
          'double_endorsement_evidence',
        ];
        let dataResult = [];
        let operationsCount = 0;
        const props = {
          page,
          limit: this.perPage,
        };
        if (this.account) {
          props.account_id = this.account;
        }

        for (let i = 0; i < operationKinds.length; i += 1) {
          const data = await this.$api.getOperations({
            ...props,
            operation_kind: operationKinds[i],
          });

          dataResult = [...dataResult, ...data.data];

          operationsCount += data.count;
        }

        this.operations = dataResult;
        this.count = operationsCount;
      },
    },
  };
</script>
