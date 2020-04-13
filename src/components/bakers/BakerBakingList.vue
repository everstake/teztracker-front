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
					:per-page="0"
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
    },
    'selectedRow.currentPage': {
      deep: true,
      async handler(value) {
        await this.reloadAccountBakingItem(value);
      }
    },
	  'selectedRow.perPage': {
      deep: true,
      async handler() {
        await this.reloadAccountBakingItem();
      }
    }
  },
  methods: {
    async handleRowClick(row) {
      if (row.length === 0) return;
      const isRowFuture = this.future.find(findedItem => findedItem.cycle === row[0].cycle);
      const isRowTotal = row[0].cycle === 'Total';
      if (isRowFuture || isRowTotal) return;

      this.cycleId = row[0].cycle;

      const data = await this.$api.getAccountBakingItem({ account: this.account, cycleId: row[0].cycle });
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

      if (page === 1) {
        const total = await this.$api.getAccountBakingTotal({account: this.account});
        const future = await this.$api.getAccountBakingFuture({ account: this.account });
        const data = await this.$api.getAccountBaking(props);

        this.total = total.data;
        this.future = future.data;
        this.data = [
          {...total.data, cycle: 'Total'},
          ...future.data,
          ...data.data
        ];

        this.count = data.count + future.data.length + 1;
      } else {
        const data = await this.$api.getAccountBaking(props);
        this.data = data.data;
      }
    },
    async reloadAccountBakingItem(page = 1) {
      const props = {
        page,
        account: this.account,
        cycleId: this.cycleId
      };

      const data = await this.$api.getAccountBakingItem(props);
      this.selectedRow.data = data.data;
      this.selectedRow.count = data.count;

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
