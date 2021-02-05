<template>
  <div class="list operations-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="limit"
        :loading="loading"
        @onLimitChange="handleLimitChange"
      />
    </div>

    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="2"
        :columns="3"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      responsive
      show-empty
      :items="items"
      :fields="fields"
      :current-page="page"
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

    <PaginationSelect
      :total-rows="count"
      :per-page="limit"
      :current-page="page"
      :loading="loading"
      @onPageChange="handlePageChange"
    />
  </div>
</template>

<script>
  import BtnCopy from '@/components/partials/BtnCopy';
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import tabulationList from '@/mixins/tabulationList';

  export default {
    name: 'OperationsTabList',
    components: {
      PaginationSelect,
      LimitSelect,
      BtnCopy,
    },
    mixins: [tabulationList],
    props: {
      hash: String,
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
    methods: {
      async reload(limit, page) {
        this.loading = true;
        let result = [];
        let counter = 0;
        const types = [
          'endorsement',
          'activate_account',
          'double_endorsement_evidence',
        ];
        const props = { page, limit, account_id: this.hash };

        for (let i = 0; i < types.length; i += 1) {
          const data = await this.$api.getOperations({
            ...props,
            operation_kind: types[i],
          });

          result = [...result, ...data.data];
          counter += data.count;
        }

        this.items = result;
        this.count = counter;
        this.loading = false;
        this.loaded = true;
      },
    },
  };
</script>
