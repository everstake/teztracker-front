<template>
  <div class="list list-endorsements">
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
      :items="items"
      :fields="fields"
      :current-page="page"
      :per-page="0"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
    >
      <template #cell(block)="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          {{ row.item.level | formatInteger }}
        </b-link>
      </template>
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
      <template #cell(blockLevel)="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>
      <template #cell(endorser)="row">
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
      <template #cell(level)="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          {{ row.item.level | formatInteger }}
        </b-link>
      </template>
      <template #cell(slots)="row">
        {{ row.item.slots }}
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
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import tabulationList from '@/mixins/tabulationList';

  export default {
    name: 'EndorsementsTabList',
    components: {
      LimitSelect,
      PaginationSelect,
      BtnCopy,
      IdentIcon,
    },
    props: {
      hash: String,
    },
    mixins: [tabulationList],
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
    methods: {
      async reload(limit, page) {
        this.loading = true;
        const props = {
          page,
          limit,
          account_id: this.hash,
        };
        const data = await this.$api.getEndorsements(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.count = data.count;
        this.items = data.data;
        this.loading = false;
        this.loaded = true;
      },
    },
  };
</script>
