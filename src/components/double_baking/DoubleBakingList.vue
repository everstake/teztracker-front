<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="double_baking"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="txhash" slot-scope="row">
        <span>
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

      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>
      <template slot="baker" slot-scope="row">
        <span>
          <router-link
            class="baker"
            :to="{
              name: 'baker',
              params: { baker: row.item.doubleOperationDetails.evidence_baker },
            }"
          >
            <template
              v-if="row.item.doubleOperationDetails.evidence_baker_name"
            >
              {{ row.item.doubleOperationDetails.evidence_baker_name }}
            </template>
            <template v-else>
              {{ row.item.doubleOperationDetails.evidence_baker | longhash }}
            </template>
          </router-link>

          <BtnCopy
            v-if="!row.item.doubleOperationDetails.evidence_baker_name"
            :text-to-copy="row.item.doubleOperationDetails.evidence_baker"
          />
        </span>
      </template>
      <template slot="baker_rewards" slot-scope="row">
        {{ row.item.doubleOperationDetails.baker_reward | tezos }}
      </template>
      <template slot="offender" slot-scope="row">
        <span>
          <router-link
            class="baker"
            :to="{
              name: 'baker',
              params: { baker: row.item.doubleOperationDetails.offender },
            }"
          >
            <template v-if="row.item.doubleOperationDetails.offender_name">
              {{ row.item.doubleOperationDetails.offender_name }}
            </template>
            <template v-else>
              {{ row.item.doubleOperationDetails.offender | longhash }}
            </template>
          </router-link>

          <BtnCopy
            v-if="!row.item.doubleOperationDetails.offender_name"
            :text-to-copy="row.item.doubleOperationDetails.offender"
          />
        </span>
      </template>
      <template slot="denounced_level" slot-scope="row">
        <b-link
          :to="{
            name: 'block',
            params: { level: row.item.doubleOperationDetails.denounced_level },
          }"
        >
          {{ row.item.doubleOperationDetails.denounced_level | formatInteger }}
        </b-link>
      </template>
      <template slot="lost_deposits" slot-scope="row">
        {{ row.item.doubleOperationDetails.lost_deposits | tezos }}
      </template>
      <template slot="lost_rewards" slot-scope="row">
        {{ row.item.doubleOperationDetails.lost_rewards | tezos }}
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';
  import { SET_DOUBLE_BAKING_COUNT } from '@/store/mutations.types';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import BtnCopy from '@/components/partials/BtnCopy';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';

  export default {
    name: 'DoubleBakingList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
    },
    mixins: [handleCurrentPageChange, setPerPage],
    props: ['account'],
    data() {
      return {
        double_baking: [],
        count: 0,
        fields: [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.opHash') },
          { key: 'baker', label: this.$t('dblBakingList.accuser') },
          {
            key: 'baker_rewards',
            label: this.$t('dblBakingList.bakerRewards'),
          },
          { key: 'offender', label: this.$t('dblBakingList.offender') },
          { key: 'denounced_level', label: this.$t('common.denouncedLvl') },
          {
            key: 'lost_deposits',
            label: this.$t('dblBakingList.lostDeposits'),
          },
          { key: 'lost_rewards', label: this.$t('dblBakingList.lostRewards') },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ],
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
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
      ...mapMutations('operations', [SET_DOUBLE_BAKING_COUNT]),
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
        };
        if (this.block) {
          props.block_id = this.block.hash;
        }
        if (this.account) {
          props.account_id = this.account;
        }
        const data = await this.$api.getDoubleBaking(props);
        this.double_baking = data.data;
        this.count = data.count;
        this[SET_DOUBLE_BAKING_COUNT](this.count);
      },
    },
  };
</script>
