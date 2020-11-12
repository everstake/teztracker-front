<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="perPage"
        :loading="loading"
        @onLimitChange="(limit) => $emit('onLimitChange', { type: 'operations', limit })"
      />
    </div>

    <b-table
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

    <PaginationSelect
      :current-page="currentPage"
      :total-rows="count"
      :per-page="perPage"
      :loading="loading"
      @onPageChange="(page) => $emit('onPageChange', { type: 'operations', page })"
    />
  </div>
</template>

<script>
  import BtnCopy from '@/components/partials/BtnCopy';
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';

  export default {
    name: 'OperationsTabList',
    components: {
      PaginationSelect,
      LimitSelect,
      BtnCopy,
    },
    props: {
      operations: {
        type: Array,
        default() {
          return [];
        },
      },
      future: Array,
      total: Object,
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
        return [
          { key: 'blockLevel', label: this.$t('common.blockId') },
          { key: 'blockHash', label: this.$t('hashTypes.hash') },
          { key: 'kind', label: this.$t('common.opType') },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ];
      },
    },
    async created() {
      const itemsNotFetched = !this.loaded;
      if (itemsNotFetched) {
        this.$emit('onReload', { type: 'operations', limit: this.perPage });
      }
    },
  };
</script>
