<template>
  <div>
    <b-table
      show-empty
      :items="snapshots"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="cycle" slot-scope="row">
        {{ row.item.cycle | formatInteger }}
      </template>

      <template slot="level" slot-scope="row">
        <b-link
          :to="{ name: 'block', params: { level: row.item.snapshot_block } }"
        >
          {{ row.item.snapshot_block | formatInteger }}
        </b-link>
      </template>

      <template slot="rolls" slot-scope="row">
        {{ row.item.rolls | formatInteger }}
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      v-model="currentPage"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import { SET_SNAPSHOTS_COUNT } from '@/store/mutations.types';
  import Pagination from '../partials/Pagination';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';

  export default {
    name: 'SnapshotsList',
    components: {
      Pagination,
    },
    mixins: [handleCurrentPageChange],
    data() {
      return {
        perPage: this.$constants.PER_PAGE_SNAPSHOTS,
        snapshots: [],
        count: 0,
        fields: [
          { key: 'cycle', label: this.$tc('common.cycle', 2) },
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'rolls', label: this.$t('common.rolls') },
        ],
      };
    },
    watch: {
      currentPage: {
        async handler(value) {
          await this.reload(value);
        },
      },
    },
    async created() {
      await this.reload();
    },
    methods: {
      ...mapMutations('blocks', [SET_SNAPSHOTS_COUNT]),
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
        };
        const data = await this.$api.getSnapshots(props);

        this.snapshots = data.data;
        this.count = data.count;
        this[SET_SNAPSHOTS_COUNT](this.count);
      },
    },
  };
</script>
