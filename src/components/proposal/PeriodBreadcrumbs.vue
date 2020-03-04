<template>
	<CardSection class="breadcrumbs vote-breadcrumbs" :fluid="true">
		<template>
			<div class="page-title ml-2">
				<h2 class="breadcrumbs__title">
					Tezos (XTZ) Blockchain Explorer -
					<span>Proposal period</span>
				</h2>
			</div>

			<ol class="breadcrumb ml-2">
				<li class="breadcrumb-item">
					<router-link :to="{ name: 'network' }">Home</router-link>
				</li>
				<li class="breadcrumb-item active">Proposal period</li>
			</ol>
		</template>
	</CardSection>
</template>

<script>
import CardSection from "@/components/partials/CardSection";

export default {
  name: 'PeriodBreadcrumbs',
	components: {CardSection},
	props: ['currentPeriodType']
}
</script>
