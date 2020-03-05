<template>
  <div class="vote__exploration">
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
                <DoughnutChart
                  :options="{
                    data: [proposal.ballots.yay, proposal.ballots.nay, proposal.ballots.pass],
                    labels: ['Yay', 'Nay', 'Pass']
                }"
                  :backgroundColors="backgroundColors"
                />
                <div class="vote-card__container--space-between vote-card__container--wrap">
                  <div
                    v-for="(percentage, index) in getDoughnutOptions.percentage"
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
          </b-col>

          <b-col cols="8">
            <div class="vote-card">
              <div class="vote-card__header">
                <div class="vote-card__container-space-between">
                  <p class="vote-card__font-size--16 vote-card__weight--bold">
                    {{ proposal.proposal.name || proposal.proposal.hash }}
                  </p>
                </div>
                <div class="vote-card__divider"></div>
                <div class="vote-card__recent">
                  <div>
                    <div class="vote-card__recent-name">
                      Hash
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls">{{ proposal.proposal.hash }}</div>
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
                    <div class="vote-card__recent-name">
                      Percen of votes
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls">
                    {{getPercentage([proposal.voteStats.votesAvailable, proposal.voteStats.votesCast]).toFixed(2)}}%
                  </div>
                </div>
                <div class="vote-card__recent">
                  <div>
                    <div class="vote-card__recent-name">
                      Bakers vote
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls">
                    {{ proposal.voteStats.numVoters }} /
                    {{ proposal.voteStats.numVotersTotal }}
                  </div>
                </div>
                <div class="vote-card__recent">
                  <div>
                    <div class="vote-card__recent-name">
                      Votes cast
                    </div>
                  </div>
                  <div class="vote-card__recent-rolls">
                    {{ proposal.voteStats.votesCast }}
                  </div>
                </div>
                <div class="vote-card__divider"></div>
              </div>
            </div>
          </b-col>
        </b-row>
      </template>
    </CardSection>

    <CardSection :fluid="true">
      <template>
        <b-row>
          <b-col cols="4">
            <div class="vote-card">
              <div class="vote__ballot ballot">
                <img class="ballot__icon" src="../../assets/icons/yay.svg" alt="In favor">
                <div class="ballot__container">
                  <span class="vote__ballot--yay">
                    {{getPercentage([proposal.voteStats.votesAvailable, proposal.ballots.yay]).toFixed()}}%
                    ({{ proposal.ballots.yay }})
                  </span>
                  In favor
                </div>
              </div>
            </div>
          </b-col>

          <b-col cols="4">
            <div class="vote-card">
              <div class="vote__ballot ballot">
                <img class="ballot__icon" src="../../assets/icons/nay.svg" alt="Against">
                <div class="ballot__container">
                  <span class="vote__ballot--nay">
                    {{
                      getPercentage([proposal.voteStats.votesAvailable, proposal.ballots.nay]).toFixed() > 1 ?
                      getPercentage([proposal.voteStats.votesAvailable, proposal.ballots.nay]).toFixed() :
                      getPercentage([proposal.voteStats.votesAvailable, proposal.ballots.nay]).toFixed(2)
                    }}%
                    ({{ proposal.ballots.nay }})
                  </span>
                  Against
                </div>
              </div>
            </div>
          </b-col>

          <b-col cols="4">
            <div class="vote-card">
              <div class="vote__ballot ballot">
                <img class="ballot__icon" src="../../assets/icons/pass.svg" alt="Pass">
                <div class="ballot__container">
                  <span class="vote__ballot--pass">
                    {{getPercentage([proposal.voteStats.votesAvailable, proposal.ballots.pass]).toFixed()}}%
                    ({{ proposal.ballots.pass }})
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

export default {
  name: "PeriodExploration",
	components: {
    CardSection,
    DoughnutChart
  },
  props: [
    "proposal",
    'voters',
    'backgroundColors'
  ],
  mixins: [uuid],
  methods: {
    getPercentage(arr) {
      const [a, b] = arr;
      return (b * 100) / a;
    }
  },
  computed: {
    getDoughnutOptions() {
      const { yay, nay, pass } = this.proposal.ballots;
      const votes = [yay, nay, pass];
      const { votesAvailable } = this.proposal.voteStats;

      const votePercentage = votes.map(vote => {
        const percentage = this.getPercentage([votesAvailable, vote]);

        if (percentage < 1) {
          return percentage.toFixed(2);
        }

        return percentage.toFixed();
      });

      const options = {
        data: [yay, nay, pass],
        labels: ['Yay', 'Nay', 'Pass'],
        percentage: [...votePercentage]
      };

      return options;
    }
  }
};
</script>
