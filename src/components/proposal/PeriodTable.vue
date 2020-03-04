<template>
	<div class="vote__table">
		<CardSection :fluid="true">
		<template>
			<div class="card ml-2 mr-2">
				<!-- Nav tabs -->
				<ul class="nav nav-tabs">
					<li class="nav-item">
						<a class="nav-link active" data-toggle="tab" href="#voters"
						>Voters</a
						>
					</li>
					<li class="nav-item">
						<a class="nav-link" data-toggle="tab" href="#non-voters"
						>Non-voters</a
						>
					</li>
				</ul>
				
				<!-- Tab panes -->
				<div class="tab-content">
					<div class="tab-pane active" id="voters">
						<div class="card-header">
							<div class="title">
								<h3>
									<span class="text">Voters list</span>
								</h3>
							</div>
						</div>
						
						<div class="card-body">
							<!-- voters table start -->
							<b-table
								show-empty
								stacked="md"
								:items="voters"
								:fields="votersFields"
								:current-page="currentPage"
								:per-page="0"
								class="transactions-table table table-borderless table-responsive-md"
							>
								<template slot="pkh" slot-scope="row">
									<b-link :to="{ name: 'baker', params: { baker: row.item.pkh } }">
										<span>{{ row.item.name || row.item.pkh | longhash(35) }}</span>
									</b-link>
								</template>
								
								<template slot="blockLevel" slot-scope="row">
									<b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
										<span>{{ row.item.blockLevel }}</span>
									</b-link>
								</template>
								
								<template slot="operation" slot-scope="row">
									<b-link :to="{ name: 'tx', params: { txhash: row.item.operation } }">
										<span>{{ row.item.operation | longhash(35) }}</span>
									</b-link>
								</template>
							</b-table>
							
							<Pagination
								v-model="currentPage"
								:total-rows="voters.length"
								:per-page="perPage"
							/>
							<!-- voters table end -->
						</div>
					</div>

					<div class="tab-pane" id="non-voters">
						<div class="card-header">
							<div class="title">
								<h3>
									<span class="text">Non-voters list</span>
								</h3>
							</div>
						</div>

						<div class="card-body">
							<!-- non-voters table start -->
							<b-table
								show-empty
								stacked="md"
								:items="nonVoters"
								:fields="nonVotersFields"
								:current-page="currentPage"
								:per-page="0"
								class="transactions-table table table-borderless table-responsive-md"
							>
								<template slot="pkh" slot-scope="row">
									<b-link :to="{ name: 'baker', params: { baker: row.item.pkh } }">
										<span>{{ row.item.name || row.item.pkh | longhash(35) }}</span>
									</b-link>
								</template>
							</b-table>

							<Pagination
								v-model="currentPage"
								:total-rows="voters.length"
								:per-page="perPage"
							/>
							<!-- non-voters table end -->
						</div>
					</div>
				</div>
			</div>
		</template>
	</CardSection>
	</div>
</template>

<script>
import CardSection from "@/components/partials/CardSection";
import Pagination from '@/components/partials/Pagination';

export default {
  name: 'PeriodTable',
	components: {
    CardSection,
    Pagination
	},
	props: [
	  'voters',
		'nonVoters',
		'votersFields',
		'nonVotersFields'
	],
	data() {
    return {
      perPage: 20,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
    }
	}
}
</script>
