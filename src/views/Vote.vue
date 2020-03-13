<template>
  <PageContentContainer page-name="Vote page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <StatisticsCard
            :title="voteHash"
            subtitle="Vote information"
            :fields="voteInfoRestructured"
          >
            <template #value="slotProps">
              <template v-if="slotProps.field.key === 'Timestamp'">
                {{ slotProps.field.value | timeformat(dateFormat) }}
              </template>
              <template v-else-if="slotProps.field.key === 'Source'">
                <router-link
                  :to="{ name: 'account', params: { account: slotProps.field.value } }"
                  class="baker"
                >
                  {{ slotProps.field.value }}
                </router-link>
              </template>
              <template v-else-if="slotProps.field.key === 'Included in block'">
                <router-link
                  :to="{ name: 'block', params: { level: slotProps.field.value } }"
                  class="baker"
                >
                  {{ slotProps.field.value }}
                </router-link>
              </template>
            </template>
          </StatisticsCard>
        </b-container>
      </section>
    </template>
  </PageContentContainer>
</template>

<script>
import PageContentContainer from "../layouts/PageContentContainer";
import Breadcrumbs from "../components/partials/Breadcrumbs";
import StatisticsCard from "../layouts/StatisticsCard";
import { mapState } from "vuex";

export default {
  name: "Vote",
  components: {
    PageContentContainer,
    Breadcrumbs,
    StatisticsCard
  },
  data() {
    return {
      voteInfo: {},
      // Map voteInfo keys with formatted ones
      voteInfoKeysMap: {
        blockHash: "Hash",
        ballot: "Vote",
        blockLevel: "Included in block",
        kind: "Kind",
        operationGroupHash: "Operation hash",
        proposal: "Proposal",
        source: "Source",
        timestamp: "Timestamp"
      },
      crumbs: []
    };
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    }),
    voteHash() {
      return this.$route.params.voteHash;
    },
    voteInfoRestructured() {
      if (!this.voteInfo || Object.keys(this.voteInfo).length === 0) return [];

      const excludedData = ["blockHash", "operationId"];
      return Object.keys(this.voteInfo)
        .filter(key => {
          return !excludedData.includes(key);
        })
        .map(key => {
          return { key: this.voteInfoKeysMap[key], value: this.voteInfo[key] };
        });
    }
  },
  watch: {
    voteHash: {
      immediate: true,
      async handler(value) {
        this.getBallot(value);
      }
    }
  },
  methods: {
    async getBallot(voteHash) {
      const props = {
        operation_id: voteHash
      };

      const result = await this.$api.getBallot(props);

      if (
        result.status !== this.$constants.STATUS_SUCCESS ||
        result.data.length === 0
      ) {
        return this.$router.push({
          name: "404"
        });
      }

      this.voteInfo = result.data[0];
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.params.id) {
        vm.crumbs = [
          { toRouteName: "network", text: "Home" },
          { toRouteName: from.name, text: from.name, params: { id: from.params.id } },
          { toRouteName: "vote", text: vm.voteHash }
        ];
      } else {
        vm.crumbs = [
          { toRouteName: "network", text: "Home" },
          { toRouteName: "vote", text: vm.voteHash }
        ];
      }
    });
  }
};
</script>
