<template>
  <div>
    <div
      class="d-flex justify-content-between mb-2"
      v-if="!isBlockEndorsements"
    >
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      responsive
      show-empty
      :items="endorsements"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="block" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          {{ row.item.level | formatInteger }}
        </b-link>
      </template>

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

      <template slot="blockLevel" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>

      <template slot="endorser" slot-scope="row">
        <span>
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

    <Pagination
      v-if="!disablePagination"
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_ENDORSEMENTS_COUNT } from '@/store/mutations.types';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import BtnCopy from '@/components/partials/BtnCopy';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';

  export default {
    name: 'EndorsementsList',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
    },
    mixins: [handleCurrentPageChange, setPerPage],
    props: ['blockHash', 'account', 'isBaker', 'disablePagination'],
    data() {
      return {
        endorsements: [],
        count: 0,
        fields: [],
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      level() {
        return this.$route.params.level;
      },
      isBlockEndorsements() {
        return this.level > 0;
      },
    },
    watch: {
      currentPage: {
        async handler(value) {
          await this.reload({ page: value, block: this.blockHash });
        },
      },
      blockHash: {
        async handler(value) {
          if (this.isBlockEndorsements) {
            await this.reload({ block: value });
          }
        },
      },
      perPage: {
        async handler() {
          if (!this.isBlockEndorsements) {
            await this.reload({ block: this.blockHash });
          }
        },
      },
    },
    async created() {
      if (this.isBlockEndorsements) {
        this.perPage = this.$constants.ENDORSEMENTS_LIMIT;
      } else {
        this.perPage = this.$constants.PER_PAGE;
        await this.reload({ block: this.blockHash });
      }
    },
    methods: {
      ...mapMutations('blocks', [SET_ENDORSEMENTS_COUNT]),
      async reload({ page = 1, block = 0 } = {}) {
        const props = {
          page,
          limit: this.perPage,
        };
        let result;
        if (this.account) {
          props.account_id = this.account;
        }
        if (this.isBlockEndorsements) {
          props.block_id = block;
          // TODO: Refactor API service
          delete props.page;
          result = await this.$api.getEndorsements(props);
        } else {
          result = await this.$api.getEndorsements(props);
        }
        if (result.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: result.status,
          });
        }
        this.count = result.count;
        this.endorsements = result.data;
        this[SET_ENDORSEMENTS_COUNT](this.count);

        this.setTableFields();
      },
      setTableFields() {
        if (this.isBaker) {
          this.fields = [
            { key: 'level', label: this.$t('endorsementsList.endorsedBlock') },
            { key: 'txhash', label: this.$t('hashTypes.endorsementHash') },
            { key: 'blockLevel', label: this.$t('common.includedInBlock') },
            { key: 'endorser', label: this.$t('common.endorser') },
            { key: 'slots', label: this.$t('endorsementsList.slots') },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        } else {
          this.fields = [
            { key: 'level', label: this.$t('endorsementsList.endorsedBlock') },
            { key: 'txhash', label: this.$t('hashTypes.endorsementHash') },
            { key: 'endorser', label: this.$t('common.endorser') },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        }
      },
    },
  };
</script>
