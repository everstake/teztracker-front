<template>
  <div>
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
                    <DoughnutChart
                      :options="{
                        data: [proposal.ballots.yay, proposal.ballots.nay, proposal.ballots.pass],
                        labels: ['Yay', 'Nay', 'Pass'],
                        percents: false,
                        legend: getDoughnutLegendPosition
                    }"
                      :backgroundColors="backgroundColors"
                    />
                  </div>
                  <div class="vote-card__container--space-between vote-card__container--wrap mt-5">
                  <div
                    v-for="(percentage, index) in getVotesPercentage"
                    :key="generateKey()"
                    class="vote-chart__label"
                    :style="{
                    color: backgroundColors[index]
                  }"
                  >
                    {{ percentage }}%
                  </div>
                </div>
                </div>
              </div>
            </div>
          </b-col>
          <!--separate-->
          <b-col cols="12" sm="10" md="12" lg="12" xl="8" offset-cols="0" offset-sm="1" offset-md="0" class="vote__info margin-bottom">
            <div class="vote-card vote-card__container--height-equal">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card--margin-none vote-card__font-size--16 vote-card__weight--bold">
                    {{ proposal.proposal.title || proposal.proposal.hash }}
                  </p>
                </div>
                <div class="vote-card__divider"></div>
                <div class="vote-card__recent">
                  <div>
                    <div class="vote-card__recent-name font font--mini">
                      Hash
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls font font--mini">{{ proposal.proposal.hash }}</div>
                </div>
                <div class="vote-card__recent font font--mini">
                  <div>
                    <div class="vote-card__recent-name font font--mini">
                      Proposer
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls font font--mini">{{ proposal.proposal.proposer.name }}</div>
                </div>
                <div class="vote-card__recent">
                  <div>
                    <div class="vote-card__recent-name font font--mini">
                      Proposer file
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls font font--mini">
                    <a :href="proposal.proposal.proposalFile" class="vote-card__link vote-card__link--active" target="_blank">{{ proposal.proposal.proposalFile }}</a>
                  </div>
                </div>
                <b-row class="mb-3 mt-3">
                  <b-col class="mt-3 mb-3" cols="12">
                    <div class="vote-card__container-space-between">
                      <span
                        class="vote-card__percentage vote-card-supermajority"
                        :style="{left: `${proposal.ballots.supermajority}%`}"
                      >
                        Supermajority
                        {{ proposal.ballots.supermajority }}%
                      </span>
                    </div>
                    <b-progress
                      :value="proposal.ballots.supermajority"
                      :max="100"
                      class="mb-2"
                    />
                  </b-col>

                  <b-col cols="12">
                    <div class="vote-card__container-space-between">
                      <span class="vote-card__percentage vote-card-quorum"
                            :style="{left: `${(proposal.ballots.quorum * 100).toFixed(2)}%`}"
                      >
                        Quorum
                        {{(proposal.ballots.quorum * 100).toFixed(2)}}%
                      </span>
                    </div>
                    <b-progress
                      :value="proposal.ballots.quorum"
                      :max="1"
                      class="mb-2"
                    />
                  </b-col>
                </b-row>
                <div class="vote-card__recent">
                  <div>
                    <div class="vote-card__recent-name font font--mini">
                      Percen of votes
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls font font--mini">
                    {{getPercentage([proposal.voteStats.votesAvailable, proposal.voteStats.votesCast]).toFixed(2)}}%
                  </div>
                </div>
                <div class="vote-card__recent">
                  <div>
                    <div class="vote-card__recent-name font font--mini">
                      Bakers vote
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls font font--mini">
                    {{ proposal.voteStats.numVoters }} /
                    {{ proposal.voteStats.numVotersTotal }}
                  </div>
                </div>
                <div class="vote-card__recent font font--mini">
                  <div>
                    <div class="vote-card__recent-name font font--mini">
                      Votes cast
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls font font--mini">
                    {{ proposal.voteStats.votesCast }}
                  </div>
                </div>
                <div class="vote-card__container-space-between">
                 <span class="vote-card__percentage"><span class="vote-card__percentage-label">Period starts:</span> {{ formatToCalendarDate(proposal.period.startTime, 'DD.MM.YY') }}</span>
                 <span class="vote-card__percentage"><span class="vote-card__percentage-label">Period ends:</span> {{ formatToCalendarDate(proposal.period.endTime, 'DD.MM.YY') }}</span>
                </div>
                <b-progress
                  :value="formatToUnixTime(proposal.period.startTime)"
                  :max="formatToUnixTime(proposal.period.endTime)"
                  class="mb-2"
                />
                <div class="vote-card__divider"></div>
              </div>
            </div>
          </b-col>
        </b-row>
      </template>
    </CardSection>

    <CardSection :fluid="true" class="ballots margin-bottom">
      <template>
        <b-row>
          <b-col cols="12" sm="10" md="4" offset-cols="0" offset-sm="1" offset-md="0" class="ballot__col">
            <div class="vote-card margin-bottom">
              <div
                @click="enableSorting('yay')"
                :class="{'vote__ballot--active': sortBy === 'yay'}"
                class="vote__ballot ballot"
              >
                <img class="ballot__icon" src="../../assets/icons/yay.svg" alt="In favor">
                <div class="ballot__container font font--mini">
                  <span class="vote__ballot--yay font font--mini">
                    {{getVotesPercentage[0]}}%
                    ({{ getVotes.yay }})
                  </span>
                  In favor
                </div>
              </div>
            </div>
          </b-col>
          <b-col cols="12" sm="10" md="4" offset-cols="0" offset-sm="1" offset-md="0" class="ballot__col">
            <div class="vote-card margin-bottom">
              <div
                @click="enableSorting('nay')"
                :class="{'vote__ballot--active': sortBy === 'nay'}"
                class="vote__ballot ballot"
              >
                <img class="ballot__icon" src="../../assets/icons/nay.svg" alt="Against">
                <div class="ballot__container font font--mini">
                  <span class="vote__ballot--nay font font--mini">
                    {{getVotesPercentage[1]}}%
                    ({{ getVotes.nay }})
                  </span>
                  Against
                </div>
              </div>
            </div>
          </b-col>
          <b-col cols="12" sm="10" md="4" offset-cols="0" offset-sm="1" offset-md="0" class="ballot__col">
            <div class="vote-card">
              <div
                @click="enableSorting('pass')"
                :class="{'vote__ballot--active': sortBy === 'pass'}"
                class="vote__ballot ballot"
              >
                <img class="ballot__icon" src="../../assets/icons/pass.svg" alt="Pass">
                <div class="ballot__container font font--mini">
                  <span class="vote__ballot--pass font font--mini">
                    {{getVotesPercentage[2]}}%
                    ({{ getVotes.pass }})
                  </span>
                  Pass
                </div>
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
import uuid from '@/mixins/uuid';
import DoughnutChart from "@/components/partials/DoughnutChart";
import moment from 'moment';

