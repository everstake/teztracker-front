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
			:tbody-tr-class=getRowClass
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
        { key: "cycle", label: this.$tc("common.cycle", 1) },
        { key: "stakingBalance", label: this.$t("common.stakingBal") },
        { key: "baking", label: this.$t("bakerSingle.baking") },
        { key: "delegators", label: this.$t("common.delegators") },
        { key: "endorsements", label: this.$tc("opTypes.endorsement", 2) },
        { key: "losses", label: this.$t("common.losses") },
        { key: "fees", label: this.$t("common.fee") },
        { key: "status", label: this.$t("statusTypes.status") },
      ],
      count: 0,
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
      await this.reload({ page: value });
    }
  },
  methods: {
    getRowClass(item) {
      if (item === null || !item.status) {
        return 'rewards-list-row';
      }

      if (typeof item === "object") {
        const { status } = item;
        return `rewards-list-row ${status === 'active' ? 'active' : ''}`;
      }
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

	.rewards-list-row {
		&.active {
			font-weight: 600;
			background-color: rgba(48, 146, 130, .7);
		}
	}
	
</style>
