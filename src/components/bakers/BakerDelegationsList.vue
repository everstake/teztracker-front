<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect :per-page="perPage" @per-page="$_setPerPage" />
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

    <PaginationSelect
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
      :current-page="currentPage"
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

  export default {
    name: 'BakerDelegationsList',
    components: {
      LimitSelect,
      PaginationSelect,
      BtnCopy,
      IdentIcon,
      NoDataTableCell,
    },
    props: {
      delegations: {
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
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.delegationHash') },
          { key: 'delegationAmount', label: this.$t('common.amountDelegated') },
          { key: 'from', label: this.$t('common.from') },
          { key: 'to', label: this.$t('common.to') },
          { key: 'fee', label: this.$t('common.fee') },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ];
      },
    },
    async created() {
      const itemsEmpty = this.delegations.length === 0;
      if (itemsEmpty) {
        this.$emit('onReload', { type: 'delegations', limit: this.perPage });
      }
    },
    methods: {
      $_setPerPage(value) {
        this.$emit('onLimitChange', { type: 'delegations', limit: value });
      },
      $_handleCurrentPageChange(page) {
        this.$emit('onPageChange', { type: 'delegations', limit: this.perPage, page });
      },
    },
  };
</script>
