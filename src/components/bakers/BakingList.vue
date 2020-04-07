<template>
	<div>
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
			@row-clicked="handleRowClick"
			:tbody-tr-class="'baking-list-row'"
		>
			<template slot="avgPriority" slot-scope="row">
				{{ row.item.avgPriority === 0 ? 0 : row.item.avgPriority.toFixed(3) }}
			</template>
			<template slot="rewards" slot-scope="row">
				{{row.item.rewards | tezos}}
			</template>
		</b-table>

		<Pagination
			v-model="currentPage"
			:total-rows="count"
			:per-page="perPage"
		/>
	</div>
</template>

<script>
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import setPerPage from "@/mixins/setPerPage";

export default {
  name: "BakingList",
  components: {
    PerPageSelect,
    Pagination
  },
  mixins: [setPerPage],
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
      count: 0
    };
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload(value);
      }
    },
    async perPage() {
      await this.reload();
    }
  },
  methods: {
    handleRowClick: () => {},
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage,
        account: this.account
      };

      const data = await this.$api.getAccountBaking(props);

      this.count = data.count;
      this.data = data.data;
    }
  },
  created() {
	  this.reload();
  }
};
</script>

<style lang="scss">
	.baking-list-row {
		&:focus {
			outline-color: $color-brand;
		}
	}
</style>
