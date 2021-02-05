<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <BlockSingle :loading="block.loading" :block="block" />
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
                    <TxsTabList :hash="block.hash" hash-type="block" />
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
                    <EndorsementsTabList :hash="block.hash" />
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
                    <BlockOtherOperationsList :hash="block.hash" />
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
    data() {
      return {
        block: {
          loading: false,
        },
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
        this.block.loading = true;
        await this.$api
          .getBlock({ block: level })
          .then((data) => {
            this.block = data.data.block;
          })
          .catch((error) => {
            if (error.response) {
              this.$router.replace({
                name: error.response.status,
              });
            }
          });
        this.block.loading = false;
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
