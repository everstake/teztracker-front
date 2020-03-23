<template>
  <PageContentContainer page-name="Block page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <BlockSingle :block="block" />
        </b-container>
      </section>

      <section class="mt-0">
        <b-container fluid>
          <EndorsementsSlots />
        </b-container>
      </section>

      <section class="mt-0">
        <b-container fluid>
          <b-row>
            <b-col lg="12">
              <b-card no-body>
                <b-tabs>
                  <b-tab title="Transactions" active>
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">Transactions list</span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <TxsList :block="block" />
                    </b-card-body>
                  </b-tab>
                  <b-tab title="Endorsements">
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">Endorsements list</span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <EndorsementsList :block="block.level" />
                    </b-card-body>
                  </b-tab>
                </b-tabs>
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
import BlockSingle from "../components/blocks/BlockSingle";
import EndorsementsSlots from "../components/endorsements/EndorsementsSlots";
import EndorsementsList from "../components/endorsements/EndorsementsList";
import TxsList from "../components/transactions/TxsList";

export default {
  name: "Block",
  components: {
    PageContentContainer,
    Breadcrumbs,
    BlockSingle,
    EndorsementsSlots,
    EndorsementsList,
    TxsList
  },
  data() {
    return {
      block: {}
    };
  },
  computed: {
    level() {
      return this.$route.params.level;
    },
    crumbs() {
      return [
        { toRouteName: "network", text: "Home" },
        { toRouteName: "blocks", text: "Blocks page" },
        { toRouteName: "block", text: this.level }
      ];
    }
  },
  watch: {
    level: {
      immediate: true,
      async handler(value) {
        await this.load(value);
      }
    }
  },
  methods: {
    async load(level) {
      const result = await this.$api.getBlock({ block: level });
      if (result.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: result.status
        });
      }
      this.block = result.data.block;
    }
  }
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
