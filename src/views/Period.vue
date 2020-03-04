<template>
  <div class="main-content">
    <!-- Breadcrumbs start -->
    <CardSection class="breadcrumbs" :fluid="true">
      <template #breadcrumbs>
        <div class="page-title ml-2">
          <h2 class="breadcrumbs__title">
            Tezos (XTZ) Blockchain Explorer -
            <span>Proposal period</span>
          </h2>
        </div>

        <ol class="breadcrumb ml-2">
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'network' }">Home</router-link>
          </li>
          <li class="breadcrumb-item active">Proposal period</li>
        </ol>
      </template>
    </CardSection>
    <!-- Breadcrumbs end -->

    <!-- Period Steps start -->
    <CardSection :fluid="true">
      <template #body>
        <PeriodStep :periodTypes="periodTypes" :currentPeriodType="proposal.period.periodType" :periodStepUrls="getPeriodStepsLinks" />
      </template>
    </CardSection>
    <!-- Period Steps end -->

    <!-- Proposal period star -->
    <CardSection :fluid="true" v-if="currentPeriodType === 'proposal'">
      <template #body>
        <PeriodProposal
          :proposal="proposal"
          :voters="voters"
          class="vote__proposal"
        />
      </template>
    </CardSection>
    <!-- Proposal period end -->

    <!-- Proposal period start -->
<!--    <CardSection v-if="currentPeriodType === 'proposal'" :fluid="true">-->
<!--      <template #body>-->
<!--        <b-row>-->
<!--          <b-col cols="4">-->
<!--            <div class="vote-card">-->
<!--              <div class="vote-card__header">-->
<!--                <div class="vote-card__container-space-between">-->
<!--                  <p class="vote-card__font-size&#45;&#45;16 vote-card__weight&#45;&#45;bold">-->
<!--                    Proposals-->
<!--                  </p>-->
<!--                </div>-->
<!--                <div class="vote-card__divider"></div>-->
<!--                <DoughnutChart />-->
<!--              </div>-->
<!--            </div>-->
<!--          </b-col>-->

