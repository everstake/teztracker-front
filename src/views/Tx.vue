<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <TxSingle
          v-if="
            txInfo.kind &&
              txInfo.kind !== 'double_baking_evidence' &&
              txInfo.kind !== 'double_endorsement_evidence'
          "
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
        <DoubleOperationsSingle v-else-if="dataFetched" :props="txInfo" />
      </b-container>
    </section>

    <section
      v-if="
        (!operationsWithHiddenTxTable.includes(txInfo.kind) &&
          transactions.length &&
          operationsWithDetails.includes(txInfo.kind)) ||
          (operationsWithReveals.includes(txInfo.kind) &&
            transactionsSorted.reveals &&
            transactionsSorted.reveals.length)
      "
      class="mt-0"
    >
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <b-tabs>
                <b-tab
                  v-if="txInfo.kind !== 'activate_account'"
                  :title="
                    txInfo.kind === 'delegation'
                      ? $t('txPage.delegationDetails')
                      : txInfo.kind === 'origination'
                      ? $t('txPage.originationDetails')
                      : $t('txPage.txDetails')
                  "
                  active
                >
                  <b-card-body>
                    <b-table
                      responsive
                      show-empty
                      :items="transactionsSorted.operations"
                      :fields="fields"
                      :current-page="currentPage"
                      :per-page="0"
                      borderless
                      class="transactions-table"
                      :tbody-tr-class="$_defineRowClass"
                      :empty-text="$t('common.noData')"
                    >
                      <template slot="from" slot-scope="row">
                        <span class=" d-flex align-items-center">
                          <IdentIcon :seed="row.item.source" />

                          <b-link
                            :to="{
                              name: 'account',
                              params: { account: row.item.source },
                            }"
                          >
                            <template v-if="row.item.sourceName">
                              {{ row.item.sourceName }}
                            </template>
                            <template v-else>
                              {{ row.item.source | longhash }}
                            </template>
                          </b-link>

                          <BtnCopy
                            v-if="!row.item.sourceName"
                            :text-to-copy="row.item.source"
                          />
                        </span>
                      </template>

                      <template slot="to" slot-scope="row">
                        <b-link
                          :to="{
                            name: 'account',
                            params: {
                              account:
                                row.item.destination || row.item.delegate,
                            },
                          }"
                        >
                          <template
                            v-if="
                              row.item.destinationName || row.item.delegateName
                            "
                          >
                            {{
                              row.item.destinationName || row.item.delegateName
                            }}
                          </template>
                          <template
                            v-else-if="
                              row.item.destination || row.item.delegate
                            "
                          >
                            {{
                              row.item.destination ||
                                row.item.delegate | longhash
                            }}
                          </template>
                        </b-link>
                      </template>
                      <template slot="amount" slot-scope="row">
                        {{ row.item.amount | denominate }}
                      </template>
                      <template slot="fee" slot-scope="row">
                        {{ row.item.fee | denominate }}
                      </template>
                      <template slot="gas" slot-scope="row">
                        {{ row.item.gasLimit | formatInteger }}
                      </template>
                      <template slot="storage" slot-scope="row">
                        {{ row.item.storageLimit }}
                      </template>
                      <template slot="delegationAmount" slot-scope="row">
                        {{ row.item.delegationAmount | denominate }}
                      </template>
                      <template slot="balance" slot-scope="row">
                        {{ row.item.balance | denominate }}
                      </template>
                      <template slot="originatedContracts" slot-scope="row">
                        <b-link
                          :to="{
                            name: 'account',
                            params: { account: row.item.originatedContracts },
                          }"
                        >
                          {{ row.item.originatedContracts | longhash }}
                        </b-link>
                      </template>
                    </b-table>

                    <Pagination
                      :total-rows="count"
                      :per-page="perPage"
                      @change="$_handleCurrentPageChange"
                    />
                  </b-card-body>
                </b-tab>

                <b-tab
                  v-if="
                    operationsWithReveals.includes(txInfo.kind) &&
                      transactionsSorted.reveals &&
                      transactionsSorted.reveals.length
                  "
                  :title="$t('revealsList.reveal')"
                >
                  <b-card-body>
                    <RevealsList :items="transactionsSorted.reveals" />
                  </b-card-body>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';
  import TxSingle from '../components/transactions/TxSingle';
  import Pagination from '../components/partials/Pagination';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import defineRowClass from '@/mixins/defineRowClass';
  import DoubleOperationsSingle from '@/components/partials/DoubleOperationsSingle';
  import RevealsList from '@/components/operations/RevealsList';

  export default {
    name: 'Tx',
    components: {
      Breadcrumbs,
      IdentIcon,
      BtnCopy,
      TxSingle,
      Pagination,
      DoubleOperationsSingle,
      RevealsList,
    },
    mixins: [handleCurrentPageChange, defineRowClass],
    data() {
      return {
        perPage: this.$constants.PER_PAGE,
        transactions: [],
        count: 0,
        operationsWithHiddenTxTable: [
          'endorsement',
          'double_baking_evidence',
          'double_endorsement_evidence',
        ],
        operationsWithDetails: ['transaction', 'delegation', 'origination'],
        operationsWithReveals: [
          'transaction',
          'delegation',
          'origination',
          'activate_account',
        ],
        dataFetched: false,
      };
    },
    computed: {
      ...mapState('operations', {
        counts: (state) => state.counts,
      }),
      txhash() {
        return this.$route.params.txhash;
      },
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'txs', text: this.$t('pageTypes.txsPage') },
          { toRouteName: 'tx', text: this.txhash },
        ];
      },
      getOperationKind() {
        switch (this.txInfo.kind) {
          case 'activate_account':
            return 'activation';
          case 'origination':
            return 'origination';
          case 'delegation':
            return 'delegation';
          case 'endorsement':
            return 'endorsement';
          case 'double_baking_evidence':
            return 'dblBaking';
          case 'double_endorsement_evidence':
            return 'dblEndorsement';
          default:
            return 'tx';
        }
      },
      fields() {
        let res = [];

        if (this.getOperationKind === 'origination') {
          res = [
            { key: 'from', label: this.$t('txPage.originator') },
            {
              key: 'originatedContracts',
              label: this.$t('txPage.originatedAcc'),
            },
            { key: 'balance', label: this.$t('common.balance') },
            { key: 'to', label: this.$t('common.delegate') },
            { key: 'fee', label: this.$t('common.fee') },
            { key: 'gas', label: this.$t('txPage.gasLimit') },
            { key: 'storage', label: this.$t('txPage.storageLimit') },
          ];
        } else if (this.getOperationKind === 'delegation') {
          res = [
            { key: 'from', label: this.$t('common.from') },
            { key: 'to', label: this.$t('common.to') },
            {
              key: 'delegationAmount',
              label: this.$t('common.amountDelegated'),
            },
            { key: 'fee', label: this.$t('common.fee') },
            { key: 'gas', label: this.$t('txPage.gasLimit') },
            { key: 'storage', label: this.$t('txPage.storageLimit') },
          ];
        } else {
          res = [
            { key: 'from', label: this.$t('common.from') },
            { key: 'to', label: this.$t('common.to') },
            { key: 'amount', label: this.$t('common.amount') },
            { key: 'fee', label: this.$t('common.fee') },
            { key: 'gas', label: this.$t('txPage.gasLimit') },
            { key: 'storage', label: this.$t('txPage.storageLimit') },
          ];
        }

        return res;
      },
      transactionsSorted() {
        if (!this.transactions || !this.transactions.length) return {};

        return this.transactions.reduce(
          (acc, tx) => {
            if (tx.kind === 'reveal') {
              acc.reveals.push(tx);
            } else {
              acc.operations.push(tx);
            }

            return acc;
          },
          {
            operations: [],
            reveals: [],
          },
        );
      },
      txInfo() {
        if (!this.transactions || !this.transactions.length) return {};

        if (this.transactions.length > 1) {
          return this.transactions.reduce((acc, txObj) => {
            if (!Object.keys(acc).length && txObj.kind !== 'reveal') {
              acc = { ...txObj };
              return acc;
            }

            if (txObj.kind === 'transaction') {
              acc.fee += txObj.fee;
            }

            return acc;
          }, {});
        }

        return this.transactions[0];
      },
    },
    watch: {
      currentPage: {
        async handler(value) {
          await this.reload(value);
        },
      },
      txhash: {
        async handler() {
          await this.reload();
        },
      },
    },
    async created() {
      await this.reload();
    },
    methods: {
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
          operation_id: this.txhash,
        };
        const data = await this.$api.getTransactions(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        if (data.data.length === 0) {
          return this.$router.replace({
            name: '404',
          });
        }
        this.transactions = data.data;
        this.dataFetched = true;
        this.count = data.count;
      },
    },
  };
</script>
