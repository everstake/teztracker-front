<template>
  <div class="main-content">
    <!-- Breadcrumbs start -->
    <PeriodBreadcrumbs :currentPeriodType="currentPeriodType" />
    <!-- Breadcrumbs end -->

    <!-- Period Steps start -->
    <PeriodStep
      :periodTypes="periodTypes"
      :currentPeriodType="proposal.period.periodType"
      :periodStepUrls="getPeriodStepsLinks"
    />
    <!-- Period Steps end -->

    <!-- Proposal period start -->
    <PeriodProposal
      v-if="currentPeriodType === 'proposal'"
      :proposal="proposal"
      :voters="voters"
      :proposals="proposals"
      class="vote__proposal"
    />
    <!-- Proposal period end -->

    <!-- Exploration period start -->
    <PeriodExploration
      v-if="currentPeriodType === 'exploration'"
      :proposal="proposal"
      :voters="voters"
      class="vote__exploration"
    />
    <!-- Exploration period end -->

    <!-- Testing period start -->
    <PeriodTesting
      v-if="currentPeriodType === 'testing'"
      :voters="voters"
      class="vote__testing"
    />
    <!-- Testing period end -->

    <!-- Testing period start -->
    <PeriodExploration
      v-if="currentPeriodType === 'promotion'"
      :proposal="proposal"
      :voters="voters"
      class="vote__promotion"
    />
    <!-- Testing period end -->

    <!-- Vote tables start -->
    <PeriodTable
      v-if="currentPeriodType === 'proposal'"
      :voters="voters"
      :nonVoters='nonVoters'
      :votersFields='votersFields'
      :nonVotersFields="nonVotersFields"
    />

    <PeriodTable
      v-if="currentPeriodType === 'exploration' || currentPeriodType === 'promotion'"
      :voters="voters"
      :nonVoters='nonVoters'
      :votersFields='ballotFields'
      :nonVotersFields="nonVotersFields"
    />
    <!-- Vote tables end -->
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

export default {
  name: "Period",
  components: {
    PeriodStep,
    PeriodProposal,
    PeriodExploration,
    PeriodTesting,
    PeriodBreadcrumbs,
    PeriodTable
  },
  computed: {
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
    }
  },
  data() {
    return {
      proposal: {
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
      proposals: [],
      periodTypes: ['proposal', 'exploration', 'testing', 'promotion'],
      periods: [],
      voters: [],
      votersFields: [
        { key: "pkh", label: "Baker" },
        { key: "rolls", label: "Number of voters" },
        { key: "id", label: "Vote" },
        { key: "blockLevel", label: "Block" },
        { key: "timestamp", label: "Timestamp" },
        { key: "operation", label: "Vote hash" }
      ],
      nonVoters: [],
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
      ]
    };
  },
  mixins: [uuid],
  methods: {
    getPercentage(arr) {
      const [a, b] = arr;
      return (b * 100) / a;
    },
    async fetchPeriod(id) {
      const data = await this.$api.getPeriod({ id });
      const { status } = data;

      if (status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({ name: status });
      }

      this.proposal = data.data;
    },
    async fetchPeriods(id) {
      const data = await this.$api.getPeriods({ id });
      this.periods = data.data;
    },
    async fetchProposals(id) {
      const { data } = await this.$api.getProposals({ id });
      data.map(proposal => {
        proposal.upvote = this.getPercentage([this.proposal.voteStats.votesAvailable, proposal.votesCasted]).toFixed(2);
      })

      this.proposals = data;
    },
    async fetchVoters(id) {
      const data = await this.$api.getVoters({ id });
      this.voters = data.data.map(voter => ({ ...voter, id }));
    },
    async fetchNonVoters(id) {
      const data = await this.$api.getNonVoters({ id });
      this.nonVoters = data.data.map(voter => ({ ...voter, id }));
    },
    async fetchBallots(id) {
      const data = await this.$api.getBallots({ id });
      this.voters = data.data;
    }
  },
  async created() {
    await this.fetchPeriod(this.$route.params.id);
    await this.fetchPeriods(this.$route.params.id);

    switch (this.currentPeriodType) {
      case 'proposal':
        await this.fetchProposals(this.$route.params.id);
        await this.fetchVoters(this.$route.params.id);
        await this.fetchNonVoters(this.$route.params.id);
        break;
      case 'exploration':
      case 'promotion':
        await this.fetchNonVoters(this.$route.params.id);
        await this.fetchBallots(this.$route.params.id);
        break;
    }
  }
};
</script>
