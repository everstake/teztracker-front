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
    :empty-text="$t('common.noData')"
  >
    <template slot="level" slot-scope="row">
      <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
        {{ row.item.blockLevel | formatInteger }}
      </b-link>
    </template>
    
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
    
    <template slot="to" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.pkh" />

          <b-link :to="{ name: 'account', params: { account: row.item.pkh } }">
            {{ row.item.pkh | longhash }}
          </b-link>

          <BtnCopy :text-to-copy="row.item.pkh" />
        </span>
    </template>
    
    <template slot="timestamp" slot-scope="row">
      {{ row.item.timestamp | timeformat(dateFormat) }}
    </template>
  </b-table>
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';

  export default {
    name: 'ActivationsTable',
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
            { key: 'txhash', label: this.$t('hashTypes.opHash') },
            { key: 'to', label: this.$t('common.to') },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        }
      },
    },
  };
</script>
