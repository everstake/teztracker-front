<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="bakersFormatted"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="accountId" slot-scope="row">
        <b-link :to="{ name: 'baker', params: { baker: row.item.accountId } }">
          {{ row.item.name || row.item.accountId | longhash(35) }}
        </b-link>
      </template>
      <template slot="blocks" slot-scope="row">
        {{ row.item.blocks | formatInteger }}
      </template>
      <template slot="endorsements" slot-scope="row">
        {{ row.item.endorsements | formatInteger }}
      </template>
      <template slot="stakingBalance" slot-scope="row">
        {{ row.item.stakingBalance | tezos }}
      </template>
      <template slot="rolls" slot-scope="row">
        {{ row.item.rolls | formatInteger }}
      </template>
      <template slot="bakingSince" slot-scope="row">
        {{ row.item.bakingSince | timeformat(dateFormat) }}
      </template>
    </b-table>

    <PaginationWithCustomAction
      v-model="currentPage"
      :total-rows="count.bakers"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import setPerPage from '@/mixins/setPerPage';

  import withCustomAction from '../partials/withCustomAction';
  const PaginationWithCustomAction = withCustomAction(
    Pagination,
    'accounts',
    'GET_BAKERS',
  );

  export default {
    name: 'BakersList',
    components: {
      PerPageSelect,
      PaginationWithCustomAction,
    },
    mixins: [setPerPage],
    data() {
      return {
        currentPage: this.$constants.INITIAL_CURRENT_PAGE,
        // The key property must coincide with the corresponding keys in the data items
        fields: [
          {
            key: 'accountId',
            label: this.$tc('common.baker', 1),
            disableClear: true,
          },
          {
            key: 'blocks',
            label: this.$tc('common.block', 2),
            sortable: true,
            sortDirection: 'desc',
          },
          {
            key: 'endorsements',
            label: this.$tc('opTypes.endorsement', 2),
            sortable: true,
            sortDirection: 'desc',
          },
          {
            key: 'stakingBalance',
            label: this.$t('common.stakingBal'),
            sortable: true,
            sortDirection: 'desc',
          },
          {
            key: 'rolls',
            label: this.$t('common.rolls'),
            sortable: true,
            sortDirection: 'desc',
          },
          {
            key: 'bakingSince',
            label: this.$t('common.bakingSince'),
            disableClear: true,
          },
        ],
      };
    },
    computed: {
      ...mapState({
        bakers: (state) => state.accounts.bakers,
        count: (state) => state.accounts.counts,
        dateFormat: (state) => state.app.dateFormat,
      }),
      bakersFormatted() {
        if (!this.bakers || this.bakers.length === 0) return [];

        return this.bakers.map((bakerObj) => {
          return { accountId: bakerObj.accountId, ...bakerObj.bakerInfo };
        });
      },
    },
  };
</script>
