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
          <DoughnutChart />
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
                  <span class="vote-card__percentage"
                    >{{
                      getPercentage([
                        proposal.voteStats.votesAvailable,
                        proposal.voteStats.votesCast
                      ]).toFixed(2)
                    }}%</span
                  >
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
		              :value="proposal.voteStats.votesAvailable -proposal.voteStats.votesCast"
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

<script>
import DoughnutChart from "@/components/partials/DoughnutChart";
import uuid from '@/mixins/uuid'

export default {
  name: "PeriodProposal",
  components: {DoughnutChart},
  props: ['proposal', 'voters'],
	mixins: [uuid],
	methods: {
    getPercentage(arr) {
      const [a, b] = arr;
      return (b * 100) / a;
    }
	}
};
</script>