<!--          <b-col cols="8">-->
<!--            <div class="vote-card">-->
<!--              <div class="vote-card__header">-->
<!--                <div class="vote-card__container-space-between">-->
<!--                  <p class="vote-card__font-size&#45;&#45;16 vote-card__weight&#45;&#45;bold">-->
<!--                    General voting stats-->
<!--                  </p>-->
<!--                </div>-->
<!--                <div class="vote-card__divider"></div>-->
<!--                <div class="vote-card__body">-->
<!--                  <p class="vote-card__font-size&#45;&#45;14 vote-card__weight&#45;&#45;bold">-->
<!--                    Recent Votes-->
<!--                  </p>-->
<!--                  <div class="vote-card__recent" v-for="voter in voters.slice(0,3)" :key="generateKey()">-->
<!--                    <div>-->
<!--                      <div class="vote-card__recent-name">{{ voter.name || voter.pkh }}</div>-->
<!--                      <div class="vote-card__recent-proposal"><span>Proposal:</span> {{ voter.proposal | longhash(15) }}</div>-->
<!--                    </div>-->
<!--                    <div class="vote-card__recent-rolls">{{ voter.rolls }}</div>-->
<!--                  </div>-->
<!--                  <div class="vote-card__divider"></div>-->
<!--                  <b-row>-->
<!--                    <b-col cols="6">-->
<!--                      <div class="vote-card__container-space-between">-->
<!--                        <span class="vote-card__percentage"-->
<!--                          >{{getPercentage([proposal.voteStats.votesAvailable, proposal.voteStats.votesCast]).toFixed(2)}}%</span-->
<!--                        >-->
<!--                        <span class="vote-card__percentage"-->
<!--                          >{{ proposal.voteStats.votesCast }} /-->
<!--                          {{ proposal.voteStats.votesAvailable }}</span-->
<!--                        >-->
<!--                      </div>-->
<!--                      <b-progress-->
<!--                        :value="proposal.voteStats.votesCast"-->
<!--                        :max="proposal.voteStats.votesAvailable"-->
<!--                        class="mb-2"-->
<!--                      ></b-progress>-->
<!--                      <div class="vote-card__container-space-between">-->
<!--                        <span class="vote-card__percentage">Participation</span>-->
<!--                        <span class="vote-card__percentage">Votes Cast</span>-->
<!--                      </div>-->
<!--                      <div class="vote-card__p">-->
<!--                        Bakers {{ proposal.voteStats.numVoters }} / {{ proposal.voteStats.numVotersTotal }}-->
<!--                      </div>-->
<!--                    </b-col>-->
<!--                    <b-col cols="6">-->
<!--                      <div class="vote-card__container-space-between">-->
<!--                        <span class="vote-card__percentage"-->
<!--                          >{{-->
<!--                            getPercentage([proposal.voteStats.votesAvailable, proposal.voteStats.votesAvailable - proposal.voteStats.votesCast]).toFixed(2)-->
<!--                          }}%</span-->
<!--                        >-->
<!--                        <span class="vote-card__percentage"-->
<!--                          >{{-->
<!--                            proposal.voteStats.votesAvailable - -->
<!--                              proposal.voteStats.votesCast-->
<!--                          }}-->
<!--                          / {{ proposal.voteStats.votesAvailable }}</span-->
<!--                        >-->
<!--                      </div>-->
<!--                      <b-progress-->
<!--                        :value="-->
<!--                          proposal.voteStats.votesAvailable - -->
<!--                            proposal.voteStats.votesCast-->
<!--                        "-->
<!--                        :max="proposal.voteStats.votesAvailable"-->
<!--                        class="mb-2"-->
<!--                      ></b-progress>-->
<!--                      <div class="vote-card__container-space-between">-->
<!--                        <span class="vote-card__percentage">Undecided</span>-->
<!--                        <span class="vote-card__percentage"-->
<!--                          >Votes Availaible</span-->
<!--                        >-->
<!--                      </div>-->
<!--                      <div class="vote-card__p">-->
<!--                        Non-voters {{ proposal.voteStats.numVotersTotal - proposal.voteStats.numVoters }} / {{ proposal.voteStats.numVotersTotal }}-->
<!--                      </div>-->
<!--                    </b-col>-->
<!--                  </b-row>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </b-col>-->
<!--        </b-row>-->
<!--      </template>-->
<!--    </CardSection>-->
    <!-- Proposal period end -->

    <!-- Testing Period start -->
    <CardSection v-if="currentPeriodType === 'testing'" :fluid="true">
      <template #body>
        <b-row>
          <b-col cols="12">
            <div class="vote-card">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card__font-size--16 vote-card__weight--bold">
                    Babylon 2.0 (PsBabyM)
                  </p>
                </div>
                <div class="vote-card__divider"></div>
                <div class="vote-card__body">
                  <p class="vote-card__font-size--14 vote-card__weight--bold">
                    Recent Votes
                  </p>
                  <div class="vote-card__recent" v-for="voter in voters.slice(0,3)" :key="generateKey()">
                    <div>
                      <div class="vote-card__recent-name">{{ voter.name || voter.pkh }}</div>
                      <div class="vote-card__recent-proposal"><span>Proposal:</span> {{ voter.proposal | longhash(15) }}</div>
                    </div>
                    <div class="vote-card__recent-rolls">{{ voter.rolls }}</div>
                  </div>
                  <div class="vote-card__divider"></div>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </template>
    </CardSection>
    <!-- Testing Proposals end -->

    <!-- Exploration period start -->
    <CardSection v-if="currentPeriodType === 'exploration'" :fluid="true">
      <template #body>
        <b-row>
          <b-col cols="4">
            <div class="exploration-vote"></div>
          {{ proposal.ballots.yay }}
          </b-col>
        
          <b-col cols="4">
            {{ proposal.ballots.nay || 0 }}
          </b-col>

          <b-col cols="4">
            {{ proposal.ballots.pass }}
          </b-col>
        </b-row>
      </template>
    </CardSection>
    <!-- Exploration period end -->

    <!-- Period's proposals start -->
    <CardSection :fluid="true" v-for="proposalItem in proposalsList" :key="generateKey()">
      <template #body>
        <div class="vote-card">
          <div class="vote-card__header">
            <div class="vote-card__container-space-between">
              <div
                @click="copyToClipboard(proposalItem.hash)"
                id="card-title"
                class="vote-card__title-wrapper vote-card--pointer"
              >
                <p :ref='proposalItem.hash' class="vote-card__word-wrap vote-card__font-size--36 vote-card__weight--bold">{{ proposalItem.name || proposalItem.hash }}</p>
                <span class="icon vote-card__icon"><font-awesome-icon class="icon-primary" :icon="['fas', 'copy']"/></span>
                <b-tooltip ref="tooltip" triggers="hover" target="card-title">Copy to clipboard</b-tooltip>
              </div>
              <p class="vote-card__font-size--36">
                <span class="vote-card__weight--lighter">Upvotes:</span> {{getPercentage([proposal.voteStats.votesAvailable, proposal.voteStats.votesCast]).toFixed(2)}}%
              </p>
            </div>
            <div class="vote-card__title vote-card__font-size--18">
              <span class="vote-card__weight--lighter">ID:</span> {{ proposalItem.period }}
            </div>
            <div class="vote-card__divider"></div>
            <p class="vote-card__font-size--18">
              Increase the gas limit per block and per operation by 30%, improve
              the accuracy of the formula used for calculating baking and
              endorsing rewards and fix various small issues (see
              <a class="vote-card__link" href="#">changelog</a>)
            </p>
          </div>
        </div>
      </template>
    </CardSection>
    <!-- Period's proposals end -->

    <!-- Vote tables start -->
    <CardSection :fluid="true">
      <template #body>
        <div class="card ml-2 mr-2">
          <!-- Nav tabs -->
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" data-toggle="tab" href="#voters"
                >Voters</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#non-voters"
                >Non-voters</a
              >
            </li>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div class="tab-pane active" id="voters">
              <div class="card-header">
                <div class="title">
                  <h3>
                    <span class="text">Voters list</span>
                  </h3>
                </div>
              </div>

              <div class="card-body">
                <!-- voters table start -->
                <b-table
                  show-empty
                  stacked="md"
                  :items="voters"
                  :fields="votersFields"
                  :current-page="currentPage"
                  :per-page="0"
                  class="transactions-table table table-borderless table-responsive-md"
                >
                  <template slot="pkh" slot-scope="row">
                    <b-link :to="{ name: 'baker', params: { baker: row.item.pkh } }">
                      <span>{{ row.item.name || row.item.pkh | longhash(35) }}</span>
                    </b-link>
                  </template>

                  <template slot="blockLevel" slot-scope="row">
                    <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
                      <span>{{ row.item.blockLevel }}</span>
                    </b-link>
                  </template>

                  <template slot="operation" slot-scope="row">
                    <b-link :to="{ name: 'tx', params: { txhash: row.item.operation } }">
                      <span>{{ row.item.operation | longhash(35) }}</span>
                    </b-link>
                  </template>
                </b-table>

                <Pagination
                  v-model="currentPage"
                  :total-rows="voters.length"
                  :per-page="perPage"
                />
                <!-- voters table end -->
              </div>
            </div>

            <div class="tab-pane" id="non-voters">
              <div class="card-header">
                <div class="title">
                  <h3>
                    <span class="text">Non-voters list</span>
                  </h3>
                </div>
              </div>

              <div class="card-body">
                <!-- non-voters table start -->
                <b-table
                  show-empty
                  stacked="md"
                  :items="nonVoters"
                  :fields="nonVotersFields"
                  :current-page="currentPage"
                  :per-page="0"
                  class="transactions-table table table-borderless table-responsive-md"
                >
                  <template slot="pkh" slot-scope="row">
                    <b-link :to="{ name: 'baker', params: { baker: row.item.pkh } }">
                      <span>{{ row.item.name || row.item.pkh | longhash(35) }}</span>
                    </b-link>
                  </template>
                </b-table>

                <Pagination
                  v-model="currentPage"
                  :total-rows="voters.length"
                  :per-page="perPage"
                />
                <!-- non-voters table end -->
              </div>
            </div>
          </div>
        </div>
      </template>
    </CardSection>
    <!-- Vote tables end -->
  </div>
