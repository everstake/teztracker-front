<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="perPage"
        :loading="loading"
        @onLimitChange="(limit) => $emit('onLimitChange', { type: 'endorsements', limit })"
      />
    </div>

    <b-table
      responsive
      show-empty
      :items="endorsements"
      :fields="fields"
      :current-page="currentPage"
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

    <PaginationSelect
      :total-rows="count"
      :per-page="perPage"
      :current-page="currentPage"
      :loading="loading"
      @onPageChange="(page) => $emit('onPageChange', { type: 'endorsements', page })"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';

  export default {
    name: 'EndorsementsTabList',
    components: {
      LimitSelect,
      PaginationSelect,
      BtnCopy,
      IdentIcon,
    },

    props: {
      endorsements: {
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
          { key: 'level', label: this.$t('endorsementsList.endorsedBlock') },
          { key: 'txhash', label: this.$t('hashTypes.endorsementHash') },
          { key: 'blockLevel', label: this.$t('common.includedInBlock') },
          { key: 'endorser', label: this.$t('common.endorser') },
          { key: 'slots', label: this.$t('endorsementsList.slots') },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ];
      },
    },
    async created() {
      const itemsNotFetched = !this.loaded;
      if (itemsNotFetched) {
        this.$emit('onReload', { type: 'endorsements', limit: this.perPage });
      }
    },
  };
</script>
