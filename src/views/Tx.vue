<template>
  <PageContentContainer page-name="Transaction page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
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
                      <span class="text">
                        {{ $t("listTypes.txsList") }}
                      </span>
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
                        {{
                          row.item.sourceName || row.item.source | longhash(20)
                        }}
                      </b-link>
                    </template>

                    <template slot="to" slot-scope="row">
                      <b-link
                        :to="{
                          name: 'account',
                          params: { account: row.item.destination }
                        }"
                      >
                        {{
                          row.item.destinationName ||
                            row.item.destination | longhash(20)
                        }}
                      </b-link>
                    </template>
                    <template slot="amount" slot-scope="row">
                      {{ row.item.amount | tezos }}
                    </template>
                    <template slot="fee" slot-scope="row">
                      {{ row.item.fee | tezos }}
                    </template>
                    <template slot="gas" slot-scope="row">
                      {{ row.item.gasLimit }}
                    </template>
                    <template slot="storage" slot-scope="row">
                      {{ row.item.storageLimit }}
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
        { key: "from", label: this.$t("common.from") },
        { key: "to", label: this.$t("common.to") },
        { key: "amount", label: this.$t("common.amount") },
        { key: "fee", label: this.$t("common.fee") },
        { key: "gas", label: this.$t("txPage.gasLimit") },
        { key: "storage", label: this.$t("txPage.storageLimit") }
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
    ...mapState("operations", {
      counts: state => state.counts
    }),
    txhash() {
      return this.$route.params.txhash;
    },
    crumbs() {
      return [
        { toRouteName: "network", text: this.$t("common.home") },
        { toRouteName: "txs", text: this.$t("pageTypes.txsPage") },
        { toRouteName: "tx", text: this.txhash }
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
