<template>
	<CardSection :fluid="true">
		<template>
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
</template>

<script>
import uuid from '@/mixins/uuid';
import CardSection from "@/components/partials/CardSection";

export default {
  name: 'PeriodTesting',
	components: {CardSection},
	props: ['voters'],
	mixins: [uuid]
}
</script>
