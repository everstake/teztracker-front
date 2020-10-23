<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
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
      <template slot="startBlock" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.startBlock } }">
          {{ row.item.startBlock | formatInteger }}
        </b-link>
      </template>

      <template slot="endBlock" slot-scope="row">
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
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';

  export default {
    name: 'ProtocolsList',
    components: {
      PerPageSelect,
      Pagination,
    },
    mixins: [handleCurrentPageChange, setPerPage],
    props: ['account'],
    data() {
      return {
        protocols: [],
      };
    },
    computed: {
      ...mapState('period', {
        protocolsCount: (state) => state.counts.protocols,
      }),
      isPaginationNeeded() {
        return this.protocolsCount > 10;
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
      },
    },
  };
</script>
