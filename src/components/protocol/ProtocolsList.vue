<template>
  <div class="list txs-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="perPage"
        :loading="loading"
        @per-page="$_setPerPage"
        :perPageOptions="[20, 50, 100]"
      />
    </div>

    <div v-if="loading && protocols.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="9"
        :columns="4"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      responsive
      show-empty
      :items="protocols"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
    >
      <template #cell(startBlock)="row">
        <b-link :to="{ name: 'block', params: { level: row.item.startBlock } }">
          {{ row.item.startBlock | formatInteger }}
        </b-link>
      </template>
      <template #cell(endBlock)="row">
        <b-link :to="{ name: 'block', params: { level: row.item.endBlock } }">
          {{ row.item.endBlock | formatInteger }}
        </b-link>
      </template>
    </b-table>

    <Pagination
      v-if="isPaginationNeeded"
      @change="$_handleCurrentPageChange"
      :total-rows="protocolsCount"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';
  import { SET_PROTOCOLS_COUNT } from '@/store/mutations.types';
  import Pagination from '../partials/Pagination';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';
  import LimitSelect from '@/components/partials/LimitSelect';

  export default {
    name: 'ProtocolsList',
    components: {
      LimitSelect,
      Pagination,
    },
    mixins: [handleCurrentPageChange, setPerPage],
    props: ['account', 'loading'],
    data() {
      return {
        protocols: [],
        perPage: 20,
      };
    },
    computed: {
      ...mapState('period', {
        protocolsCount: (state) => state.counts.protocols,
      }),
      isPaginationNeeded() {
        return this.protocolsCount > 20;
      },
      fields() {
        return [
          { key: 'id', label: this.$tc('protocolsList.protocol', 1) },
          { key: 'hash', label: this.$t('hashTypes.hash') },
          { key: 'startBlock', label: this.$t('protocolsList.startingBlock') },
          { key: 'endBlock', label: this.$t('protocolsList.endingBlock') },
        ];
      },
    },
    watch: {
      currentPage: {
        async handler(value) {
          await this.reload(value);
        },
      },
      async perPage() {
        await this.reload();
      },
    },
    async created() {
      await this.reload();
    },
    methods: {
      ...mapMutations('period', [SET_PROTOCOLS_COUNT]),
      async reload(page = 1) {
        this.$emit('onLoading', true);
        const props = {
          page,
          limit: this.perPage,
        };

        const data = await this.$api.getProtocols(props);
        const result = data.data
          .map((protocol, index) => ({ ...protocol, id: index }))
          .reverse();
        this[SET_PROTOCOLS_COUNT](data.data.length);
        this.protocols = result;
        this.$emit('onLoading', false);
      },
    },
  };
</script>
