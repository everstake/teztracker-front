<template>
  <div class="main-content vote-content">
    <!-- Breadcrumbs start -->
    <PeriodBreadcrumbs :currentPeriodType="currentPeriodType" :loading="loading" />
    <!-- Breadcrumbs end -->

    <!-- Period Steps start -->
    <PeriodStep
      v-if="currentPeriodType === 'proposal' && proposals.length === 0"
      :periodTypes="periodTypes"
      :currentPeriodType="proposal.period.periodType"
      :periodStepUrls="[proposal.period.id, null, null, null]"
      :loading="loading"
    />
    <PeriodStep
      v-else
      :periodTypes="periodTypes"
      :currentPeriodType="proposal.period.periodType"
      :periodStepUrls="getPeriodStepsLinks"
      :loading="loading"
    />
    <!-- Period Steps end -->

    <CardSection
      v-if="loading"
      :fluid="true"
    >
      <template>
        <b-row>
          <b-col cols="12" sm="10" md="12" lg="12" xl="12" offset-cols="0" offset-sm="1" offset-md="0">
            <div class="vote-card vote-card__empty">
              <div class="vote-card__header">
                <p class="vote-card--margin-none vote-card__font-size--20 vote-card__font-size--centered font font--regular vote__loading">
                  Loading
                </p>
              </div>
            </div>
          </b-col>
        </b-row>
      </template>
    </CardSection>
    <div v-else>
      <!-- Proposal period start -->
      <PeriodProposal
        v-if="currentPeriodType === 'proposal' && proposals.length > 0"
        :proposal="proposal"
        :voters="voters"
        :proposals="proposals"
        :backgroundColors="backgroundColors.proposal"
        @setDoughnutLegendPosition="setPeriodWidth"
        :getDoughnutLegendPosition="getDoughnutLegendPosition"
        class="vote__proposal"
      />
      <CardSection
        v-else-if="currentPeriodType === 'proposal' && proposals.length === 0"
        :fluid="true"
      >
        <template>
          <b-row>
            <b-col cols="12" sm="10" md="12" lg="12" xl="12" offset-cols="0" offset-sm="1" offset-md="0">
              <div class="vote-card vote-card__empty">
                <div class="vote-card__header">
                  <p class="vote-card--margin-none vote-card__font-size--20 vote-card__font-size--centered font font--mini">
                    There is no proposals on this period.
                  </p>
                </div>
              </div>
            </b-col>
          </b-row>
        </template>
      </CardSection>

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

      <!-- Testing period start -->
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
      <!-- Testing period end -->

      <!-- Vote tables start -->
      <PeriodTable
        v-if="currentPeriodType === 'proposal' && proposals.length > 0"
        :voters="voters"
        :nonVoters='nonVoters'
        :votersFields='votersFields'
        :nonVotersFields="nonVotersFields"
        @onShowClick="handleShowClick"
      />

      <PeriodTable
        v-if="currentPeriodType === 'exploration' || currentPeriodType === 'promotion'"
        :voters="filteredVoters"
        :nonVoters='nonVoters'
        :votersFields='ballotFields'
        :nonVotersFields="nonVotersFields"
        @onShowClick="handleShowClick"
      />
      <!-- Vote tables end -->
    </div>
  </div>
</template>

<script>
import PeriodStep from "@/components/proposal/PeriodStep";
import uuid from '@/mixins/uuid';
import PeriodProposal from '@/components/proposal/PeriodProposal';
import PeriodExploration from '@/components/proposal/PeriodExploration';
import PeriodTesting from '@/components/proposal/PeriodTesting';
import PeriodBreadcrumbs from '@/components/proposal/PeriodBreadcrumbs';
import PeriodTable from "@/components/proposal/PeriodTable";
import { mapState, mapActions } from 'vuex';
import CardSection from '@/components/partials/CardSection';
import {
  GET_PERIODS,
  GET_PROPOSAL_PERIOD,
  GET_PROPOSALS,
  GET_VOTERS,
  GET_NON_VOTERS,
  GET_BALLOTS
} from "@/store/actions.types";

