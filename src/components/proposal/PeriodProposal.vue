<template>
  <div class="vote__proposal">
    <CardSection :fluid="true" class="mb-5">
      <template>
        <b-row>
          <b-col cols="12" sm="10" md="5" lg="5" xl="5" offset-cols="0" offset-sm="1" offset-md="0" class="vote__info">
            <div class="vote-card vote-card__container--height-equal">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card--margin-none vote-card__font-size--16 vote-card__weight--bold">
                    Proposals
                  </p>
                </div>
                <div class="vote-card__divider"></div>
                <div class="vote-card__chart vote__chart">
                  <DoughnutChart :options="getDoughnutOptions" :backgroundColors="backgroundColors"/>
                </div>
                <div class="vote-card__container--space-between vote-card__container--wrap mt-5">
                  <div
                    v-for="(upvote, index) in getDoughnutOptions.data"
                    :key="generateKey()"
                    class="vote-chart__label"
                    :style="{
                      color: backgroundColors[index]
                    }"
                  >
                    {{ upvote }}%
                  </div>
                </div>
              </div>
            </div>
          </b-col>

          <b-col cols="12" sm="10" md="7" lg="7" xl="7" offset-cols="0" offset-sm="1" offset-md="0" class="vote__info">
            <div class="vote-card vote-card__container--height-equal">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card--margin-none vote-card__font-size--16 vote-card__weight--bold">
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
                    v-for="voter in voters.slice(0, 4)"
                    :key="generateKey()"
                  >
                    <div>
                      <div class="vote-card__recent-name">
                        {{ voter.title || voter.pkh }}
                      </div>
                      <div class="vote-card__recent-proposal">
                        <span>Proposal:</span> {{ voter.proposal | longhash(15) }}
                      </div>
                    </div>
                    <div class="vote-card__recent-rolls">{{ voter.rolls }}</div>
                  </div>
                  <div class="vote-card__divider"></div>
                  <b-row>
                    <b-col class="vote-card__progress" cols="12" sm="12" md="12" lg="6" xl="6">
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
                    <b-col class="vote-card__progress" cols="12" sm="12" md="12" lg="6" xl="6">
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
        <b-row>
          <b-col cols="12" sm="10" md="12" lg="12" xl="12" offset-cols="0" offset-sm="1" offset-md="0">
            <div class="vote-card">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between vote-card__upvote">
                  <div
                    @click="copyToClipboard(proposal.hash)"
                    id="card-title"
                    class="vote-card__title-wrapper vote-card--pointer"
                  >
                    <p :ref='proposal.hash' class="vote-card__upvote-title vote-card__word-wrap vote-card__font-size--36 vote-card__weight--bold">{{ proposal.title || proposal.hash }}<span class="icon vote-card__icon"><font-awesome-icon class="icon-primary" :icon="['fas', 'copy']"/></span></p>
                    <b-tooltip ref="tooltip" triggers="hover" target="card-title">Copied to clipboard</b-tooltip>
                  </div>
                  <p class="vote-card__font-size--36">
                    <span class="vote-card__weight--lighter">Upvotes:</span> {{proposal.upvote}}%
                  </p>
                </div>
                <div class="vote-card__title vote-card__font-size--18">
                  <span class="vote-card__weight--lighter">ID:</span> {{ proposal.period }}
                </div>
                <div class="vote-card__divider"></div>
                <p class="vote-card__font-size--18 vote-card__proposal-description" v-html="proposal.shortDescription"></p>
              </div>
            </div>
          </b-col>
        </b-row>
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
  props: ['proposal', 'voters', 'proposals', 'backgroundColors'],
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

      if (proposalsCount === 1) {
        options.data = [
          ...this.proposals.map(({ upvote }) => upvote > 1 ? upvote : upvote * 100),
          ...this.proposals.map(({ upvote }) => upvote > 1 ? 100 - upvote : 1 - upvote * 100)
        ];

        options.labels = [
          ...this.proposals.map(proposal => proposal.title || this.$options.filters.longhash(proposal.hash)),
          'Undecided'
        ];
      }

      if (proposalsCount > 1) {
        options.data = this.proposals.map(({ upvote }) => upvote);
        options.labels = this.proposals.map(proposal => proposal.title || this.$options.filters.longhash(proposal.hash))
      }

      options.percents = true;

      return options;
    }
  }
};
</script>
