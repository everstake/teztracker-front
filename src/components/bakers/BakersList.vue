<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      responsive
      show-empty
      :items="bakersFormatted"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
    >
      <template slot="id" slot-scope="row">
        <span>{{ row.index + 1 }}</span>
      </template>
      <template slot="accountId" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.accountId" />

          <b-link
            :to="{ name: 'baker', params: { baker: row.item.accountId } }"
          >
            <template v-if="row.item.name">
              {{ row.item.name }}
            </template>
            <template v-else>
              {{ row.item.accountId | longhash }}
            </template>
          </b-link>

          <BtnCopy v-if="!row.item.name" :text-to-copy="row.item.accountId" />
        </span>
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

    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="count.bakers"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import setPerPage from '@/mixins/setPerPage';
  import fetchListMixin from '@/mixins/fetchListMixin';
  import { SET_BAKERS } from '@/store/mutations.types';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';

  export default {
    name: 'BakersList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
      IdentIcon,
    },
    mixins: [fetchListMixin, handleCurrentPageChange, setPerPage],
    data() {
      return {
        // The key property must coincide with the corresponding keys in the data items
        fields: [
          { key: 'id', label: '#', tdClass: 'ordinal-number', thClass: 'ordinal-number' },
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
    methods: {
      ...mapMutations('accounts', [SET_BAKERS]),
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
        };
        const data = await this.$api.getBakers(props);
        this[SET_BAKERS](data);
      },
    },
  };
</script>
