<template>
  <PageContentContainer page-name="Transaction page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs"/>
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <TxSingle
            :block-hash="txInfo.blockHash"
            :timestamp="txInfo.timestamp"
            :op-hash="txInfo.operationGroupHash"
            :level="txInfo.blockLevel"
            :fee="txInfo.fee"
            :status="txInfo.status"
          />
        </b-container>
      </section>

      <section
        v-if="!operationsWithHiddenTxTable.includes(txInfo.kind)"
        class="mt-0"
      >
        <b-container fluid>
          <b-row>
            <b-col lg="12">
              <b-card no-body>
                <b-card-header>
                  <div class="break-word">
                    <h3>
                      <span class="text">Transactions list</span>
                    </h3>
                  </div>
                </b-card-header>

                <b-card-body>
                  <b-table
                    show-empty
                    :items="transactions"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="0"
                    borderless
                    class="transactions-table table-responsive-md"
                    :tbody-tr-class="$_defineRowClass"
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
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </template>
  </PageContentContainer>
</template>

<script>
import PageContentContainer from "../layouts/PageContentContainer";
import Breadcrumbs from "../components/partials/Breadcrumbs";
import TxSingle from "../components/transactions/TxSingle";
import { mapState } from "vuex";
import Pagination from "../components/partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import defineRowClass from "@/mixins/defineRowClass";

export default {
  name: "Tx",
  components: {
    PageContentContainer,
    Breadcrumbs,
    TxSingle,
    Pagination
  },
  mixins: [handleCurrentPageChange, defineRowClass],
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
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
      ],
      operationsWithHiddenTxTable: [
        "endorsement",
        "activate_account",
        "double_baking_evidence",
        "double_endorsement_evidence"
      ]
    };
  },
  computed: {
    ...mapState('operations', {
      counts: state => state.counts
    }),
    txhash() {
      return this.$route.params.txhash;
    },
    crumbs() {
      return [
        {toRouteName: "network", text: "Home"},
        {toRouteName: "txs", text: "Transactions page"},
        {toRouteName: "tx", text: this.txhash}
      ];
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
