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
                <router-link :to="{ name: 'index' }">Home</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'txs' }">Transactions page</router-link>
              </li>
              <li class="breadcrumb-item active">{{txhash}}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <TxInfo
          :blockHash="txInfo.blockHash"
          :timestamp="txInfo.timestamp"
          :opHash="txInfo.operationGroupHash"
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
                  :items="items"
                  :fields="fields"
                  :current-page="currentPage"
                  :per-page="0"
                  class="transactions-table table table-borderless table-responsive-md"
                >
                  <template slot="from" slot-scope="row">
                    <b-link :to="{ name: 'account', params: { account: row.item.source } }">
                      <span>{{ row.item.source | longhash(20) }}</span>
                    </b-link>
                  </template>

                  <template slot="to" slot-scope="row">
                    <b-link :to="{ name: 'account', params: { account: row.item.destination } }">
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
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  align="right"
                  first-text
                  prev-text="Prev"
                  next-text="Next"
                  last-text
                ></b-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TxInfo from "../transactions/transaction";
import { mapState } from "vuex";
import { ACTIONS } from "../../store";

export default {
  name: "Transaction",
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      pageOptions: [10, 15, 20, 25, 30],
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
    ...mapState({
      counts: state => state.counts
    }),
    rows() {
      return this.count;
    },
    items() {
      return this.transactions;
    },
    txhash() {
      return this.$route.params.txhash;
    }
  },
  async mounted() {
    await this.reload();
  },
  components: {
    TxInfo
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
      const data = await this.$store.getters.API.getTransactions(props);
      if (data.status !== 200) {
        return this.$router.push({
          name: data.status
        });
      }
      if (data.data.length === 0) {
        return this.$router.push({
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

<style />
