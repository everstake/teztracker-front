<template>
  <div class="list originations-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="perPage"
        :loading="loading"
        @onLimitChange="
          (limit) => $emit('onLimitChange', { type: 'originations', limit })
        "
      />
    </div>
  
    <div v-if="loading && originations.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="2"
        :columns="7"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      responsive
      show-empty
      :items="originations"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
      :tbody-tr-class="$_defineRowClass"
    >
      <template #cell(txhash)="row">
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
      <template #cell(level)="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>
      <template #cell(timestamp)="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>
      <template #cell(from)="row">
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
      <template #cell(to)="row">
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
      <template #cell(amount)="row">
        {{ row.item.balance | denominate }}
      </template>
    </b-table>

    <PaginationSelect
      :total-rows="count"
      :per-page="perPage"
      :current-page="currentPage"
      :loading="loading"
      @onPageChange="
        (page) => $emit('onPageChange', { type: 'originations', page })
      "
    />
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import NoDataTableCell from '@/components/partials/NoDataTableCell';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'OriginationsTabList',
    components: {
      LimitSelect,
      PaginationSelect,
      BtnCopy,
      IdentIcon,
      NoDataTableCell,
    },
    mixins: [defineRowClass],
    props: {
      originations: {
        type: Array,
        default() {
          return [];
        },
      },
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
    async created() {
      const itemsNotFetched = !this.loaded;
      if (itemsNotFetched) {
        this.$emit('onReload', { type: 'originations', limit: this.perPage });
      }
    },
  };
</script>
