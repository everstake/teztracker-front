<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <StatisticsCard :title="voteHash" :subtitle="$t('infoTypes.voteInfo')">
          <template #body>
            <b-row v-if="voteInfo.ballot" class="item-info mr-1">
              <b-col :lg="3">
                <span class="label">
                  {{ $t('common.vote') }}
                </span>
              </b-col>
              <b-col :lg="9">
                <span class="text-accent text-capitalize">
                  {{ voteInfo.ballot }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col :lg="3">
                <span class="label">
                  {{ $t('common.includedInBlock') }}
                </span>
              </b-col>
              <b-col :lg="9">
                <span class="text-accent">
                  <router-link
                    :to="{
                      name: 'block',
                      params: { level: voteInfo.blockLevel },
                    }"
                    class="link"
                  >
                    {{ voteInfo.blockLevel | formatInteger }}
                  </router-link>
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col :lg="3">
                <span class="label">
                  {{ $t('txSingle.confirmations') }}
                </span>
              </b-col>
              <b-col :lg="9">
                <span class="text-accent text-capitalize">
                  {{ voteInfo.confirmations | formatInteger }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col :lg="3">
                <span class="label">
                  {{ $tc('common.cycle', 1) }}
                </span>
              </b-col>
              <b-col :lg="9">
                <span class="text-accent text-capitalize">
                  {{ voteInfo.cycle | formatInteger }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col :lg="3">
                <span class="label">
                  {{ $t('votePage.kind') }}
                </span>
              </b-col>
              <b-col :lg="9">
                <span class="text-accent text-capitalize">
                  {{ voteInfo.kind }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col :lg="3">
                <span class="label">
                  {{ $t('hashTypes.opHash') }}
                </span>
              </b-col>
              <b-col :lg="9">
                <span class="text-accent">
                  {{ voteInfo.operationGroupHash }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col :lg="3">
                <span class="label">
                  {{ $tc('voting.proposal', 1) }}
                </span>
              </b-col>
              <b-col :lg="9">
                <span class="text-accent">
                  {{ parseProposal(voteInfo.proposal, voteInfo.kind) }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col :lg="3">
                <span class="label">
                  {{ $t('votePage.source') }}
                </span>
              </b-col>
              <b-col :lg="9">
                <span class="text-accent d-flex align-items-center">
                  <IdentIcon :seed="voteInfo.source" />

                  <router-link
                    :to="{
                      name: 'account',
                      params: { account: voteInfo.source },
                    }"
                    class="baker"
                  >
                    <template v-if="voteInfo.sourceName">
                      {{ voteInfo.sourceName }}
                    </template>
                    <template v-else>
                      {{ voteInfo.source }}

                      <BtnCopy :text-to-copy="voteInfo.source" />
                    </template>
                  </router-link>
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col :lg="3">
                <span class="label">
                  {{ $t('common.timestamp') }}
                </span>
              </b-col>
              <b-col :lg="9">
                <span class="text-accent">
                  {{ voteInfo.timestamp | timeformat(dateFormat) }}
                </span>
              </b-col>
            </b-row>
          </template>
        </StatisticsCard>
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import StatisticsCard from '../layouts/StatisticsCard';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';
  import { mapState } from 'vuex';

  export default {
    name: 'Vote',
    components: {
      Breadcrumbs,
      StatisticsCard,
      BtnCopy,
      IdentIcon,
    },
    data() {
      return {
        voteInfo: {},
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
      parseProposal(proposalString, voteKind) {
        if (voteKind === 'proposals') {
          return proposalString.slice(1, -1);
        }
        return proposalString;
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
