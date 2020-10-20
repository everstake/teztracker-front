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
              <b-tabs>
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
                    <TxsList :block="block" />
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
                    <EndorsementsList
                      :disable-pagination="true"
                      :block-hash="block.hash"
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
                    <BlockOtherOperationsList :block-hash="block.hash" />
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
  import EndorsementsList from '../components/endorsements/EndorsementsList';
  import TxsList from '../components/transactions/TxsList';
  import BlockOtherOperationsList from '../components/blocks/BlockOtherOperationsList';

  export default {
    name: 'Block',
    components: {
      Breadcrumbs,
      BlockSingle,
      EndorsementsSlots,
      EndorsementsList,
      TxsList,
      BlockOtherOperationsList,
    },
    data() {
      return {
        block: {},
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
