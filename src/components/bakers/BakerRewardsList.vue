<template>
	<div class="baking-list">
		<div class="d-flex justify-content-between mb-2">
			<PerPageSelect @per-page="$_setPerPage" />
		</div>

		<b-table
			show-empty
			:items="data"
			:fields="fields"
			:current-page="currentPage"
			:per-page="0"
			borderless
			class="transactions-table table-responsive-md"
		>
			<template slot="stakingBalance" slot-scope="row">
				{{ row.item.stakingBalance | tezos }}
			</template>
			
			<template slot="fees" slot-scope="row">
				{{ row.item.fees || '----' }}
			</template>
			
		</b-table>

		<Pagination
			v-model="currentPage"
			@change="$_handleCurrentPageChange"
			:total-rows="count"
			:per-page="perPage"
		/>

		<div>
			<b-modal id="modal-baking" size="lg" centered hide-header hide-footer>
				<b-table
					show-empty
					:items="selectedRow.data"
					:fields="selectedRow.fields"
					:current-page="selectedRow.currentPage"
					:per-page="0"
					borderless
					class="transactions-table table-responsive-md baker-baking-table"
				>
				</b-table>
				
				<Pagination
					v-model="selectedRow.currentPage"
					@change="handleModalPagination"
					:total-rows="selectedRow.count"
					:per-page="selectedRow.perPage"
				/>
			</b-modal>
		</div>
	</div>
</template>

<script>
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import setPerPage from "@/mixins/setPerPage";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import { mapState } from "vuex"

export default {
  name: "BakerRewardsList",
  components: {
    PerPageSelect,
    Pagination
  },
  mixins: [
    setPerPage,
    handleCurrentPageChange
  ],
  props: ['account'],
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "cycle", label: 'Cycle' },
        { key: "stakingBalance", label: 'StakingBalance' },
        { key: "baking", label: 'Baking' },
        { key: "delegators", label: 'Delegators' },
        { key: "endorsements", label: 'Endorsements' },
        { key: "losses", label: 'Losses' },
        { key: "fees", label: 'Fees' }
      ],
      selectedRow: {
        data: null,
        count: 0,
        fields: [
          { key: "level", label: this.$t("common.blockId") },
          { key: "priority", label: 'Priority' },
          { key: "reward", label: 'Rewards' },
          { key: "timestamp", label: this.$t("common.timestamp") }
        ],
        currentPage: 1
      },
      count: 0,
      total: null,
      future: [],
      data: []
    };
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    })
  },
  watch: {
    currentPage: {
      immediate: true,
      async handler(value) {
        await this.reload(value);
      }
    },
    async perPage(value) {
      await this.reload({page: value});
    }
  },
  methods: {
    async handleRowClick(row) {
      return row;
    },
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage,
        account: this.account
      };

      const data = await this.$api.getAccountRewards(props);
      this.data = data.data;
      this.count = data.count;
    },
    handleModalPagination(page) {
      this.selectedRow.currentPage = page;
    }
  },
  async created() {
    this.reload();
  }
};
</script>

<style lang="scss">
	.is-total {
		background-color: green;
	}
	.baking-list-row {
		cursor: pointer;
		
		&:focus {
			outline: none;
		}
	}
	
	.baker-baking-table a {
		color: $color-brand;
	}

	.page-item.active .page-link,
	.page-item.disabled .page-link,
	.page-link {
		background-color: transparent;
		color: #309282;
		border: none;
		outline: none;
	}
	
	.page-item:focus,
	.page-link:focus {
		box-shadow: none;
		outline: none;
	}
	
</style>
