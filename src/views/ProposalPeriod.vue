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

    <!-- Proposal Steps start -->
    <CardSection :fluid="true">
      <template #body>
        <ProposalPeriodStep :type="proposal.periodType" />
      </template>
    </CardSection>
    <!-- Proposal Steps end -->

    <!-- Proposals start -->
    <CardSection :fluid="true">
      <template #body>
        <b-row>
          <b-col cols="4">
            <div class="vote-card">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card__font-size--16 vote-card__weight--bold">Proposals</p>
                </div>
                <div class="vote-card__divider"></div>
                <DoughnutChart />
              </div>
            </div>
          </b-col>

          <b-col cols="8">
            <div class="vote-card">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card__font-size--16 vote-card__weight--bold">General voting stats</p>
                </div>
                <div class="vote-card__divider"></div>
                <div class="vote-card__body">
                  <p class="vote-card__font-size--14 vote-card__weight--bold">Recent Votes</p>
                  <div class="vote-card__divider"></div>
                  <b-row>
                    <b-col cols="6">
                      <div class="vote-card__container-space-between">
                        <span class="vote-card__percentage">{{ getPercentage(proposal.voteStats.votesAvailable, proposal.voteStats.votesCast).toFixed(2) }}%</span>
                        <span class="vote-card__percentage">{{ proposal.voteStats.votesCast }} / {{ proposal.voteStats.votesAvailable }}</span>
                      </div>
                      <b-progress
                        :value="proposal.voteStats.votesCast"
                        :max="proposal.voteStats.votesAvailable"
                        class="mb-2"
                      ></b-progress>
                      <div class="vote-card__container-space-between">
                        <span class="vote-card__percentage">Participation</span>
                        <span class="vote-card__percentage">Votes Cast</span>
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="vote-card__container-space-between">
                        <span class="vote-card__percentage">{{ getPercentage(proposal.voteStats.votesAvailable, proposal.voteStats.votesAvailable - proposal.voteStats.votesCast).toFixed(2) }}%</span>
                        <span class="vote-card__percentage">{{ proposal.voteStats.votesAvailable - proposal.voteStats.votesCast }} / {{ proposal.voteStats.votesAvailable }}</span>
                      </div>
                      <b-progress
                        :value="proposal.voteStats.votesAvailable - proposal.voteStats.votesCast"
                        :max="proposal.voteStats.votesAvailable"
                        class="mb-2"
                      ></b-progress>
                      <div class="vote-card__container-space-between">
                        <span class="vote-card__percentage">Undecided</span>
                        <span class="vote-card__percentage">Votes Availaible</span>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </template>
    </CardSection>
    <!-- Proposals end -->

    <!-- Changelog start -->
    <CardSection :fluid="true">
      <template #body>
        <div class="vote-card">
          <div class="vote-card__header">
            <div class="vote-card__container-space-between">
              <p class="vote-card__font-size--36 vote-card__weight--bold">Carthage (PtCarthav)</p>
              <p class="vote-card__font-size--36"><span class="vote-card__weight--lighter">Upvotes:</span> 3.50%</p>
            </div>
            <div class="vote-card__title vote-card__font-size--18"><span class="vote-card__weight--lighter">ID:</span> 25</div>
            <div class="vote-card__divider"></div>
            <p class="vote-card__font-size--18">Increase the gas limit per block and per operation by 30%, improve the accuracy of the formula used for calculating baking and endorsing rewards and fix various small issues (see
              <a class="vote-card__link" href="#">changelog</a>)</p>
          </div>
        </div>
      </template>
    </CardSection>
    <!-- Changelog end -->

    <!-- Changelog start -->
    <CardSection :fluid="true">
      <template #body>
        <div class="vote-card">
          <div class="vote-card__header">
            <div class="vote-card__container-space-between">
              <p class="vote-card__font-size--36 vote-card__weight--bold">Carthage 2.0</p>
              <p class="vote-card__font-size--36"><span class="vote-card__weight--lighter">Upvotes:</span> 3.50%</p>
            </div>
            <div class="vote-card__title vote-card__font-size--18"><span class="vote-card__weight--lighter">ID:</span> 26</div>
            <div class="vote-card__divider"></div>
            <p class="vote-card__font-size--18">Increase the gas limit per block and per operation by 30%, improve the accuracy of the formula used for calculating baking and endorsing rewards and fix various small issues (see
              <a class="vote-card__link" href="#">changelog</a>)</p>
          </div>
        </div>
      </template>
    </CardSection>
    <!-- Changelog end -->

    <!-- Voters start -->
    <CardSection :fluid="true">
      <template #body>
        <div class="card ml-2 mr-2">
          <!-- Nav tabs -->
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a
                class="nav-link active"
                data-toggle="tab"
                href="#transactions"
              >Voters</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#delegations"
              >Non-voters</a
              >
            </li>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div class="tab-pane active" id="transactions">
              <div class="card-header">
                <div class="title">
                  <h3>
                    <span class="text">Baker list</span>
                  </h3>
                </div>
              </div>

              <div class="card-body">
                <!-- baker list -->
              </div>
            </div>

            <div class="tab-pane" id="delegations">
              <div class="card-header">
                <div class="title">
                  <h3>
                    <span class="text">Another Baker list</span>
                  </h3>
                </div>
              </div>

              <div class="card-body">
                <!-- another baker list -->
              </div>
            </div>
          </div>
        </div>
      </template>
    </CardSection>
    <!-- Voters end -->
  </div>
</template>

<script>
import ProposalPeriodStep from '@/components/proposal/ProposalPeriodStep';
import CardHeader from '@/components/partials/CardHeader';
import CardSection from "@/components/partials/CardSection";
import DoughnutChart from "@/components/partials/DoughnutChart";

export default {
  name: "ProposalPeriod",
  components: { ProposalPeriodStep, CardHeader, CardSection, DoughnutChart },
  computed: {

  },
  data: () => ({
    proposal: {
      period: {
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
      periodType: ""
    }
  }),
  methods: {
    async fetchProposal(id) {
      const data = await this.$api.getProposalPeriod({ id });
      const { status } = data;

      if (status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({ name: status });
      }

      this.proposal = data.data;
    },
    getPercentage(a, b) {
      return (b * 100) / a;
    }
  },
  created() {
    this.fetchProposal(this.$route.params.id);
  }
};
</script>