</template>

<script>
import PeriodStep from "@/components/proposal/PeriodStep";
import CardSection from "@/components/partials/CardSection";
import Pagination from '@/components/partials/Pagination';
import uuid from '@/mixins/uuid';
import PeriodProposal from '@/components/proposal/PeriodProposal'

export default {
  name: "Period",
  components: { PeriodStep, CardSection, Pagination, PeriodProposal },
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
      proposalsList: {},
      periodTypes: ['proposal', 'exploration', 'testing', 'promotion'],
      periods: [],
      perPage: 20,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
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
    };
  },
  updated() {
    console.log(this.currentPeriodType)
  },
  mixins: [uuid],
  methods: {
    getPercentage(arr) {
      const [a, b] = arr;
      return (b * 100) / a;
    },
    copyToClipboard(hash) {
      const selection = window.getSelection();
      const range = window.document.createRange();
      selection.removeAllRanges();
      range.selectNode(this.$refs[hash][0]);
      selection.addRange(range);

      try {
        document.execCommand('copy');
      } catch (err) {
        selection.removeAllRanges();
      }
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
      const data = await this.$api.getProposals({ id });
      this.proposalsList = data.data;
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
      this.ballots = data.data;
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
        await this.fetchBallots(this.$route.params.id);
        break;
    }
  }
};
</script>
