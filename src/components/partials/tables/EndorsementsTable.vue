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
    <template slot="block" slot-scope="row">
      <b-link :to="{ name: 'block', params: { level: row.item.level } }">
        {{ row.item.level | formatInteger }}
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
    
    <template slot="blockLevel" slot-scope="row">
      <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
        {{ row.item.blockLevel | formatInteger }}
      </b-link>
    </template>
    
    <template slot="endorser" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.delegate" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.delegate } }"
          >
            <span v-if="row.item.delegateName">{{
              row.item.delegateName
            }}</span>
            <span v-else>{{ row.item.delegate | longhash }}</span>
          </b-link>

          <BtnCopy
            v-if="!row.item.delegateName"
            :text-to-copy="row.item.delegate"
          />
        </span>
    </template>
    
    <template slot="level" slot-scope="row">
      <b-link :to="{ name: 'block', params: { level: row.item.level } }">
        {{ row.item.level | formatInteger }}
      </b-link>
    </template>
    
    <template slot="slots" slot-scope="row">
      {{ row.item.slots }}
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
    name: 'EndorsementsTable',
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
            { key: 'level', label: this.$t('endorsementsList.endorsedBlock') },
            { key: 'txhash', label: this.$t('hashTypes.endorsementHash') },
            { key: 'endorser', label: this.$t('common.endorser') },
            { key: 'slots', label: this.$t('endorsementsList.slots') },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        }
      },
    },
  };
</script>
