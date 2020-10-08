<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" :hide="!showPerPageFilter" />
    </div>

    <b-table
      show-empty
      :items="blocks"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-xl"
    >
      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          {{ row.item.level | formatInteger }}
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>

      <template slot="baker" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.baker" />

          <b-link :to="{ name: 'baker', params: { baker: row.item.baker } }">
            <template v-if="row.item.bakerName">
              {{ row.item.bakerName }}
            </template>
            <template v-else>
              {{ row.item.baker | longhash }}
            </template>
          </b-link>

          <BtnCopy v-if="!row.item.bakerName" :text-to-copy="row.item.baker" />
        </span>
      </template>

      <template slot="number_of_operations" slot-scope="row">
        {{ row.item.number_of_operations | formatInteger }}
      </template>

      <template slot="volume" slot-scope="row">
        {{ row.item.volume | tezos }}
      </template>

      <template slot="fees" slot-scope="row">
        {{ row.item.fees | tezos }}
      </template>
      <template slot="endorsements" slot-scope="row">
        {{ row.item.endorsements | formatInteger }}
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="Number(this.count.blocks)"
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
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import { SET_BLOCK } from '@/store/mutations.types';

  export default {
    name: 'BlocksList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
      IdentIcon,
    },
    mixins: [setPerPage, fetchListMixin, handleCurrentPageChange],
    props: {
      isTableComplete: {
        type: Boolean,
        default: true,
      },
      showPerPageFilter: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        fields: [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'timestamp', label: this.$t('common.timestamp') },
          { key: 'baker', label: this.$tc('common.baker', 1) },
          {
            key: 'priority',
            label: this.$t('common.priority'),
            class: !this.isTableComplete ? 'd-none' : '',
          },
          {
            key: 'number_of_operations',
            label: this.$t('numberOf.#OfOperations'),
            class: !this.isTableComplete ? 'd-none' : '',
          },
          {
            key: 'volume',
            label: this.$t('blocksList.volume'),
            class: !this.isTableComplete ? 'd-none' : '',
          },
          {
            key: 'fees',
            label: this.$t('common.fee'),
            class: !this.isTableComplete ? 'd-none' : '',
          },
          {
            key: 'endorsements',
            label: this.$t('numberOf.#OfEndorsements'),
            class: !this.isTableComplete ? 'd-none' : '',
          },
        ],
      };
    },
    computed: {
      ...mapState({
        blocks: (state) => state.blocks.blocks,
        count: (state) => state.blocks.counts,
        dateFormat: (state) => state.app.dateFormat,
      }),
    },
    methods: {
      ...mapMutations('blocks', [SET_BLOCK]),
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
        };
        const data = await this.$api.getBlocks(props);
        this[SET_BLOCK](data);
      },
    },
  };
</script>