export default {
  name: "PeriodExploration",
	components: {
    CardSection,
    DoughnutChart
  },
  props: [
    "proposal",
    'voters',
    'backgroundColors',
    'sortBy',
    'getDoughnutLegendPosition'
  ],
  mixins: [uuid],
  methods: {
    enableSorting(arg) {
      this.$emit('sortTableBy', arg)
    },
    formatToCalendarDate(date, format) {
      return moment(date).format(format);
    },
    formatToUnixTime(date) {
      return moment(date).unix();
    },
    getPercentage(arr) {
      const [a, b] = arr;
      return (b * 100) / a;
    },
    handleResize() {
      this.$emit('setDoughnutLegendPosition', window.innerWidth);
    }
  },
  computed: {
    getVotes() {
      const { yay = 0, nay = 0, pass = 0 } = this.proposal.ballots;
      return {yay, nay, pass}
    },
    getVotesPercentage() {
      const { votesAvailable } = this.proposal.voteStats;
      const { yay = 0, nay = 0, pass = 0 } = this.proposal.ballots;
      const votes = [yay, nay, pass];

      const votePercentage = votes.map(vote => {
        const percentage = this.getPercentage([votesAvailable, vote]);

        if (percentage === 0) return percentage.toFixed();

        if (percentage < 1) {
          return percentage.toFixed(2);
        }

        return percentage.toFixed();
      });

      return votePercentage;
    },
    getDoughnutOptions() {
      const { yay = 0, nay = 0, pass = 0 } = this.proposal.ballots;

      console.log(this.getDoughnutLegendPosition);

      const options = {
        data: [yay, nay, pass],
        labels: ['Yay', 'Nay', 'Pass'],
        percentage: [...this.getVotesPercentage],
        legend: this.getDoughnutLegendPosition
      };


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
