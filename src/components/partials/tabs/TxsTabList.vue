<template>
  <div class="list txs-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="limit"
        @onLimitChange="handleLimitChange"
        :loading="loading"
      />
    </div>

    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="2"
        :columns="6"
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
        <span class="position-relative w-100 d-flex align-items-center">
          <IdentIcon :seed="row.item.source" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.source } }"
            :class="row.item.sourceName === hash ? 'source' : 'destination'"
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

          <span v-if="hash === row.item.source" class="icon">
            <i class="icon__arrow--green"></i>
          </span>
          <span v-else-if="hash === row.item.destination" class="icon">
            <i class="icon__arrow--red"></i>
          </span>
        </span>
      </template>
      <template #cell(to)="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.destination" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.destination } }"
          >
            <template v-if="row.item.destinationName">
              {{ row.item.destinationName }}
            </template>
            <template v-else>
              {{ row.item.destination | longhash }}
            </template>
          </b-link>

          <BtnCopy
            v-if="!row.item.destinationName"
            :text-to-copy="row.item.destination"
          />
        </span>
      </template>
      <template #cell(amount)="row">
        {{ row.item.amount | denominate }}
      </template>
      <template #cell(fee)="row">
        {{ row.item.fee | denominate }}
      </template>
    </b-table>

    <PaginationSelect
      :total-rows="count"
      :per-page="limit"
      :current-page="currentPage"
      :loading="loading"
      @onPageChange="handlePageChange"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import defineRowClass from '@/mixins/defineRowClass';
  import tabulationList from '@/mixins/tabulationList';

  export default {
    name: 'TxsTabList',
    components: {
      LimitSelect,
      PaginationSelect,
      BtnCopy,
      IdentIcon,
    },
    mixins: [defineRowClass, tabulationList],
    props: {
      currentPage: Number,
      perPage: Number,
      hash: String,
      hashType: String,
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.txHash') },
          {
            key: 'from',
            label: this.$t('common.from'),
          },
          {
            key: 'to',
            label: this.$t('common.to'),
          },
          {
            key: 'amount',
            label: this.$t('common.amount'),
          },
          {
            key: 'fee',
            label: this.$t('common.fee'),
          },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ];
      },
    },
    watch: {
      hash: {
        immediate: true,
        async handler(hash) {
          if (!this.loaded && hash) {
            await this.reload(this.limit, this.page);
          }
        },
      },
    },
    async created() {
      if (!this.loaded && !this.hash) {
        await this.reload(this.limit, this.page);
      }
    },
    methods: {
      getAccountName(row, rowHash) {
        return `${row.item[`${rowHash}Name`] ||
          row.item[rowHash].slice(0, 15)}...`;
      },
      async reload(limit, page) {
        this.loading = true;
        const props = {
          page,
          limit,
        };
        switch (this.hashType) {
          case 'account':
            props.account_id = this.hash;
            break;
          case 'block':
            props.block_id = this.hash;
            break;
        }
        const data = await this.$api.getTransactions(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.items = data.data;
        this.count = data.count;
        this.loading = false;
        this.loaded = true;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .s {
    position: relative;
  }

  .source,
  .destination {
    position: relative;
  }

  .icon {
    &__arrow--red:before {
      position: absolute;
      content: '';
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #309282;
      border-top: 0.3em solid transparent;
      border-bottom: 0.3em solid transparent;
      border-left: 0.3em solid;
    }

    &__arrow--green:before {
      position: absolute;
      content: '';
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #e56968;
      border-top: 0.3em solid transparent;
      border-bottom: 0.3em solid transparent;
      border-left: 0.3em solid;
    }
  }
</style>
