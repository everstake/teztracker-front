<template>
  <div class="vote__proposal">
    <CardSection :fluid="true">
      <template>
        <b-row>
          <b-col cols="4">
            <div class="vote-card">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card__font-size--16 vote-card__weight--bold">
                    Proposals
                  </p>
                </div>
                <div class="vote-card__divider"></div>
                <DoughnutChart :options="getDoughnutOptions"/>
              </div>
            </div>
          </b-col>

          <b-col cols="8">
            <div class="vote-card">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card__font-size--16 vote-card__weight--bold">
                    General voting stats
                  </p>
                </div>
                <div class="vote-card__divider"></div>
                <div class="vote-card__body">
                  <p class="vote-card__font-size--14 vote-card__weight--bold">
                    Recent Votes
                  </p>
                  <div
                    class="vote-card__recent"
                    v-for="voter in voters.slice(0, 3)"
                    :key="generateKey()"
                  >
                    <div>
                      <div class="vote-card__recent-name">
                        {{ voter.name || voter.pkh }}
                      </div>
                      <div class="vote-card__recent-proposal">
                        <span>Proposal:</span> {{ voter.proposal | longhash(15) }}
                      </div>
                    </div>
                    <div class="vote-card__recent-rolls">{{ voter.rolls }}</div>
                  </div>
                  <div class="vote-card__divider"></div>
                  <b-row>
                    <b-col cols="6">
                      <div class="vote-card__container-space-between">
                    <span class="vote-card__percentage">
                      {{getPercentage([proposal.voteStats.votesAvailable, proposal.voteStats.votesCast]).toFixed(2)}}%
                    </span>
                        <span class="vote-card__percentage"
                        >{{ proposal.voteStats.votesCast }} /
                      {{ proposal.voteStats.votesAvailable }}</span
                        >
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
                      <div class="vote-card__p">
                        Bakers {{ proposal.voteStats.numVoters }} /
                        {{ proposal.voteStats.numVotersTotal }}
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="vote-card__container-space-between">
                    <span class="vote-card__percentage"
                    >{{
                        getPercentage([
                          proposal.voteStats.votesAvailable,
                          proposal.voteStats.votesAvailable -
                            proposal.voteStats.votesCast
                        ]).toFixed(2)
                      }}%</span
                    >
                        <span class="vote-card__percentage"
                        >{{
                        proposal.voteStats.votesAvailable -
                          proposal.voteStats.votesCast
                      }}
                      / {{ proposal.voteStats.votesAvailable }}</span
                        >
                      </div>
                      <b-progress
                        :value="proposal.voteStats.votesAvailable - proposal.voteStats.votesCast"
                        :max="proposal.voteStats.votesAvailable"
                        class="mb-2"
                      />
                      <div class="vote-card__container-space-between">
                        <span class="vote-card__percentage">Undecided</span>
                        <span class="vote-card__percentage">Votes Availaible</span>
                      </div>
                      <div class="vote-card__p">
                        Non-voters
                        {{ proposal.voteStats.numVotersTotal - proposal.voteStats.numVoters }} / {{ proposal.voteStats.numVotersTotal }}
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

    <CardSection :fluid="true" v-for="proposal in proposals" :key="generateKey()">
    <template>
      <div class="vote-card">
        <div class="vote-card__header">
          <div class="vote-card__container-space-between">
            <div
              @click="copyToClipboard(proposal.hash)"
              id="card-title"
              class="vote-card__title-wrapper vote-card--pointer"
            >
              <p :ref='proposal.hash' class="vote-card__word-wrap vote-card__font-size--36 vote-card__weight--bold">{{ proposal.name || proposal.hash }}</p>
              <span class="icon vote-card__icon"><font-awesome-icon class="icon-primary" :icon="['fas', 'copy']"/></span>
              <b-tooltip ref="tooltip" triggers="hover" target="card-title">Copy to clipboard</b-tooltip>
            </div>
            <p class="vote-card__font-size--36">
              <span class="vote-card__weight--lighter">Upvotes:</span> {{proposal.upvote}}%
            </p>
          </div>
          <div class="vote-card__title vote-card__font-size--18">
            <span class="vote-card__weight--lighter">ID:</span> {{ proposal.period }}
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
  </div>
</template>

<script>
import CardSection from '@/components/partials/CardSection';
import DoughnutChart from "@/components/partials/DoughnutChart";
import uuid from '@/mixins/uuid'

export default {
  name: "PeriodProposal",
  components: {
    DoughnutChart,
    CardSection
  },
  props: ['proposal', 'voters', 'proposals'],
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
    }
	},
  computed: {
    getDoughnutOptions() {
      const proposalsCount = this.proposals.length;
      const options = {};

      if (proposalsCount > 1) {
        options.data = this.proposals.map(proposal => proposal.upvote);
      }

      options.data = this.proposals.map(proposal => proposal.upvote > 1 ? proposal.upvote : proposal.upvote * 100);
      options.labels = this.proposals.map(proposal => proposal.name || this.$options.filters.longhash(proposal.hash))

      return options;
    }
  }
};
</script>
