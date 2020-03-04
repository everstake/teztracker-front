<template>
  <CardSection :fluid="true">
    <template>
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
</template>

<script>
import CardSection from '@/components/partials/CardSection';

export default {
  name: "PeriodExploration",
	components: {CardSection},
  props: ["proposal"]
};
</script>
