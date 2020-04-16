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
			:tbody-tr-class=getRowClass
		>
			<template slot="rewards" slot-scope="row">
				{{ row.item.rewards | tezos }}
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
					<template slot="deposit" slot-scope="row">
						{{row.item.deposit | tezos}}
					</template>
					<template slot="timestamp" slot-scope="row">
						{{ row.item.timestamp | timeformat(dateFormat) }}
					</template>
					<template slot="estimated_time" slot-scope="row">
						{{ formatDate(row.item.estimated_time) }}
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
import moment from "moment"

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
        { key: "cycle", label: this.$tc('common.cycle', 1) },
        { key: "blocks", label: this.$tc("common.block", 2) },
        { key: "avgPriority", label: this.$t("bakerSingle.avgPriority") },
        { key: "missed", label: this.$t("bakerSingle.missed") },
        { key: "stolen", label: this.$t("bakerSingle.stolen") },
        { key: "rewards", label: this.$tc('common.reward', 2) },
        { key: "status", label: this.$tc('statusTypes.status') }
      ],
      selectedRow: {
        type: null,
        data: null,
        count: 0,
        fields: [],
        currentPage: 1
      },
      count: 0,
      total: null,
      future: [],
      data: [],
	    loading: false
    };
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    })
  },
  watch: {
    currentPage: {
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
    formatDate(date) {
      return moment(date).format(this.dateFormat);
    },
    getRowClass(item) {
      if (item === null || !item.status) {
        return 'baking-list-row';
      }

      const classes = ['baking-list-row'];

      if (typeof item === "object") {
        if (item.class && item.class === 'total') {
          classes.push('is-total');
        }

        if (item.class && item.class === 'future') {
          classes.push('is-future');
        }

        if (item.status && item.status === 'active') {
          classes.push('is-active');
        }
      }

      return classes.join(' ');
    },
    async handleRowClick(row) {
      if (this.loading || row.length === 0) return;
      this.loading = true;

      const isRowFuture = row[0].class === 'future';
      const isRowTotal = row[0].cycle === 'Total';

      if (isRowTotal) return;

			let modalData;
			let modalFields;
      this.cycleId = row[0].cycle;

      if (isRowFuture) {
        this.selectedRow.type = 'future';
        modalData = await this.$api.getAccountBakingRightsFuture({ account: this.account, cycleId: row[0].cycle });

        modalFields = [
          { key: "level", label: this.$t("common.blockId") },
          { key: "priority", label: this.$t("common.priority") },
          { key: "reward", label: this.$tc('common.reward', 2) },
          { key: "deposit", label: this.$t('common.deposit') },
          { key: "estimated_time", label: 'Estimated time' }
	      ];
      } else {
        this.selectedRow.type = 'baking';
        modalData = await this.$api.getAccountBakingItem({ account: this.account, cycleId: row[0].cycle });

        modalFields = [
          { key: "level", label: this.$t("common.blockId") },
          { key: "priority", label: this.$t("common.priority") },
          { key: "reward", label: this.$tc('common.reward', 2) },
          { key: "timestamp", label: this.$t("common.timestamp") }
        ];
      }

      this.selectedRow.fields = modalFields;
      this.selectedRow.data = modalData.data;
      this.selectedRow.count = modalData.count;
      this.$bvModal.show('modal-baking');
      this.loading = false;
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

        this.total = { ...total.data, status: 'Total' };
        this.future = future.data.map(item => ({...item, class: 'future'}));
        this.data = [
          ...this.future,
          {...total.data, cycle: 'Total', class: 'total', status: 'Total'},
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

      const { type } = this.selectedRow;
      let data;

      if (type === 'baking') {
	      data = await this.$api.getAccountBakingItem(props);
      } else {
        data = await this.$api.getAccountBakingRightsFuture(props);
      }

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
	.is {
		&-total {
			background-color: rgba(48, 146, 130, .7);
			pointer-events: none;
			
			& td {
				font-weight: 600;
			}
		}
		&-future {
			background-color: rgba(48, 146, 130, .3);
		}
	}
	.baking-list-row {
		cursor: pointer;
		
		&:focus,
		&:active,
		&:hover {
			outline: none;
		}
	}
	
	.baking-list-row {
		&.b-table-row-selected {
			background: none;
			
			& td,
			& th,
			& tr {
				background-color: rgba(48, 146, 130, .7);
			}
		}
		
		&.is-total.b-table-row-selected {
			background-color: #fff;
			
			& td,
			& th,
			& tr {
				background-color: rgba(48, 146, 130, .7);
			}
			
			&.is-future.b-table-row-selected {
				& td,
				& th,
				& tr {
					background-color: rgba(48, 146, 130, .3);
				}
			}
		}
		
		&.is-active {
			font-weight: 600;
			background-color: rgba(48, 146, 130, .5);
		}
	}
	
	.baker-baking-table a {
		color: $color-brand;
	}
	
  .page-link,
  .page-item.active .page-link,
	.page-item.disabled .page-link,
	.page-link {
		background-color: transparent;
		color: #309282;
		border: none;
		outline: none;
	}
  
  .page-link {
	  color: #9ea0a5;
  }
	
	.page-item:focus,
	.page-link:focus {
		box-shadow: none;
		outline: none;
	}

	.page-link:hover {
		color: #309282;
	}
</style>
