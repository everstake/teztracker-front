<template>
  <b-table
    responsive
    show-empty
    :items="items"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table"
    :tbody-tr-class="$_defineRowClass"
    :empty-text="$t('common.noData')"
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
    <template #cell(delegationAmount)="row">
      {{ row.item.delegationAmount | denominate }}
    </template>
    <template #cell(from)="row">
      <span class="d-flex align-items-center">
        <IdentIcon :seed="row.item.source" />

        <b-link :to="{ name: 'account', params: { account: row.item.source } }">
          <template v-if="row.item.sourceName">
            {{ row.item.sourceName }}
          </template>
          <template v-else>
            {{ row.item.source | longhash }}
          </template>
        </b-link>

        <BtnCopy v-if="!row.item.sourceName" :text-to-copy="row.item.source" />
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
    <template #cell(level)="row">
      <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
        {{ row.item.blockLevel | formatInteger }}
      </b-link>
    </template>
    <template #cell(timestamp)="row">
      {{ row.item.timestamp | timeformat(dateFormat) }}
    </template>
    <template #cell(fee)="row">
      {{ row.item.fee | denominate }}
    </template>
  </b-table>
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import defineRowClass from '@/mixins/defineRowClass';
  import NoDataTableCell from '@/components/partials/NoDataTableCell';

  export default {
    name: 'DelegationsTable',
    props: {
      items: Array,
      page: Number,
      limit: Number,
      propsFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    mixins: [defineRowClass],
    components: {
      BtnCopy,
      IdentIcon,
      NoDataTableCell,
    },
    computed: {
      ...mapState({
        dateFormat: (state) => state.app.dateFormat,
      }),
      fields() {
        const propsFields = this.propsFields.length > 0;
        if (!this.$i18n.locale) return [];
        if (propsFields) {
          return this.propsFields;
        } else {
          return [
            { key: 'level', label: this.$t('common.blockId') },
            { key: 'txhash', label: this.$t('hashTypes.delegationHash') },
            {
              key: 'delegationAmount',
              label: this.$t('common.amountDelegated'),
            },
            { key: 'from', label: this.$t('common.from') },
            { key: 'to', label: this.$t('common.to') },
            { key: 'fee', label: this.$t('common.fee') },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        }
      },
    },
  };
</script>
