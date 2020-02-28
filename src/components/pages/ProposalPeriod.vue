<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <b-container fluid>
        <b-row>
          <b-col lg="12">
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
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <ProposalPeriodStep :type="proposal.periodType" />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="4">
            <div class="card">
              <TzCardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Proposals</h4>
                </template>
              </TzCardHeader>

              <div class="card-divider"></div>

              <div class="card-body">

              </div>
            </div>
          </b-col>
          <b-col lg="8">
            <div class="card">
              <TzCardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">General voting stats</h4>
                </template>
              </TzCardHeader>

              <div class="card-divider"></div>

              <TzCardHeader>
                <template v-slot:left-content class="text">
                  <h3>
                    <span class="text">Recent Votes</span>
                  </h3>
                </template>
                <template v-slot:right-content>
                  <h3>
                    <span class="text">Votes</span>
                  </h3>
                </template>
              </TzCardHeader>

              <div class="card-body">

              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <div class="card">
              <TzCardHeader>
                <template v-slot:left-content class="text">
                  <h2 class="tz-title--bold">Carthage (PtCarthav)</h2>
                  <span>ID: 25</span>
                </template>
                <template v-slot:right-content class="text">
                  <h2 class="tz-title--bold">Upvotes: 3.50%</h2>
                </template>
              </TzCardHeader>

              <div class="card-divider"></div>

              <div class="card-body">
                <p>
                  Increase the gas limit per block and per operation by 30%, improve the accuracy of the formula used for calculating baking and endorsing rewards and fix various small issues (see changelog)
                </p>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <div class="card">
              <TzCardHeader>
                <template v-slot:left-content class="text">
                  <h2 class="tz-title--bold">Carthage 2.0</h2>
                  <span>ID: 24</span>
                </template>
                <template v-slot:right-content class="text">
                  <h2 class="tz-title--bold">Upvotes: 3.50%</h2>
                </template>
              </TzCardHeader>

              <div class="card-divider"></div>

              <div class="card-body">
                <p>
                  Increase the gas limit per block and per operation by 30%, improve the accuracy of the formula used for calculating baking and endorsing rewards and fix various small issues (see changelog)
                </p>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
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
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ProposalPeriodStep from '@/components/proposal/ProposalPeriodStep';
import TzCardHeader from '@/components/common/tz_card_header'

export default {
  name: "ProposalPeriod",
  components: { ProposalPeriodStep, TzCardHeader },
  computed: {
  },
  data: () => ({
    proposal: {}
  }),
  methods: {
    async fetchProposal(id) {
      const data = await this.$api.getProposalPeriod({ id });
      const { status } = data;

      if (status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({ name: status });
      }

      this.proposal = data.data;
    }
  },
  created() {
    this.fetchProposal(this.$route.params.id);
  }
};
</script>
