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
			:per-page="perPage"
			borderless
			class="transactions-table table-responsive-md"
			@row-selected="handleRowClick"
			selectable
			:select-mode="'single'"
			:tbody-tr-class="'baking-list-row'"
		>
			<template slot="rewards" slot-scope="row">
				{{row.item.rewards | tezos}}
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
					:per-page="selectedRow.perPage"
					borderless
					class="transactions-table table-responsive-md baker-baking-table"
				>
					<template slot="level" slot-scope="row">
						<b-link :to="{ name: 'block', params: { level: row.item.level } }">
							{{ row.item.level | formatInteger }}
						</b-link>
					</template>
					<template slot="reward" slot-scope="row">
						{{row.item.reward | tezos}}
					</template>
					<template slot="timestamp" slot-scope="row">
						{{ row.item.timestamp | timeformat(dateFormat) }}
					</template>
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
  name: "BakerBakingList",
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
        { key: "blocks", label: 'Blocks' },
        { key: "avgPriority", label: 'AvgPriority' },
        { key: "missed", label: 'Missed' },
        { key: "stolen", label: 'Stolen' },
        { key: "rewards", label: 'Rewards' }
      ],
      data: [],
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
      cycleId: null
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
    },
    'selectedRow.currentPage': {
      async handler(value) {
        await this.reload(value);
      }
    },
	  'selectedRow.perPage': {
      async handler() {
        await this.reload();
      }
    }
  },
  methods: {
    async handleRowClick(row) {
      const { cycle: cycleId } = row[0];
      if (cycleId === 'Total') return;
      this.cycleId = cycleId;
      const data = await this.$api.getAccountBakingItem({ account: this.account, cycleId });
      this.selectedRow.data = data.data;
      this.selectedRow.count = data.count;
      this.$bvModal.show('modal-baking');
    },
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage,
        account: this.account
      };

      const data = await this.$api.getAccountBaking(props);

      this.count = data.count;
      this.data = [...data.data];
    },
    handleModalPagination(page) {
      this.selectedRow.currentPage = page;
    }
  },
  async created() {
	  this.reload();
    const total = await this.$api.getAccountBakingTotal({account: this.account});
    this.total = {...total.data, cycle: 'Total'};
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
