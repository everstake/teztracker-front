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
            :kind="getOperationKind"
            :cycle="txInfo.cycle"
            :confirmations="txInfo.confirmations"
            :secret="txInfo.secret"
            :account="txInfo.pkh"
            :delegate="txInfo.delegate"
            :delegate-name="txInfo.delegateName"
            :slots="txInfo.slots"
            :endorsement-deposit="txInfo.endorsementDeposit"
            :endorsement-reward="txInfo.endorsementReward"
            :reward="txInfo.reward"
            :claimed-amount="txInfo.claimedAmount"
          />
        </b-container>
      </section>

      <section
        v-if="!operationsWithHiddenTxTable.includes(txInfo.kind) && transactions.length"
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
                        <template v-if="txInfo.kind === 'delegation'">
                          {{ $t("txPage.delegationDetails") }}
                        </template>
                        <template v-else-if="txInfo.kind === 'origination'">
                          {{ $t("txPage.originationDetails") }}
                        </template>
                        <template v-else>
                          {{ $t("txPage.txDetails") }}
                        </template>
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
                          params: { account: row.item.destination || row.item.delegate }
                        }"
                      >
                        {{
                          row.item.destinationName ||
                            row.item.destination ||
                            row.item.delegateName ||
                            row.item.delegate | longhash(20)
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
                      {{ row.item.gasLimit | formatInteger }}
                    </template>
                    <template slot="storage" slot-scope="row">
                      {{ row.item.storageLimit }}
                    </template>
                    <template slot="delegationAmount" slot-scope="row">
                      {{ row.item.delegationAmount | tezos }}
                    </template>
                    <template slot="balance" slot-scope="row">
                      {{ row.item.balance | tezos }}
                    </template>
                    <template slot="originatedContracts" slot-scope="row">
                      <b-link
                        :to="{
                          name: 'account',
                          params: { account: row.item.originatedContracts }
                        }"
                      >
                        {{ row.item.originatedContracts | longhash(20) }}
                      </b-link>
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
    },
    getOperationKind() {
      switch (this.txInfo.kind) {
        case "activate_account":
          return "activation";
        case "origination":
          return "origination";
        case "delegation":
          return "delegation";
        case "endorsement":
          return "endorsement";
        case "double_baking_evidence":
          return "dblBaking";
        case "double_endorsement_evidence":
          return "dblEndorsement";
        default:
          return "tx";
      }
    },
    fields() {
      let res =[];
  
      if (this.getOperationKind === "origination") {
        res = [
          { key: "from", label: this.$t("txPage.originator")},
          { key: "originatedContracts", label: this.$t("txPage.originatedAcc")},
          { key: "balance", label: this.$t("common.balance") },
          { key: "to", label: this.$t("common.delegate") },
          { key: "fee", label: this.$t("common.fee") },
          { key: "gas", label: this.$t("txPage.gasLimit") },
          { key: "storage", label: this.$t("txPage.storageLimit") }
        ];
      } else if (this.getOperationKind === "delegation") {
        res = [
          { key: "from", label: this.$t("common.from") },
          { key: "to", label: this.$t("common.to") },
          { key: "delegationAmount", label: this.$t("common.amountDelegated") },
          { key: "fee", label: this.$t("common.fee") },
          { key: "gas", label: this.$t("txPage.gasLimit") },
          { key: "storage", label: this.$t("txPage.storageLimit") }
        ];
      } else {
        res = [
          { key: "from", label: this.$t("common.from") },
          { key: "to", label: this.$t("common.to") },
          { key: "amount", label: this.$t("common.amount") },
          { key: "fee", label: this.$t("common.fee") },
          { key: "gas", label: this.$t("txPage.gasLimit") },
          { key: "storage", label: this.$t("txPage.storageLimit") }
        ]
      }

      return res;
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
