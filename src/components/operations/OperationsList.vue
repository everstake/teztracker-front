<template>
	<div>
		<div class="d-flex justify-content-between mb-2">
			<PerPageSelect @per-page="$_setPerPage" />
		</div>
		
		<b-table
			show-empty
			:items="operations"
			:fields="fields"
			:current-page="currentPage"
			:per-page="0"
			borderless
			class="transactions-table table-responsive-md"
		>
			<template slot="blockLevel" slot-scope="row">
				<b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
					{{ row.item.blockLevel | formatInteger }}
				</b-link>
			</template>
			
			<template slot="blockHash" slot-scope="row">
				<b-link
					:to="{ name: 'tx', params: { txhash: row.item.blockHash } }"
				>
					{{ row.item.blockHash | longhash(20) }}
				</b-link>
			</template>

			<template slot="timestamp" slot-scope="row">
				{{ row.item.timestamp | timeformat(dateFormat) }}
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
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import setPerPage from "@/mixins/setPerPage";
import { mapState } from "vuex"

export default {
  name: "OperationsList",
  components: {
    PerPageSelect,
    Pagination
  },
  mixins: [handleCurrentPageChange, setPerPage],
  props: ["account"],
  data() {
    return {
      operations: [],
      count: 0,
      fields: [
        { key: "blockLevel", label: "Block ID" },
        { key: "blockHash", label: "Hash" },
        { key: "kind", label: "Operation kind" },
        { key: "timestamp", label: "Timestamp" }
      ]
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
    async perPage() {
      await this.reload();
    }
  },
  async created() {
    await this.reload();
  },
  methods: {
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage
      };
      if (this.account) {
        props.account_id = this.account;
      }
      const operations = await this.$api.getOperations(props);
      this.operations = operations.data.filter(o => !(o.kind === 'transaction' || o.kind === 'delegation' || o.kind === 'origination'));
      this.count = operations.count;
    }
  }
};
</script>