export default {
  name: "Period",
  components: {
    PeriodStep,
    PeriodProposal,
    PeriodExploration,
    PeriodTesting,
    PeriodBreadcrumbs,
    PeriodTable,
    CardSection
  },
  data() {
    return {
      proposall: {
        period: {
          periodType: "",
          endLevel: 0,
          endTime: "",
          id: 0,
          startLevel: 0,
          startTime: ""
        },
        voteStats: {
          numVoters: 0,
          numVotersTotal: 0,
          votesAvailable: 0,
          votesCast: 0
        },
        ballots: {
          yay: 0,
          pass: 0,
          nay: 0
        }
      },
      proposalss: [],
      periodTypes: ['proposal', 'exploration', 'testing', 'promotion'],
      periodss: [],
      voterss: [],
      votersFields: [
        { key: "pkh", label: "Baker" },
        { key: "rolls", label: "Number of voters" },
        { key: "id", label: "Vote" },
        { key: "blockLevel", label: "Block" },
        { key: "timestamp", label: "Timestamp" },
        { key: "operation", label: "Vote hash" }
      ],
      nonVoterss: [],
      nonVotersFields: [
        { key: "pkh", label: "Baker" },
        { key: "rolls", label: "Number of voters" }
      ],
      ballotFields: [
        { key: "pkh", label: "Baker" },
        { key: "rolls", label: "Number of voters" },
        { key: "decision", label: "Vote" },
        { key: "blockLevel", label: "Block" },
        { key: "timestamp", label: "Timestamp" },
        { key: "operation", label: "Vote hash" }
      ],
      backgroundColors: {
        proposal: ["#309282", "#9ea0a5"],
        exploration: ["#309282", "#e56968", "#9ea0a5"]
      },
      filterTable: false,
      loading: true,
      window: {
        width: 0
      }
    };
  },
  mixins: [uuid],
  methods: {
    ...mapActions('period', [GET_PROPOSAL_PERIOD, GET_PERIODS, GET_PROPOSALS, GET_VOTERS, GET_NON_VOTERS, GET_BALLOTS]),
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
    }
  },
  computed: {
    ...mapState('period', {
      votersCount: state => state.counts.voters,
      proposal: state => state.period,
      periods: state => state.periods,
      proposals: state => state.proposals,
      voters: state => state.voters,
      nonVoters: state => state.nonVoters
    }),
    filteredVoters() {
      if (this.filterTable === 'yay') {
        return this.voters.filter(voter => voter.decision === 'yay');
      }

      if (this.filterTable === 'nay') {
        return this.voters.filter(voter => voter.decision === 'nay');
      }

      if (this.filterTable === 'pass') {
        return this.voters.filter(voter => voter.decision === 'pass');
      }

      return this.voters;
    },
    currentPeriodType() {
      return this.proposal.period.periodType;
    },
    getPeriodStepsLinks() {
      const currentPeriodId = this.proposal.period.id;
      const currentPeriodType = this.proposal.period.periodType;
      const currentPeriodIndex = this.periods.findIndex(period => period.id === currentPeriodId);
      const currentPeriodTypeIndex = this.periodTypes.findIndex(period => period === currentPeriodType);
      let tempResult = [];
      const result = [];

      switch (currentPeriodTypeIndex) {
        case 0:
          tempResult = this.periods.slice(currentPeriodIndex, currentPeriodIndex + 4);
          break;
        case 1:
          tempResult = this.periods.slice(currentPeriodIndex - 1, currentPeriodIndex + 3);
          break;
        case 2:
          tempResult = this.periods.slice(currentPeriodIndex - 2, currentPeriodIndex + 2);
          break;
        case 3:
          tempResult = this.periods.slice(currentPeriodIndex - 3, currentPeriodIndex + 1);
          break;
        case 4:
          tempResult = this.periods.slice(currentPeriodIndex - 4, currentPeriodIndex);
          break;
        default:
          [null, null, null, null];
      }

      tempResult.map((item, index) => {
        if (item.periodType === this.periodTypes[index]) {
          result.push(item.id);
        } else {
          result.push(null);
        }
      });

      return result;
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
        return { position: 'bottom', align: 'center' }
      }

      return { position: 'bottom', align: 'center' };
    }
  },
  async created() {
    const { id } = this.$route.params;

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
  }
};
</script>
