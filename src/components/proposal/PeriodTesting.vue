<template>
	<div class="vote__testing">
		<CardSection :fluid="true">
			<template>
				<b-row>
					<b-col cols="12">
						<div class="vote-card">
							<div class="vote-card__header">
								<div class="vote-card__container-space-between">
									<p class="vote-card__font-size--16 vote-card__weight--bold">
										No data
									</p>
								</div>
								<div class="vote-card__divider"></div>
								<div class="vote-card__body">
									<p class="vote-card__font-size--14 vote-card__weight--bold">
										No data
									</p>
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
	props: ['voters'],
	mixins: [uuid]
}
</script>
