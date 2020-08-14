<template>
  <PageContentContainer page-name="Baker page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <AssetSingle :hash="hash" />
        </b-container>
      </section>

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
                            {{ $t("listTypes.txsList") }}
                          </span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <AssetTabTxs :account="hash" />
                    </b-card-body>
                  </b-tab>
                  <b-tab :title="$tc('opTypes.holder', 2)" active>
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">
                            {{ $t("listTypes.holdersList") }}
                          </span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <AssetTabHolders :account="hash" />
                    </b-card-body>
                  </b-tab>
                  <b-tab :title="$tc('listTypes.otherOpsList', 2)" active>
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">
                            {{ $t("listTypes.otherOpsList") }}
                          </span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <AssetTabOther :account="hash" />
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
import AssetSingle from "../components/assets/AssetSingle";
import AssetTabTxs from "../components/assets/AssetTabTxs";
import AssetTabHolders from "../components/assets/AssetTabHolders";
import AssetTabOther from "../components/assets/AssetTabOther";

export default {
  name: "Asset",
  components: {
    PageContentContainer,
    Breadcrumbs,
    AssetSingle,
    AssetTabTxs,
    AssetTabHolders,
    AssetTabOther,
  },
  computed: {
    hash() {
      return this.$route.params.id;
    },
    crumbs() {
      return [
        { toRouteName: "network", text: this.$t("common.home") },
        { toRouteName: "assets", text: this.$t("pageTypes.assetsPage") },
        { toRouteName: "asset", text: this.hash }
      ];
    }
  }
};
</script>
