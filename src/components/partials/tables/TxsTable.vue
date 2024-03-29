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
      <span class="d-flex align-items-center txs-hash">
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
          :class="row.item.sourceName === account ? 'source' : 'destination'"
        >
          <template v-if="row.item.sourceName">
            {{ row.item.sourceName }}
          </template>
          <template v-else>
            {{ row.item.source | longhash }}
          </template>
        </b-link>

        <BtnCopy v-if="!row.item.sourceName" :text-to-copy="row.item.source" />

        <span v-if="account === row.item.source" class="icon">
          <i class="icon__arrow--green"></i>
        </span>
        <span v-else-if="account === row.item.destination" class="icon">
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
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'TxsTable',
    props: {
      items: Array,
      page: Number,
      limit: Number,
      visibleFields: Array,
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
          ].filter((field) => this.visibleFields.includes(field.key));
        }
      },
      account() {
        return this.$route.account;
      },
    },
  };
</script>
