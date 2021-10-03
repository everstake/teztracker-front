<template>
  <Tab :title="$t('common.stats')" :active="active">
    <template v-slot:body>
      <b-card no-body xl="6" class="mb-30">
        <CardHeader>
          <template #left-content class="text">
            <h4 class="tz-title--bold">
              {{ $t('nft.owners') }}
            </h4>
          </template>
        </CardHeader>

        <div class="card-divider" />

        <b-card-body>
          <div v-if="loading || !ownership" class="min-h-400 vote__loading">
            {{ $t('common.loading') }}
          </div>

          <PieChart
            v-else
            class="rolls-chart-container"
            :chart-data="ownershipChartData"
          />
        </b-card-body>
      </b-card>

      <b-card no-body xl="6" class="mb-30">
        <CardHeader>
          <template #left-content class="text">
            <h4 class="tz-title--bold">
              {{ $t('nft.operations') }}
            </h4>
          </template>
        </CardHeader>

        <div class="card-divider" />

        <b-card-body>
          <div v-if="loading || !ownership" class="min-h-400 vote__loading">
            {{ $t('common.loading') }}
          </div>

          <LineChart
            v-else
            :chart-data="operationsChartData"
            :x-axes-max-ticks-limit="28"
            :y-axes-begin-at-zero="false"
          />
        </b-card-body>
      </b-card>

      <b-card no-body xl="6" class="mb-30">
        <CardHeader>
          <template #left-content class="text">
            <h4 class="tz-title--bold">
              {{ $t('nft.nftDistribution') }}
            </h4>
          </template>
        </CardHeader>

        <div class="card-divider" />

        <b-card-body>
          <div v-if="loading || !ownership" class="min-h-400 vote__loading">
            {{ $t('common.loading') }}
          </div>

          <PieChart
            v-else
            class="rolls-chart-container"
            :chart-data="distributionChartData"
            @on-click="handleClickDistribution"
          />
        </b-card-body>
      </b-card>
    </template>
  </Tab>
</template>

<script>
  import Tab from '@/components/partials/Tab';
  import CardHeader from '@/components/partials/CardHeader';
  import chartsData from '@/mixins/charts/chartsData';
  import PieChart from '@/components/partials/chart-types/PieChart';
  import LineChart from '@/components/partials/chart-types/LineChart';

  export default {
    name: 'NftContractStatsTab',
    components: {
      Tab,
      CardHeader,
      PieChart,
      LineChart,
    },
    mixins: [chartsData],
    props: {
      active: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        loading: false,
        ownership: null,
        distribution: null,
        operations: null,
      };
    },

    computed: {
      address() {
        return this.$route.params.address;
      },

      ownershipChartData() {
        const data = [
          this.ownership.multi_owners - this.ownership.whales_count,
          this.ownership.single_owners,
          this.ownership.whales_count,
        ];

        return {
          datasets: [
            {
              data,
              backgroundColor: ['#0B6E4B', '#167881', '#5A837C'],
              borderWidth: 1,
            },
          ],
          labels: ['Multi Owners', 'Single Owners', 'Whales Owners'],
        };
      },

      operationsChartData() {
        return {
          labels: this.$_last30days,
          datasets: [
            {
              label: this.$t('nft.operationsPerDay'),
              data: this.operations.map((op) => ({
                y: op.operations,
                x: op.timestamp,
              })),
              spanGaps: true,
            },
          ],
        };
      },

      distributionChartData() {
        const top15 = this.distribution.distribution.slice(0, 15);
        const data = top15.map((d) => d.balance);
        const labels = top15.map((d) =>
          this.$helpers.truncateHash(d.account_id),
        );

        return {
          datasets: [
            {
              data,
              backgroundColor: [
                '#0B6E4B',
                '#178E64',
                '#339B76',
                '#51B08F',
                '#83CFB4',
                '#0A6858',
                '#168774',
                '#309282',
                '#4DA798',
                '#7FCABE',
                '#0B5C64',
                '#167881',
                '#2F848C',
                '#4C9AA1',
                '#7EC0C7',
              ],
              borderWidth: 1,
            },
          ],
          labels,
        };
      },
    },

    mounted() {
      this.fetch();
    },

    methods: {
      async fetch() {
        this.loading = true;

        await Promise.all([
          this.fetchOwnership(),
          this.fetchDistribution(),
          this.fetchOperations(),
        ]);

        this.loading = false;
      },

      async fetchOwnership() {
        try {
          const response = await this.$api.getNftOwnership({
            address: this.address,
          });

          this.ownership = response.data;
        } catch (e) {
          // eslint-disable-next-line
          console.error({ fetchOwnership: e });
        }
      },

      async fetchDistribution() {
        try {
          const response = await this.$api.getNftDistribution({
            address: this.address,
          });

          this.distribution = response.data;
        } catch (e) {
          // eslint-disable-next-line
          console.error({ fetchDistribution: e });
        }
      },

      async fetchOperations() {
        try {
          const response = await this.$api.getNftOperationsChart(
            {
              address: this.address,
            },
            {
              from: this.$_fromTimestamp,
              to: this.$_toTimestamp,
            },
          );

          this.operations = response.data;
        } catch (e) {
          // eslint-disable-next-line
          console.error({ fetchOperations: e });
        }
      },

      handleClickDistribution(point, event) {
        const item = event[0];

        this.$router.push({
          name: 'account',
          params: {
            account: this.distribution.distribution[item._index].account_id,
          },
        });

        window.scroll(0, 0);
      },
    },
  };
</script>
