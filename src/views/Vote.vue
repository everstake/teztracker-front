<template>
  <PageContentContainer>
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <StatisticsCard
            :title="voteHash"
            :subtitle="$t('infoTypes.voteInfo')"
            :fields="voteInfoRestructured"
          >
            <template #value="slotProps">
              <template v-if="slotProps.field.key === $t('common.timestamp')">
                {{ slotProps.field.value | timeformat(dateFormat) }}
              </template>
              <template
                v-else-if="slotProps.field.key === $t('votePage.source')"
              >
                <router-link
                  :to="{
                    name: 'account',
                    params: { account: slotProps.field.value },
                  }"
                  class="baker"
                >
                  {{ slotProps.field.value }}
                </router-link>
              </template>
              <template
                v-else-if="slotProps.field.key === $t('common.includedInBlock')"
              >
                <router-link
                  :to="{
                    name: 'block',
                    params: { level: slotProps.field.value },
                  }"
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
  import PageContentContainer from '../layouts/PageContentContainer';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import StatisticsCard from '../layouts/StatisticsCard';
  import { mapState } from 'vuex';

  export default {
    name: 'Vote',
    components: {
      PageContentContainer,
      Breadcrumbs,
      StatisticsCard,
    },
    data() {
      return {
        voteInfo: {},
        // Map voteInfo keys with formatted ones
        voteInfoKeysMap: {
          blockHash: this.$t('hashTypes.hash'),
          ballot: this.$t('common.vote'),
          blockLevel: this.$t('common.includedInBlock'),
          kind: this.$t('votePage.kind'),
          operationGroupHash: this.$t('hashTypes.opHash'),
          proposal: this.$tc('voting.proposal', 1),
          source: this.$t('votePage.source'),
          timestamp: this.$t('common.timestamp'),
        },
        crumbs: [],
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      voteHash() {
        return this.$route.params.voteHash;
      },
      voteInfoRestructured() {
        if (!this.voteInfo || Object.keys(this.voteInfo).length === 0)
          return [];

        const excludedData = ['blockHash', 'operationId'];
        return Object.keys(this.voteInfo)
          .filter((key) => {
            return !excludedData.includes(key);
          })
          .map((key) => {
            return {
              key: this.voteInfoKeysMap[key],
              value: this.voteInfo[key],
            };
          });
      },
    },
    watch: {
      voteHash: {
        immediate: true,
        async handler(value) {
          this.getBallot(value);
        },
      },
    },
    methods: {
      async getBallot(voteHash) {
        const props = {
          operation_id: voteHash,
        };

        const result = await this.$api.getBallot(props);

        if (
          result.status !== this.$constants.STATUS_SUCCESS ||
          result.data.length === 0
        ) {
          return this.$router.push({
            name: '404',
          });
        }

        this.voteInfo = result.data[0];
      },
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (from.params.id) {
          vm.crumbs = [
            { toRouteName: 'network', text: vm.$t('common.home') },
            {
              toRouteName: from.name,
              text:
                from.name[0].toUpperCase() +
                from.name.slice(1) +
                ' ' +
                from.params.id,
              params: { id: from.params.id },
            },
            { toRouteName: 'vote', text: vm.voteHash },
          ];
        } else {
          vm.crumbs = [
            { toRouteName: 'network', text: vm.$t('common.home') },
            { toRouteName: 'vote', text: vm.voteHash },
          ];
        }
      });
    },
  };
</script>
