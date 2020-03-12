<template>
	<div class="vote__testing">
		<CardSection :fluid="true">
			<template>
				<b-row>
					<b-col  cols="12" sm="10" md="12" lg="12" xl="12" offset-cols="0" offset-sm="1" offset-md="0">
						<div class="vote-card">
							<div class="vote-card__header">
								<div class="vote-card__container-space-between">
									<p class="vote-card--margin-none vote-card__font-size--16 vote-card__weight--bold font font--mini">
										Proposal Description
									</p>
								</div>
								<div class="vote-card__divider"></div>
								<div class="vote-card__body">
									<p class="vote-card__font-size--18 vote-card__weight--bold font font--mini">
										{{ proposal.proposal.title }}
									</p>
									<p class="vote-card--margin-none vote-card__recent-name vote-card__proposal-description font font--mini" v-html="proposal.proposal.shortDescription"></p>
									<div class="vote-card__divider"></div>
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
import uuid from '@/mixins/uuid';
import CardSection from "@/components/partials/CardSection";

export default {
  name: 'PeriodTesting',
	components: {CardSection},
	props: ['voters', 'proposal'],
	mixins: [uuid]
}
</script>
