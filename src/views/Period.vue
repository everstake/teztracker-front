<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <!-- Period Steps start -->
    <PeriodStep
      :shownCondition="
        currentPeriodType === 'proposal' && proposals.length === 0
      "
      :periodTypes="periodTypes"
      :currentPeriodType="proposal.period.periodType"
      :currentPeriodId="proposal.period.id"
      :periodStepUrls="getPeriodStepsLinks"
      :loading="loading"
    />
    <!-- Period Steps end -->

    <PeriodLoading v-if="loading" />
    <EmptyProposal
      v-else-if="
        !loading && currentPeriodType === 'proposal' && proposals.length === 0
      "
    />
    <PeriodNotFound
      v-else-if="
        !loading &&
          (proposal.period.periodType === '' ||
            isNaN(Number($route.params.id)) ||
            typeof Number($route.params.id) !== 'number')
      "
    />
    <div v-else>
      <!-- Proposal period start -->
      <PeriodProposal
        :condition="currentPeriodType === 'proposal' && proposals.length > 0"
        v-if="currentPeriodType === 'proposal' && proposals.length > 0"
        :proposal="proposal"
        :voters="voters"
        :proposals="proposals"
        :backgroundColors="backgroundColors.proposal"
        @setDoughnutLegendPosition="setPeriodWidth"
        :getDoughnutLegendPosition="getDoughnutLegendPosition"
        class="vote__proposal"
      />

      <!-- Proposal period end -->

      <!-- Exploration period start -->
      <PeriodExploration
        v-if="currentPeriodType === 'exploration'"
        :proposal="proposal"
        :voters="voters"
        :backgroundColors="backgroundColors.exploration"
        :sortBy="filterTable"
        @sortTableBy="enableTableSort"
        @setDoughnutLegendPosition="setPeriodWidth"
        :getDoughnutLegendPosition="getDoughnutLegendPosition"
        class="vote__exploration"
      />
      <!-- Exploration period end -->

      <!-- Testing period start -->
      <PeriodTesting
        v-if="currentPeriodType === 'testing'"
        :voters="voters"
        :proposal="proposal"
        class="vote__testing"
      />
      <!-- Testing period end -->

      <!-- Promotion period start -->
      <PeriodExploration
        v-if="currentPeriodType === 'promotion'"
        :proposal="proposal"
        :voters="voters"
        :backgroundColors="backgroundColors.exploration"
        class="vote__promotion"
        :sortBy="filterTable"
        @sortTableBy="enableTableSort"
        @setDoughnutLegendPosition="setPeriodWidth"
        :getDoughnutLegendPosition="getDoughnutLegendPosition"
      />
      <!-- Promotion period end -->

      <!-- Adoption period adoption -->
      <PeriodTesting
        v-if="currentPeriodType === 'adoption'"
        :voters="voters"
        :proposal="proposal"
        class="vote__testing"
      />
      <!-- Adoption period adoption -->

      <!-- Vote tables start -->
      <PeriodTable
        v-if="currentPeriodType === 'proposal' && proposals.length > 0"
        :voters="voters"
        :nonVoters="nonVoters"
        :votersFields="votersFields"
        :nonVotersFields="nonVotersFields"
        @onShowClick="handleShowClick"
      />

      <PeriodTable
        v-if="
          currentPeriodType === 'exploration' ||
            currentPeriodType === 'promotion'
        "
        :voters="filteredVoters"
        :nonVoters="nonVoters"
        :votersFields="ballotFields"
        :nonVotersFields="nonVotersFields"
        @onShowClick="handleShowClick"
      />
      <!-- Vote tables end -->
    </div>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import PeriodStep from '@/components/proposal/PeriodStep';
  import uuid from '@/mixins/uuid';
  import PeriodProposal from '@/components/proposal/PeriodProposal';
  import PeriodExploration from '@/components/proposal/PeriodExploration';
  import PeriodTesting from '@/components/proposal/PeriodTesting';
  import PeriodTable from '@/components/proposal/PeriodTable';
  import PeriodLoading from '@/components/proposal/PeriodLoading';
  import EmptyProposal from '@/components/proposal/EmptyProposal';
  import PeriodNotFound from '@/components/proposal/PeriodNotFound';
  import { mapState, mapActions } from 'vuex';
  import {
    GET_PERIODS,
    GET_PROPOSAL_PERIOD,
    GET_PROPOSALS,
    GET_VOTERS,
    GET_NON_VOTERS,
    GET_BALLOTS,
  } from '@/store/actions.types';

  export default {
    name: 'Period',
    components: {
      PeriodStep,
      PeriodProposal,
      PeriodExploration,
      PeriodTesting,
      Breadcrumbs,
      PeriodTable,
      PeriodLoading,
      EmptyProposal,
      PeriodNotFound,
    },
    data() {
      return {
        periodTypes: ['proposal', 'exploration', 'testing', 'promotion'],
        backgroundColors: {
          proposal: ['#309282', '#9ea0a5'],
          exploration: ['#309282', '#e56968', '#9ea0a5'],
        },
        filterTable: false,
        loading: true,
        window: {
          width: 0,
        },
      };
    },
    mixins: [uuid],
    watch: {
      '$route.params': {
        deep: true,
        immediate: true,
        async handler({ id }) {
          this.loading = true;
          await this.fetchPeriod(id);
          await this.fetchPeriods(id);

          switch (this.currentPeriodType) {
            case 'proposal':
              await this.fetchProposals(id);
              await this.fetchVoters(id);
              await this.fetchNonVoters(id);
              break;
            case 'exploration':
            case 'promotion':
              await this.fetchNonVoters(id);
              await this.fetchBallots(id);
              break;
          }

          this.loading = false;
        },
      },
    },
    created() {
      if (this.$route.params.id < 40) {
        return;
      }

      // add adoption step after 40 period

      this.periodTypes = [...this.periodTypes, 'adoption'];
    },
    methods: {
      ...mapActions('period', [
        GET_PROPOSAL_PERIOD,
        GET_PERIODS,
        GET_PROPOSALS,
        GET_VOTERS,
        GET_NON_VOTERS,
        GET_BALLOTS,
      ]),
      async enableTableSort(arg) {
        if (arg === this.filterTable) {
          this.filterTable = false;
          return;
        }

        this.filterTable = arg;
      },
      handleShowClick({ type, limit }) {
        this.filterTable = false;
        if (type === 'voters') {
          switch (this.currentPeriodType) {
            case 'proposal':
              this.fetchVoters(this.proposal.period.id, limit);
              break;
            case 'exploration':
            case 'promotion':
              this.fetchBallots(this.proposal.period.id, limit);
          }
        }

        if (type === 'nonVoters') {
          let nonVotersLimit = limit >= 300 ? 300 : limit;
          this.fetchNonVoters(this.proposal.period.id, nonVotersLimit);
        }
      },
      async fetchPeriod(id) {
        await this[GET_PROPOSAL_PERIOD]({ id });
      },
      async fetchPeriods(id) {
        await this[GET_PERIODS]({ id });
      },
      async fetchProposals(id) {
        await this[GET_PROPOSALS]({ period_id: id });
      },
      async fetchVoters(id, limit = 20) {
        await this[GET_VOTERS]({ id, limit });
      },
      async fetchNonVoters(id, limit = 20) {
        await this[GET_NON_VOTERS]({ id, limit });
      },
      async fetchBallots(id, limit = 20) {
        this[GET_BALLOTS]({ id, limit });
      },
      setPeriodWidth(width) {
        this.window.width = width;
      },
    },
    computed: {
      ...mapState('period', {
        votersCount: (state) => state.counts.voters,
        proposal: (state) => state.period,
        periods: (state) => state.periods,
        proposals: (state) => state.proposals,
        voters: (state) => state.voters,
        nonVoters: (state) => state.nonVoters,
        votersFields() {
          if (!this.$i18n.locale) return [];
          return [
            { key: 'pkh', label: this.$tc('common.baker', 1) },
            { key: 'rolls', label: this.$t('numberOf.#OfVotes') },
            { key: 'proposal', label: this.$t('common.vote') },
            { key: 'blockLevel', label: this.$tc('common.block', 1) },
            { key: 'timestamp', label: this.$t('common.timestamp') },
            { key: 'operation', label: this.$t('hashTypes.voteHash') },
          ];
        },
        nonVotersFields() {
          if (!this.$i18n.locale) return [];
          return [
            { key: 'pkh', label: this.$tc('common.baker', 1) },
            { key: 'rolls', label: this.$t('numberOf.#OfVotes') },
          ];
        },
        ballotFields() {
          if (!this.$i18n.locale) return [];
          return [
            { key: 'pkh', label: this.$tc('common.baker', 1) },
            { key: 'rolls', label: this.$t('numberOf.#OfVotes') },
            { key: 'decision', label: this.$t('common.vote') },
            { key: 'blockLevel', label: this.$tc('common.block', 1) },
            { key: 'timestamp', label: this.$t('common.timestamp') },
            { key: 'operation', label: this.$t('hashTypes.voteHash') },
          ];
        },
      }),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: this.currentPeriodType,
            text: !this.loading
              ? `${this.$helpers.capitalize(this.currentPeriodType)} period`
              : '',
          },
        ];
      },
      filteredVoters() {
        if (this.filterTable === 'yay') {
          return this.voters.filter((voter) => voter.decision === 'yay');
        }

        if (this.filterTable === 'nay') {
          return this.voters.filter((voter) => voter.decision === 'nay');
        }

        if (this.filterTable === 'pass') {
          return this.voters.filter((voter) => voter.decision === 'pass');
        }

        return this.voters;
      },
      currentPeriodType() {
        return this.proposal.period.periodType;
      },
      getPeriodStepsLinks() {
        const currentPeriodId = this.proposal.period.id;
        const currentPeriodType = this.proposal.period.periodType;

        const currentPeriodIndex = this.periods.findIndex(
          (period) => period.id === currentPeriodId,
        );

        const stepCount = this.periodTypes.length;
        const currentStepIndex = this.periodTypes.findIndex(
          (period) => period === currentPeriodType,
        );

        const startVotingIndex = currentPeriodIndex - currentStepIndex;
        const endVotingIndex = currentPeriodIndex + stepCount - currentStepIndex;

        return this.periods
          .slice(startVotingIndex, endVotingIndex)
          .map((period) => period.id);
      },
      getDoughnutLegendPosition() {
        if (this.window.width <= 480) {
          return { position: 'bottom', align: 'center' };
        }

        if (this.window.width >= 481 && this.window.width <= 767) {
          return { position: 'bottom', align: 'center' };
        }

        if (this.window.width >= 768 && this.window.width <= 1024) {
          return { position: 'bottom', align: 'center' };
        }

        if (this.window.width >= 1025 && this.window.width <= 1199) {
          return { position: 'bottom', align: 'center' };
        }

        return { position: 'bottom', align: 'center' };
      },
    },
  };
</script>
