<template>
	<div class="vote__breadcrubs">
		<CardSection class="tz-breadcrumbs" :fluid="true">
			<template>
				<div class="page-title ml-2">
					<h2 class="font font--mini tz-breadcrumbs__title">
						Tezos (XTZ) Blockchain Explorer -
						<span>Proposal period</span>
					</h2>
				</div>
	
				<ol class="ml-2 tz-breadcrumbs__list">
					<li class="font font--mini tz-breadcrumbs__item">
						<router-link :to="{ name: 'network' }" class="tz-breadcrumbs__link">Home</router-link>
					</li>
					<li class="active font font--mini tz-breadcrumbs__item">Proposal period</li>
				</ol>
			</template>
		</CardSection>
	</div>
</template>

<script>
import CardSection from "@/components/partials/CardSection";

export default {
  name: 'PeriodBreadcrumbs',
	components: {CardSection},
	props: ['currentPeriodType']
}
</script>
