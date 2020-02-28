<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Transactions page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'network' }">Home</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'txs' }"
                  >Transactions page</router-link
                >
              </li>
              <li class="breadcrumb-item active">{{ txhash }}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <TxSingle
          :block-hash="txInfo.blockHash"
          :timestamp="txInfo.timestamp"
          :op-hash="txInfo.operationGroupHash"
          :level="txInfo.blockLevel"
          :fee="txInfo.fee"
        />
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card ml-2 mr-2">
              <div class="card-header">
                <div class="title">
                  <h3>
                    <span class="text">Transactions list</span>
                  </h3>
                </div>
              </div>

              <div class="card-body">
                <b-table
                  show-empty
                  stacked="md"
                  :items="transactions"
                  :fields="fields"
                  :current-page="currentPage"
                  :per-page="0"
                  class="transactions-table table table-borderless table-responsive-md"
                >
                  <template slot="from" slot-scope="row">
                    <b-link
                      :to="{
                        name: 'account',
                        params: { account: row.item.source }
                      }"
                    >
                      <span>{{ row.item.source | longhash(20) }}</span>
                    </b-link>
                  </template>

                  <template slot="to" slot-scope="row">
                    <b-link
                      :to="{
                        name: 'account',
                        params: { account: row.item.destination }
                      }"
                    >
                      <span>{{ row.item.destination | longhash(20) }}</span>
                    </b-link>
                  </template>
                  <template slot="amount" slot-scope="row">
                    <span>{{ row.item.amount | tezos }}</span>
                  </template>
                  <template slot="fee" slot-scope="row">
                    <span>{{ row.item.fee | tezos }}</span>
                  </template>
                  <template slot="gas" slot-scope="row">
                    <span>{{ row.item.gasLimit }}</span>
                  </template>
                  <template slot="storage" slot-scope="row">
                    <span>{{ row.item.storageLimit }}</span>
                  </template>
                </b-table>

                <Pagination
                  @change="$_handleCurrentPageChange"
                  :total-rows="count"
                  :per-page="perPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TxSingle from "../components/transactions/TxSingle";
import { mapState } from "vuex";
import Pagination from "../components/partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";

export default {
  name: "Tx",
  components: {
    TxSingle,
    Pagination
  },
  mixins: [handleCurrentPageChange],
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      transactions: [],
      txInfo: {},
      count: 0,
      fields: [
        { key: "from", label: "From" },
        { key: "to", label: "To" },
        { key: "amount", label: "Amount" },
        { key: "fee", label: "Fees" },
        { key: "gas", label: "Gas Limit" },
        { key: "storage", label: "Storage Limit" }
      ]
    };
  },
  computed: {
    ...mapState('operations', {
      counts: state => state.counts
    }),
    txhash() {
      return this.$route.params.txhash;
    }
  },
  async created() {
    await this.reload();
  },
  watch: {
    currentPage: {
      async handler(value) {
        this.transactions = [];
        await this.reload(value);
      }
    },
    txhash: {
      async handler(value) {
        await this.reload();
      }
    }
  },
  methods: {
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage,
        operation_id: this.txhash
      };
      const data = await this.$api.getTransactions(props);
      if (data.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: data.status
        });
      }
      if (data.data.length === 0) {
        return this.$router.replace({
          name: "404"
        });
      }
      this.transactions = data.data;
      this.txInfo = this.transactions[0] || {};
      this.count = data.count;
    }
  }
};
</script>
