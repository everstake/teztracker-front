<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <BlockSingle :block="block" />
      </b-container>
    </section>

    <EndorsementsSlots />

    <section class="mt-0">
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <b-tabs lazy>
                <b-tab :title="$tc('opTypes.tx', 2)" active>
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.txsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <TxsTabList
                      @onReload="reload"
                      :txs="txs"
                      :count="counts.txs"
                      :currentPage="page.txs"
                      :perPage="limit.txs"
                      :loaded="loaded.txs"
                      :loading="loading.txs"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                      :block-hash="block.hash"
                    />
                  </b-card-body>
                </b-tab>
                <b-tab :title="$tc('opTypes.endorsement', 2)">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.endorsementsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <EndorsementsTabList
                      @onReload="reload"
                      :endorsements="endorsements"
                      :count="counts.endorsements"
                      :currentPage="page.endorsements"
                      :perPage="limit.endorsements"
                      :loaded="loaded.endorsements"
                      :loading="loading.endorsements"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                      :disable-pagination="true"
                    />
                  </b-card-body>
                </b-tab>
                <b-tab :title="$t('common.other')">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.otherOpsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>
                  <b-card-body>
                    <BlockOtherOperationsList
                      @onReload="reload"
                      :operations="blockOtherOperations"
                      :count="counts.blockOtherOperations"
                      :currentPage="page.blockOtherOperations"
                      :perPage="limit.blockOtherOperations"
                      :loaded="loaded.blockOtherOperations"
                      :loading="loading.blockOtherOperations"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                      :block-hash="block.hash"
                    />
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
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import BlockSingle from '../components/blocks/BlockSingle';
  import EndorsementsSlots from '../components/endorsements/EndorsementsSlots';
  import BlockOtherOperationsList from '../components/blocks/BlockOtherOperationsList';
  import EndorsementsTabList from '@/components/partials/tabs/EndorsementsTabList';
  import TxsTabList from '@/components/partials/tabs/TxsTabList';
  import reloadTabTables from '@/mixins/reloadTabulationList';

  export default {
    name: 'Block',
    components: {
      TxsTabList,
      EndorsementsTabList,
      Breadcrumbs,
      BlockSingle,
      EndorsementsSlots,
      BlockOtherOperationsList,
    },
    mixins: [reloadTabTables],
    data() {
      return {
        block: {},
        otherOperations: [],
      };
    },
    computed: {
      level() {
        return this.$route.params.level;
      },
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'blocks', text: this.$t('pageTypes.blocksPage') },
          { toRouteName: 'block', text: this.level },
        ];
      },
    },
    watch: {
      level: {
        immediate: true,
        async handler(value) {
          await this.load(value);
        },
      },
    },
    methods: {
      async load(level) {
        const result = await this.$api.getBlock({ block: level });
        if (result.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: result.status,
          });
        }
        this.block = result.data.block;
      },
      async reloadEndorsements({ limit, page }) {
        this.loading.endorsements = true;
        if (!this.block.hash) return;
        const props = {
          page,
          limit,
          block_id: this.block.hash,
        };
        const data = await this.$api.getEndorsements(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.counts.endorsements = data.count;
        this.endorsements = data.data;
        this.loaded.endorsements = true;
        this.loading.endorsements = true;
      },
      async reloadTxs({ limit, page }) {
        this.loading.txs = true;
        if (!this.block.hash) return;
        const props = {
          page,
          limit,
          block_id: this.block.hash,
        };
        const data = await this.$api.getTransactions(props);
        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }
        this.txs = data.data;
        this.counts.txs = data.count;
        this.loaded.txs = true;
        this.loading.txs = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .main-content section .card .nav-tabs {
    @include for-phone-only {
      margin: 0;
      padding: 0 15px;
    }
    .nav-item {
      @include for-phone-only {
        width: 50%;
      }
      & .nav-link {
        @include for-phone-only {
          padding: 1rem 0rem;
        }
      }
    }
  }
</style>
