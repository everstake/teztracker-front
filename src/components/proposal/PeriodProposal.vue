<template>
  <div class="vote__proposal margin-bottom">
    <CardSection :fluid="true">
      <template>
        <b-row>
          <b-col cols="12" sm="10" md="12" lg="12" xl="4" offset-cols="0" offset-sm="1" offset-md="0" class="vote__info margin-bottom">
            <div class="vote-card vote-card__container--height-equal vote-card-chart">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card--margin-none vote-card__font-size--16 vote-card__weight--bold font font-mini">
                    Proposals
                  </p>
                </div>
                <div class="vote-card__divider"></div>
                <div class="vote__chart-container">
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
            </div>
          </b-col>

          <b-col cols="12" sm="10" md="12" lg="12" xl="8" offset-cols="0" offset-sm="1" offset-md="0" class="vote__info margin-bottom">
            <div class="vote-card vote-card__container--height-equal">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card--margin-none vote-card__font-size--16 vote-card__weight--bold font font-mini">
                    General voting stats
                  </p>
                </div>
                <div class="vote-card__divider"></div>
                <div class="vote-card__body">
                  <p class="vote-card__font-size--14 vote-card__weight--bold font font--mini">
                    Recent Votes
                  </p>
                  <div
                    class="vote-card__recent"
                    v-for="voter in voters.slice(0, 4)"
                    :key="generateKey()"
                  >
                    <div>
                      <div class="vote-card__recent-name font font--mini">
                        {{ voter.title || voter.pkh }}
                      </div>
                      <div class="vote-card__recent-proposal font font--mini">
                        <span>Proposal:</span> {{ voter.proposal | longhash(15) }}
                      </div>
                    </div>
                    <div class="vote-card__recent-rolls font font--mini">{{ voter.rolls }}</div>
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
                    :id="proposal.hash"
                    class="vote-card__title-wrapper vote-card--pointer"
                  >
                    <p :ref='proposal.hash' class="vote-card__upvote-title vote-card__word-wrap vote-card__font-size--36 vote-card__weight--bold font font--mini">{{ proposal.title || proposal.hash }}<span class="icon vote-card__icon"><font-awesome-icon class="icon-primary" :icon="['fas', 'copy']"/></span></p>
                    <b-tooltip ref="tooltip" triggers="hover" :target="proposal.hash">Copy to clipboard</b-tooltip>
                  </div>
                  <p class="vote-card__font-size--36 vote-card__upvote-item font font--mini">
                    <span class="vote-card__weight--lighter">Upvotes:</span> {{proposal.upvote}}%
                  </p>
                </div>
                <div class="vote-card__title vote-card__font-size--18 font font--mini">
                  <span class="vote-card__weight--lighter">ID:</span> {{ proposal.period }}
                </div>
                <div class="vote-card__divider"></div>
                <p class="vote-card__font-size--18 vote-card__proposal-description font font--mini" v-html="proposal.shortDescription"></p>
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
  props: ['proposal', 'voters', 'proposals', 'backgroundColors', 'getDoughnutLegendPosition'],
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
    handleResize() {
      this.$emit('setDoughnutLegendPosition', window.innerWidth);
    }
	},
  computed: {
    getDoughnutOptions() {
      const proposalsCount = this.proposals.length;
      const { votesAvailable } = this.proposal.voteStats;
      const options = {};

      if (proposalsCount === 1) {
        options.data = [
          ...this.proposals.map(({ upvote }) => upvote),
          ...this.proposals.map(proposal => {
            return this.getPercentage([votesAvailable, votesAvailable - proposal.votesCasted]).toFixed(2);
          })
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
      options.legend = this.getDoughnutLegendPosition;

      return options;
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>
